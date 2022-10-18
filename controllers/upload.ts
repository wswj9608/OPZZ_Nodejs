import { RequestHandler } from "express"
import { getItemsToRiot, getPerksToRiot } from "../lib/api/match"
import { insertItemInfos } from "../services/itemInfoService"
import { insertPerkInfos } from "../services/perkInfoService"

export const getItemInfosSaveToDb: RequestHandler = async (req, res) => {
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

export const getPerkInfosSaveToDb: RequestHandler = async (req, res) => {
  const perkRes = await getPerksToRiot()
  const perks = perkRes.map((perk) => {
    const { id, name, longDesc, iconPath } = perk
    return [id, name, longDesc, iconPath]
  })

  await insertPerkInfos(perks)
  res.status(200)
}
