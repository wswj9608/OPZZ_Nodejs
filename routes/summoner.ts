import { Router } from "express"
import { getSummonerProfile } from "../controllers/summoner"
import { getSummonerPuuid } from "../lib/api/summoner"
import services from "../services"
import { getProfileUrl } from "../services/profileIconService"
import multer from "multer"
import { readFileSync } from "fs"
import { uploadIcons } from "../services/iconService"

const router = Router()
const upload = multer({ dest: "uploads/" })

const { getObject, params } = services.profileIconService

router.get("/", getSummonerProfile)

router.get(`/imageUpload`, (req, res) => {
  res.render("imageUpload.ejs")
})

router.get("/profileIcons", (req, res) => {
  getObject(params)
})

router.post("/champIcons", upload.any(), async (req, res) => {
  const files = req.files as any

  if (!files) return

  for (let i = 0; i < files.length; i++) {
    const imagePath = files[i].path
    const blob = readFileSync(imagePath)
    const params = {
      Bucket: "opzz.back",
      Key: `champIcon/${files[i].originalname}`,
      Body: blob,
    }

    await uploadIcons(params, "champ")
  }

  res.status(200)
  // console.log(req.files)
})

router.post("/itemIcons", upload.any(), async (req, res) => {
  const files = req.files as any

  if (!files) return

  for (let i = 0; i < files.length; i++) {
    console.log(files[i])
    const imagePath = files[i].path
    const blob = readFileSync(imagePath)
    const params = {
      Bucket: "opzz.back",
      Key: `itemIcon/${files[i].originalname}`,
      Body: blob,
    }

    await uploadIcons(params, "item")
  }
  res.status(200)
  // console.log(req.files)
})

router.post("/spellIcons", upload.any(), async (req, res) => {
  const files = req.files as any

  if (!files) return

  for (let i = 0; i < files.length; i++) {
    console.log(files[i])
    const imagePath = files[i].path
    const blob = readFileSync(imagePath)
    const params = {
      Bucket: "opzz.back",
      Key: `spellIcon/${files[i].originalname}`,
      Body: blob,
    }

    await uploadIcons(params, "spell")
  }
  res.status(200)
  // console.log(req.files)
})

router.get("/by-name/:summonerName", (req, res) => {
  console.log(req)
})

export default router
