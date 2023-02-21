import communityClient from './communityDragonClient'
import { krRiotClient, asiaRiotClient } from './riotClient'
import { ItemDb, RiotLeague, Match, SummonerInfo, SummonerProfile, League, Item } from './types'
import { getConnection } from '../../util/mysql'
import * as query from '../../models/query'
import { arrayPushNull, timeForToday } from '../../util'

const COMMUNITY_DRAGON_DEFAULT_BASE_URL = process.env.COMMUNITY_DRAGON_DEFAULT_BASE_URL

const getLeagues = async (summonerId: string) => {
  try {
    const { data } = await krRiotClient.get<RiotLeague[]>(`/lol/league/v4/entries/by-summoner/${summonerId}`)
    const leagues = data.map(league => {
      const { queueType, leaguePoints, wins, losses, tier, rank } = league

      return { queueType, leaguePoints, tier, rank, wins, losses }
    })

    return leagues
  } catch (err) {
    return err.message
  }
}
export const getSummonerProfile = async (summonerName: string): Promise<SummonerProfile> => {
  try {
    // summoner profile
    const { data: profileRes } = await krRiotClient.get<SummonerInfo>(
      `/lol/summoner/v4/summoners/by-name/${summonerName}`
    )
    const { name, id, puuid, summonerLevel, profileIconId } = profileRes

    const { data: leaguesRes } = await krRiotClient.get<RiotLeague[]>(`/lol/league/v4/entries/by-summoner/${id}`)

    const leagues: League[] = leaguesRes.map(league => {
      const { queueType, leaguePoints, wins, losses, tier, rank } = league

      return { queueType, leaguePoints, tier, rank, wins, losses }
    })

    const summonerIconImageUrl = `${COMMUNITY_DRAGON_DEFAULT_BASE_URL}/v1/profile-icons/${profileIconId}.jpg`

    const summoner: SummonerProfile = {
      id: puuid,
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

const getItems = async (itemIds: number[]): Promise<Item[]> => {
  return new Promise((resolve, reject) => {
    getConnection(conn => {
      conn.query(query.selectItems, [[itemIds]], async (err, result: ItemDb[]) => {
        if (err) {
          conn.rollback()
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

export const getMatches = async (puuid: string): Promise<any[]> => {
  try {
    const { data: matchIds } = await asiaRiotClient.get<string[]>(
      `/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=2`
    )

    const matches = await Promise.all(
      matchIds.map(async id => {
        const { data } = await asiaRiotClient.get<Match>(`/lol/match/v5/matches/${id}`)

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

            const matchResponseData = {
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
              totalDamageDealt: participant.totalDamageDealt,
              totalDamageDealtToChampion: participant.totalDamageDealtToChampions,
              totalDamageTaken: participant.totalDamageTaken,
              damageDealtToChampionPercent,
              damageTakenPercent,
            }

            return matchResponseData
          })
        )

        const match = {
          gameId,
          gameEndTimestamp: gameEndTimeStampForToday,
          gameDuration: gameDurationTime,
          playerMatchDatas,
        }
        return match
      })
    )
    return matches
  } catch (err) {
    return err.message
  }
}
