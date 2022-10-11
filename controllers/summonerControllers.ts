import { RequestHandler } from "express"
import { getSummonerMatches } from "../lib/api/match"
import { getSummonerPuuid } from "../lib/api/summoner"
import { getProfileUrl } from "../services/profileIconService"

export const getSummonerProfile: RequestHandler = async (req, res) => {
  try {
    const summonerName = encodeURI(req.query.summonerName as string)

    const { name, id, puuid, summonerLevel, profileIconId }: SummonerInfoType =
      await getSummonerPuuid(summonerName)
    const data = await getSummonerMatches(puuid)
    console.log(data)

    const profileIconImageUrl = await getProfileUrl(String(profileIconId))

    const resData = {
      name,
      id,
      puuid,
      summonerLevel,
      imageUrl: profileIconImageUrl || null,
    }

    res.json(resData)
  } catch (err) {
    console.error(err)
  }
}
