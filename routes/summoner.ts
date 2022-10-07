import { Router } from "express"
import { getSummonerProfile } from "../controllers/summonerControllers"
import { getSummonerPuuid } from "../lib/api/summoner"
import services from "../services"
import { getProfileUrl } from "../services/profileIconService"

const router = Router()

const { getObject, params } = services.profileIconService

router.get("/", getSummonerProfile)

router.get("/profileIcons", (req, res) => {
  getObject(params)
})

router.get("/by-name/:summonerName", (req, res) => {
  console.log(req)
})

export default router
