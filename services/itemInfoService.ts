import { riotClient } from "../lib/api/common"
import { getConnection } from "../loaders/mysql"
import { insertItems, selectItems } from "../models"

export const insertItemInfos = (items: any[]) => {
  return new Promise((resolve, reject) => {
    getConnection((conn) => {
      conn.query(insertItems, [items], (err, result) => {
        if (err) {
          reject(conn.rollback())
        }
        resolve(result)
      })

      conn.release()
    })
  })
}

export const selectItemInfos = () => {
  return new Promise((resolve, reject) => {
    getConnection((conn) => {
      conn.query(selectItems, (err, result) => {
        if (err) {
          reject(conn.rollback())
        }
        resolve(result)
      })

      conn.release()
    })
  })
}
