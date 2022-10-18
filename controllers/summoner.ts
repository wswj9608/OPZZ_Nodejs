import { RequestHandler } from "express"
import { getSummonerMatches } from "../lib/api/match"
import { getSummonerPuuid } from "../lib/api/summoner"
import { getChapmIcon, getSummonerSpellIcons } from "../services/iconService"
import { selectItemInfos } from "../services/itemInfoService"
import { selectPerkInfos } from "../services/perkInfoService"
import { getProfileUrl } from "../services/profileIconService"
import { timeForToday } from "../utills"

export const getSummonerProfile: RequestHandler = async (req, res) => {
  try {
    const searchSummonerName = encodeURI(req.query.summonerName as string)

    const { name, id, puuid, summonerLevel, profileIconId }: SummonerInfoType =
      await getSummonerPuuid(searchSummonerName)
    const riotMatchInfos = await getSummonerMatches(puuid)

    const profileIconImageUrl = await getProfileUrl(String(profileIconId))

    const matchs = await Promise.all(
      riotMatchInfos.map(async (info) => {
        let primaryPerks: {
          gameId: number
          summonerName: string
          perkId: number
        }[] = []

        const gameDatas = await Promise.all(
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
              perks,
              visionWardsBoughtInGame,
              neutralMinionsKilled,
              summonerName,
              totalMinionsKilled: minionsKilled,
              summoner1Id,
              summoner2Id,
            } = participant

            const summonerSpells = await getSummonerSpellIcons(
              summoner1Id,
              summoner2Id
            )

            const { image_url } = await getChapmIcon(championName)

            const items = await selectItemInfos([
              item0,
              item1,
              item2,
              item3,
              item4,
              item5,
              item6,
            ])

            perks.styles.forEach((style) => {
              if (style.description === "primaryStyle") {
                primaryPerks.push({
                  gameId: info.gameId,
                  perkId: style.selections[0].perk,
                  summonerName,
                })
              }
            })

            const primaryPerkId = perks.styles.find(
              (style) => style.description === "primaryStyle"
            )?.selections[0].perk as number

            const subPerkStyleId = perks.styles.find(
              (style) => style.description === "subStyle"
            )?.style

            const totalMinionsKilled = minionsKilled + neutralMinionsKilled
            const gameDurationMinute = new Date(
              info.gameDuration * 1000
            ).getMinutes()

            const minionsPerMinute = Number(
              (totalMinionsKilled / gameDurationMinute).toFixed(1)
            )

            const kda = Number(((kills + assists) / deaths).toFixed(2))

            // const primaryPerk = await selectPerkInfos(primaryPerkId)
            // console.log("primary ========>", primaryPerk)
            // console.log(primaryPerk.id)

            const participantData = {
              summonerName,
              kills,
              assists,
              deaths,
              kda,
              champion: { image_url, championName },
              champLevel,
              items,
              visionWardsBoughtInGame,
              totalMinionsKilled,
              minionsPerMinute,
              primaryPerkId,
              subPerkStyleId,
              summonerSpells: [
                summonerSpells.find((el) => el.spell_id === summoner1Id),
                summonerSpells.find((el) => el.spell_id === summoner2Id),
              ],
            }

            return participantData
          })
        )

        const primaryPerksInfo = await selectPerkInfos(primaryPerks)

        const matchInfos = {
          gameId: info.gameId,
          gameEndTimestamp: timeForToday(new Date(info.gameEndTimestamp)),
          gameDuration: new Date(info.gameDuration * 1000 + 1000)
            .toISOString()
            .slice(14, 19),
          gameDatas,
          primaryPerks: primaryPerksInfo,
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
      matchs,
    }

    res.json(resData)
  } catch (err) {
    console.error(err)
  }
}
