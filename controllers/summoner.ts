import { RequestHandler } from "express"
import { getSummonerMatches } from "../lib/api/match"
import { getSummonerPuuid } from "../lib/api/summoner"
import { getChapmIcon, getSummonerSpellIcons } from "../services/iconService"
import { getProfileUrl } from "../services/profileIconService"
import { timeForToday } from "../utills"

export const getSummonerProfile: RequestHandler = async (req, res) => {
  try {
    const summonerName = encodeURI(req.query.summonerName as string)

    const { name, id, puuid, summonerLevel, profileIconId }: SummonerInfoType =
      await getSummonerPuuid(summonerName)
    const riotMatchInfos = await getSummonerMatches(puuid)

    const profileIconImageUrl = await getProfileUrl(String(profileIconId))

    const matchInfosData = await Promise.all(
      riotMatchInfos.map(async (info) => {
        const gameData = await Promise.all(
          info.participants.map(async (participant) => {
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
              summoner1Id,
              summoner2Id,
            } = participant

            const summonerSpells = await getSummonerSpellIcons(
              summoner1Id,
              summoner2Id
            )

            const { image_url } = await getChapmIcon(championName)

            const items = [item0, item1, item2, item3, item4, item5, item6]
            // const itemInfos = await Promise.all(
            //   items.map(async (item, i) => {
            //     if (i > 1) return
            //     return await getItemInfos(item)
            //   })
            // )

            // console.log("item ========>", itemInfos)

            const participantData = {
              kills,
              assists,
              deaths,
              champion: { image_url, championName },
              champLevel,
              items: items,
              visionWardsBoughtInGame,
              totalMinionsKilled: totalMinionsKilled + neutralMinionsKilled,
              minionsPerMinute:
                (totalMinionsKilled + neutralMinionsKilled) / 60,
              summonerSpells: [
                summonerSpells.find((el) => el.spell_id === summoner1Id),
                summonerSpells.find((el) => el.spell_id === summoner2Id),
              ],
            }

            return participantData
          })
        )

        const matchInfos = {
          gameEndTimestamp: timeForToday(new Date(info.gameEndTimestamp)),
          gameDuration: new Date(info.gameDuration * 1000 + 1000)
            .toISOString()
            .slice(14, 19),
          gameData,
        }

        return matchInfos
      })
    )

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
