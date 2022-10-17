import { RequestHandler } from "express"
import { getItemsToRiot } from "../lib/api/match"
import { insertItemInfos } from "../services/itemInfoService"

export const getItemInfos: RequestHandler = async (req, res) => {
  const itemObject = await getItemsToRiot()
  const items = Object.keys(itemObject).map((itemId: string, index) => {
    const itemInfo = Object.values(itemObject)[index] as any
    const id = Number(itemId)
    const { name, description, gold } = itemInfo
    return [id, name, description, gold.total]
  })
  await insertItemInfos(items)

  res.status(200)
  try {
  } catch (err) {
    console.error(err)
  }
}
