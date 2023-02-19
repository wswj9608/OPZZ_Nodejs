import communityClient from './communityDragonClient'
import { krRiotClient, asiaRiotClient } from './riotClient'
import { Item, Match, SummonerInfo, SummonerProfile } from './types'
import { getConnection } from '@/util/mysql'
import * as query from '@/models/query'
import { arrayPushNull } from '@/util'

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
        const accessaryIdx = items.findIndex(el => el.item_id === 3340 || el.item_id === 3363 || el.item_id === 3364)
        const accessary = items.splice(accessaryIdx, 1)[0]

        items.push(accessary)

        resolve(items)
      })
      conn.release()
    })
  })
}

export const getMatches = async (puuid: string): Promise<any[]> => {
  try {
    const matchIds = (await asiaRiotClient.get<string[]>(`/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=2`))
      .data
    console.log(matchIds)

    const matches = await Promise.all(
      matchIds.map(async id => {
        const res: Match = (await asiaRiotClient.get(`/lol/match/v5/matches/${id}`)).data

        const { gameId, gameEndTimestamp, gameDuration, participants } = res.info

        const playerMatchDatas = await Promise.all(
          participants.map(async participant => {
            const { item0, item1, item2, item3, item4, item5, item6 } = participant

            const itemIds = [item0, item1, item2, item3, item4, item5, item6]
            const items = await getItems(itemIds)
            // const killParticipationRate = Number(
            //   (
            //     (((participant.kills + participant. assists) /
            //       myTeam.objectives.champion.kills) as number) * 100
            //   ).toFixed(0)
            // );

            const data = {
              summonerName: participant.summonerName,
              kills: participant.kills,
              assists: participant.assists,
              deaths: participant.deaths,
              kda: '',
              champion: {
                championName: participant.championName,
                championLevel: participant.champLevel,
                championIcon: `${COMMUNITY_DRAGON_DEFAULT_BASE_URL}/champion-icons/${participant.championId}.png`,
              },
              items,
              teamId: participant.teamId,
              win: participant.win,
              status: {},
            }

            return data
          })
        )

        const match = {
          gameId,
          gameEndTimestamp,
          gameDuration,
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
