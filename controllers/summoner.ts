import { RequestHandler } from "express"
import { getLeagueToRiot } from "../lib/api/league"
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
    const riotLeagueInfo = await getLeagueToRiot(id)

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
              teamId,
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
              win,
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

            const myTeam = info.teams.find(
              (team) => team.teamId === teamId
            ) as TeamType

            const killParticipationRate = Number(
              (
                (((kills + assists) /
                  myTeam.objectives.champion.kills) as number) * 100
              ).toFixed(0)
            )

            // const primaryPerk = await selectPerkInfos(primaryPerkId)
            // console.log("primary ========>", primaryPerk)
            // console.log(primaryPerk.id)

            const mostMultiKills = () => {
              if (pentaKills) {
                return "펜타킬"
              } else if (quadraKills) {
                return "쿼드라킬"
              } else if (tripleKills) {
                return "트리플킬"
              } else if (doubleKills) {
                return "더블킬"
              } else {
                return null
              }
            }

            const participantData = {
              summonerName,
              kills,
              assists,
              deaths,
              kda,
              champion: { image_url, championName },
              champLevel,
              items,
              teamId,
              win,
              status: {
                killParticipationRate,
                visionWardsBoughtInGame,
                totalMinionsKilled,
                minionsPerMinute,
              },
              primaryPerkId,
              mostMultiKills: mostMultiKills(),
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
          teams: info.teams,
        }

        return matchInfos
      })
    )

    const resData = {
      name,
      id,
      puuid,
      summonerLevel,
      riotLeagueInfo,
      imageUrl: profileIconImageUrl || null,
      matchs,
    }

    res.json(resData)
  } catch (err) {
    console.error(err)
  }
}
