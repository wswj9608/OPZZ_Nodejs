import { Router } from "express"
import {
  getItemInfosSaveToDb,
  getPerkInfosSaveToDb,
} from "../controllers/upload"

const router = Router()

router.get("/itemInfos", getItemInfosSaveToDb)

router.get("/perkInfos", getPerkInfosSaveToDb)

export default router
