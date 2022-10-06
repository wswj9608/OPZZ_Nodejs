import { Router } from "express"
import { getSummonerPuuid } from "../lib/api/summoner"
import services from "../services"

const router = Router()

const { getObject, params } = services.summoner

router.get("/", async (req, res) => {
  try {
    const summonerName = encodeURI(req.query.summonerName as string)

    const { name, id, puuid, summonerLevel, profileIconId }: SummonerInfoType =
      await getSummonerPuuid(summonerName)

    // 소환사명
    // 레벨
    // 소환사 아이콘

    // res.json(summonerInfo)
  } catch (err) {
    console.error(err)
  }

  // res.json()
})

router.get("/profileIcons", (req, res) => {
  getObject(params)
})

router.get("/by-name/:summonerName", (req, res) => {
  console.log(req)
})

export default router
