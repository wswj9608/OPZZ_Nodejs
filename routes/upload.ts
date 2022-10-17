import { Router } from "express"
import { getItemInfos } from "../controllers/upload"

const router = Router()

router.get("/itemInfos", getItemInfos)

export default router
