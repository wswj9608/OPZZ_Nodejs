import communityClient from './communityDragonClient'
import { krRiotClient, asiaRiotClient } from './riotClient'
import {
  DbItem,
  RiotLeague,
  RiotMatch,
  RiotSummonerInfo,
  ResSummonerProfile,
  ResLeague,
  ResItem,
  ResMatch,
  ResMatches,
} from './types'
import { getConnection } from '../../util/mysql'
import * as query from '../../models/query'
import { arrayPushNull, sumDataInMatches, timeForToday } from '../../util'

const COMMUNITY_DRAGON_DEFAULT_BASE_URL = process.env.COMMUNITY_DRAGON_DEFAULT_BASE_URL

export const getSummonerProfile = async (summonerName: string): Promise<ResSummonerProfile> => {
  try {
    // summoner profile
    const { data: profileRes } = await krRiotClient.get<RiotSummonerInfo>(
      `/lol/summoner/v4/summoners/by-name/${summonerName}`
    )
    const { name, id, puuid, summonerLevel, profileIconId, accountId } = profileRes

    const { data: leaguesRes } = await krRiotClient.get<RiotLeague[]>(`/lol/league/v4/entries/by-summoner/${id}`)

    const leagues: ResLeague[] = leaguesRes.map(league => {
      const { queueType, leaguePoints, wins, losses, tier, rank } = league

      return { queueType, leaguePoints, tier, rank, wins, losses }
    })

    const summonerIconImageUrl = `${COMMUNITY_DRAGON_DEFAULT_BASE_URL}/v1/profile-icons/${profileIconId}.jpg`

    const summoner: ResSummonerProfile = {
      id: puuid,
      accountId,
      name,
      summonerLevel,
      summonerIconImageUrl,
      leagues,
    }

    // return summonerIcon;
    return summoner
  } catch (err) {
    return err.message
  }
}

const getItems = async (itemIds: number[]): Promise<ResItem[]> => {
  return new Promise((resolve, reject) => {
    getConnection(conn => {
      conn.query(query.selectItems, [[itemIds]], async (err, result: DbItem[]) => {
        if (err) {
          conn.rollback()
          reject()
        }

        const items = result.map(item => ({
          itemId: item.item_id,
          name: item.name,
          iconImageUrl: `${COMMUNITY_DRAGON_DEFAULT_BASE_URL}/assets/items/icons2d/${item.icon_name.toLowerCase()}`,
          description: item.description,
          totalGold: item.total_gold,
        }))

        const responseItems = arrayPushNull(items)

        resolve(responseItems)
      })
      conn.release()
    })
  })
}

const getSummonerSpellIcons = (
  spellIds: number[]
): Promise<{ image_url: string; spell_id: number; file_name: string }[]> => {
  return new Promise((resolve, reject) => {
    getConnection(conn => {
      conn.query(query.selectSpells, [[spellIds]], (err, result) => {
        if (err) reject(err)
        resolve(result)
      })

      conn.release()
    })
  })
}

