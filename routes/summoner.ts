import { Router } from "express"
import axios from "axios"
import { getSummonerPuuid } from "../lib/api/summoner"

const router = Router()

router.get("/", async (req, res) => {
  try {
    const summonerName = encodeURI(req.query.summonerName as string)

    const summonerState = await getSummonerPuuid(summonerName)
    return res.json(summonerState)
  } catch (err) {
    console.error(err)
  }

  // res.json()
})

router.get("/by-name/:summonerName", (req, res) => {
  console.log(req)
})

export default router
