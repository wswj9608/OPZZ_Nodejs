import communityClient from './communityDragonClient'
import { krRiotClient, asiaRiotClient } from './riotClient'
import { Item, Match, SummonerInfo, SummonerProfile } from './types'
import { getConnection } from '../../util/mysql'
import * as query from '../../models/query'
import { arrayPushNull } from '../../util'

const COMMUNITY_DRAGON_DEFAULT_BASE_URL = process.env.COMMUNITY_DRAGON_DEFAULT_BASE_URL

export const getSummonerProfile = async (summonerName: string): Promise<SummonerProfile> => {
  try {
    // summoner profile
    const { name, id, puuid, summonerLevel, profileIconId } = (
      await krRiotClient.get<SummonerInfo>(`/lol/summoner/v4/summoners/by-name/${summonerName}`)
    ).data
    const summonerIconImageUrl = `${COMMUNITY_DRAGON_DEFAULT_BASE_URL}/profile-icons/${profileIconId}.jpg`

    const summoner: SummonerProfile = {
      id: puuid,
      name,
      summonerLevel,
      summonerIconImageUrl,
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
      conn.query(query.selectItems, [[itemIds]], async (err, result) => {
        if (err) {
          conn.rollback()
        }
        const items = arrayPushNull(result)

        resolve(items)
      })
      conn.release()
    })
  })
}

export const getSummonerSpellIcons = (
  spellId1: number,
  spellId2: number
): Promise<{ image_url: string; spell_id: number; file_name: string }[]> => {
  return new Promise((resolve, reject) => {
    getConnection(conn => {
      conn.query(query.selectSpells, [String(spellId1), String(spellId2)], (err, result) => {
        if (err) reject(err)
        resolve(result)
      })

      conn.release()
    })
  })
}

export const getMatches = async (puuid: string, searchName: string): Promise<any[]> => {
  try {
    const matchIds = (await asiaRiotClient.get<string[]>(`/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=2`))
      .data
    console.log(matchIds)

    const matches = await Promise.all(
      matchIds.map(async id => {
        const res: Match = (await asiaRiotClient.get(`/lol/match/v5/matches/${id}`)).data

        const { gameId, gameEndTimestamp, gameDuration, participants, teams } = res.info

        const allMatchItemIds: number[] = []
        const allMatchSpellIds: number[] = []

        participants.forEach(el =>
          allMatchItemIds.push(el.item0, el.item1, el.item2, el.item3, el.item4, el.item5, el.item6)
        )
        participants.forEach(el => allMatchSpellIds.push(el.summoner1Id, el.summoner2Id))

        const uniqeItemIds = [...new Set(allMatchItemIds)]
        const uniqeSpellIds = [...new Set(allMatchSpellIds)]

        const allMatchItems = await getItems(uniqeItemIds)
        // const spells = await

        console.log(uniqeItemIds)
        console.log(allMatchItems)

        const gameDurationMinute = new Date(gameDuration * 1000).getMinutes()
        const searchSummonerTeamId = participants.find(el => el.summonerName === searchName).teamId
        const searchSummonerTeam = teams.find(team => team.teamId === searchSummonerTeamId)

        const playerMatchDatas = await Promise.all(
          participants.map(async participant => {
            const { item0, item1, item2, item3, item4, item5, item6, perks, summoner1Id, summoner2Id } = participant
            const { kda, killParticipation } = participant.challenges

            // const itemIds = [item0, item1, item2, item3, item4, item5, item6]
            const items = allMatchItems.find(
              el =>
                el.item_id === item0 ||
                el.item_id === item1 ||
                el.item_id === item2 ||
                el.item_id === item3 ||
                el.item_id === item4 ||
                el.item_id === item5 ||
                el.item_id === item6
            )
            const minionsPerMinute = Number((participant.totalMinionsKilled / gameDurationMinute).toFixed(1))
            const primaryPerkId = perks.styles.find(style => style.description === 'primaryStyle')?.selections[0].perk
            const subPerkStyleId = perks.styles.find(style => style.description === 'subStyle')?.style
            const summonerSpells = await getSummonerSpellIcons(summoner1Id, summoner2Id)
            // const summonerSpell1 = summonerSpells.find(spell => spell.spell_id === participant.summoner1Id)

            const data = {
              summonerName: participant.summonerName,
              kills: participant.kills,
              assists: participant.assists,
              deaths: participant.deaths,
              champion: {
                championName: participant.championName,
                championLevel: participant.champLevel,
                championIcon: `${COMMUNITY_DRAGON_DEFAULT_BASE_URL}/champion-icons/${participant.championId}.png`,
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
              // summonerSpell1,
            }

            return data
          })
        )

        const match = {
          gameId,
          gameEndTimestamp,
          gameDurationMinute,
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