export const getMatches = async (
  puuid: string,
  summonerName: string
): Promise<{ matches: ResMatches[]; statistics: any }> => {
  try {
    const { data: matchIds } = await asiaRiotClient.get<string[]>(
      `/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10`
    )

    const matches = await Promise.all(
      matchIds.map(async id => {
        const { data } = await asiaRiotClient.get<{ info: RiotMatch }>(`/lol/match/v5/matches/${id}`)

        const { gameId, gameEndTimestamp, gameDuration, participants, teams } = data.info

        const allMatchItemIds: number[] = []
        const allMatchSpellIds: number[] = []

        participants.forEach(el =>
          allMatchItemIds.push(el.item0, el.item1, el.item2, el.item3, el.item4, el.item5, el.item6)
        )
        participants.forEach(el => allMatchSpellIds.push(el.summoner1Id, el.summoner2Id))

        const uniqeItemIds = [...new Set(allMatchItemIds)]
        const uniqeSpellIds = [...new Set(allMatchSpellIds)]

        const allMatchItems = await getItems(uniqeItemIds)
        const allMatchSpells = await getSummonerSpellIcons(uniqeSpellIds)

        const gameDurationMinute = new Date(gameDuration * 1000).getMinutes()
        const gameDurationTime = new Date(gameDuration * 1000 + 1000).toISOString().slice(14, 19)
        const gameEndTimeStampForToday = timeForToday(new Date(gameEndTimestamp))

        const totalDamageDealtToChampionArr = participants.map(el => el.totalDamageDealtToChampions)
        const totalDamageTakenArr = participants.map(el => el.totalDamageTaken)

        const maxDamageToChampion = Math.max(...totalDamageDealtToChampionArr)
        const maxDamageTaken = Math.max(...totalDamageTakenArr)

        const playerMatchDatas = await Promise.all(
          participants.map(async participant => {
            const { item0, item1, item2, item3, item4, item5, item6, perks, summoner1Id, summoner2Id } = participant
            const { kda, killParticipation } = participant.challenges

            const itemIds = [item0, item1, item2, item3, item4, item5, item6]
            const items = itemIds.map(itemId => allMatchItems.find(item => item.itemId === itemId))

            const spellIds = [summoner1Id, summoner2Id]
            const spells = spellIds.map(spellId => allMatchSpells.find(spell => spell.spell_id === spellId))

            const minionsPerMinute = Number((participant.totalMinionsKilled / gameDurationMinute).toFixed(1))
            const primaryPerkId = perks.styles.find(style => style.description === 'primaryStyle')?.selections[0].perk
            const subPerkStyleId = perks.styles.find(style => style.description === 'subStyle')?.style

            const { totalDamageDealtToChampions, totalDamageDealt, totalDamageTaken } = participant

            const damageDealtToChampionPercent = Math.round((totalDamageDealtToChampions / maxDamageToChampion) * 100)
            const damageTakenPercent = Math.round((totalDamageTaken / maxDamageTaken) * 100)

            const matchResponseData: ResMatch = {
              summonerName: participant.summonerName,
              kills: participant.kills,
              assists: participant.assists,
              deaths: participant.deaths,
              champion: {
                championName: participant.championName,
                championLevel: participant.champLevel,
                championIcon: `${COMMUNITY_DRAGON_DEFAULT_BASE_URL}/v1/champion-icons/${participant.championId}.png`,
              },
              items,
              teamId: participant.teamId,
              win: participant.win,
              challenges: {
                kda: Number(kda.toFixed(2)),
                killParticipation: Math.round(killParticipation * 100),
              },
              visionWardsBoughtInGame: participant.visionWardsBoughtInGame,
              wradsKilled: participant.wardsKilled,
              wardsPlaced: participant.wardsPlaced,
              totalMinionsKilled: participant.totalMinionsKilled,
              minionsPerMinute,
              primaryPerkId,
              subPerkStyleId,
              summonerSpells: spells,
              totalDamageDealt,
              totalDamageDealtToChampions,
              totalDamageTaken,
              damageDealtToChampionPercent,
              damageTakenPercent,
            }

            return matchResponseData
          })
        )

        const friendlyTeamId = participants.find(el => el.puuid === puuid).teamId
        const friendlyTeam = teams.find(team => team.teamId === friendlyTeamId)
        const enemyTeam = teams.find(team => team.teamId !== friendlyTeamId)

        const totalGold: { [key: number]: number } = {
          100: 0,
          200: 0,
        }

        participants.forEach(({ teamId, goldEarned }) => {
          totalGold[teamId] += goldEarned
        })

        const match = {
          gameId,
          gameEndTimestamp: gameEndTimeStampForToday,
          gameDuration: gameDurationTime,
          playerMatchDatas,
          totalGold,
          friendlyTeam: {
            ...friendlyTeam,
            totalGold: totalGold[friendlyTeam.teamId],
          },
          enemyTeam: {
            ...enemyTeam,
            totalGold: totalGold[enemyTeam.teamId],
          },
        }

        return match
      })
    )

    const totalMatchNumber = matches.length
    const totalWins = matches.filter(match => match.friendlyTeam.win === true).length
    const totalLosses = totalMatchNumber - totalWins
    const averageKills = sumDataInMatches(matches, summonerName, 'kills') / totalMatchNumber
    const averageDeaths = Number((sumDataInMatches(matches, summonerName, 'deaths') / totalMatchNumber).toFixed(1))
    const averageAssists = sumDataInMatches(matches, summonerName, 'assists') / totalMatchNumber
    const totalTeamKills = matches.map(match => match.friendlyTeam.objectives.champion.kills).reduce((a, b) => a + b)
    const averageKda = Number(((averageKills + averageAssists) / averageDeaths).toFixed(2))
    const killParticipationRate = Math.round(
      ((sumDataInMatches(matches, summonerName, 'kills') + sumDataInMatches(matches, summonerName, 'assists')) /
        totalTeamKills) *
        100
    )

    const statistics = {
      totalMatchNumber,
      totalWins,
      totalLosses,
      averageKills,
      averageDeaths,
      averageAssists,
      averageKda,
      killParticipationRate,
    }
    return { matches, statistics }
  } catch (err) {
    return err.message
  }
}
