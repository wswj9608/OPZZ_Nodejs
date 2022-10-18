import { getConnection } from "../loaders/mysql"
import { insertPerks } from "../models"

export const insertPerkInfos = (perks: any[]) => {
  return new Promise((resolve, reject) => {
    getConnection((conn) => {
      conn.query(insertPerks, [perks], (err, result) => {
        if (err) {
          reject(conn.rollback())
        }
        resolve(result)
      })

      conn.release()
    })
  })
}

// export const selectPerkInfos = (perkId: number): Promise<SelectPerkType> => {
export const selectPerkInfos = (
  datas: {
    gameId: number
    summonerName: string
    perkId: number
  }[]
): Promise<SelectPerkType[]> => {
  const perkIds = datas.map((data) => data.perkId)
  return new Promise((resolve, reject) => {
    getConnection((conn) => {
      conn.query(
        "SELECT * FROM perk_info WHERE perk_id in ?",
        [[perkIds]],
        (err, result: SelectPerkType[]) => {
          if (err) reject(conn.rollback())

          resolve(result)
        }
      )
    })
  })
}
