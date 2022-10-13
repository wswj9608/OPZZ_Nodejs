import { RequestHandler } from "express"
import { getSummonerMatches } from "../lib/api/match"
import { getSummonerPuuid } from "../lib/api/summoner"
import { getProfileUrl } from "../services/profileIconService"

export const getSummonerProfile: RequestHandler = async (req, res) => {
  try {
    const summonerName = encodeURI(req.query.summonerName as string)

    const { name, id, puuid, summonerLevel, profileIconId }: SummonerInfoType =
      await getSummonerPuuid(summonerName)
    const riotMatchInfos = await getSummonerMatches(puuid)

    const profileIconImageUrl = await getProfileUrl(String(profileIconId))

    const matchInfosData = riotMatchInfos.map((info) => {
      const gameData = info.participants.map((participant) => {
        const {
          kills,
          assists,
          deaths,
          doubleKills,
          tripleKills,
          quadraKills,
          pentaKills,
          championName,
          champLevel,
          item0,
          item1,
          item2,
          item3,
          item4,
          item5,
          item6,
          visionWardsBoughtInGame,
          neutralMinionsKilled,
          totalMinionsKilled,
        } = participant

        const participantData = {
          kills,
          assists,
          deaths,
          championName,
          champLevel,
          items: [item0, item1, item2, item3, item4, item5, item6],
          visionWardsBoughtInGame,
          totalMinionsKilled: totalMinionsKilled + neutralMinionsKilled,
          minionsPerMinute: (totalMinionsKilled + neutralMinionsKilled) / 60,
        }

        return participantData
      })

      const matchInfos = {
        gameEndTimestamp: new Date(info.gameDuration)
          .toISOString()
          .slice(14, 19),
        gameDuration: new Date(info.gameDuration + 1000)
          .toISOString()
          .slice(14, 19),
        gameData,
      }

      return matchInfos
    })

    const resData = {
      name,
      id,
      puuid,
      summonerLevel,
      imageUrl: profileIconImageUrl || null,
      matchInfosData,
    }

    res.json(resData)
  } catch (err) {
    console.error(err)
  }
}
