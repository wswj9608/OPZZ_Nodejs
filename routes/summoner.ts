import { Router } from "express"
import { getSummonerPuuid } from "../lib/api/summoner"
import services from "../services"
import { getProfileUrl } from "../services/profileIconService"

const router = Router()

const { getObject, params } = services.profileIconService

router.get("/", async (req, res) => {
  try {
    const summonerName = encodeURI(req.query.summonerName as string)

    const { name, id, puuid, summonerLevel, profileIconId }: SummonerInfoType =
      await getSummonerPuuid(summonerName)

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
})

router.get("/profileIcons", (req, res) => {
  getObject(params)
})

router.get("/by-name/:summonerName", (req, res) => {
  console.log(req)
})

export default router
