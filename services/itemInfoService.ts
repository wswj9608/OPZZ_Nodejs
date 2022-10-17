import { riotClient } from '../lib/api/common'
import { getConnection } from '../loaders/mysql'
import { insertItems, selectItems } from '../models'

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

const resultPushNull = (items: any[]): Promise<ItemsType[]> => {
  let payload = items.slice()

  return new Promise((resolve, reject) => {
    for (let i = 0; i < 7 - items.length; i++) {
      payload.push(null)
    }
    resolve(payload)
  })
}

export const selectItemInfos = (items: number[]): Promise<ItemsType[]> => {
  return new Promise((resolve, reject) => {
    getConnection((conn) => {
      conn.query(selectItems, [[items]], async (err, result) => {
        if (err) {
          console.log('err ====> ', err)
          reject(conn.rollback())
        }

        const payload = await resultPushNull(result)

        resolve(payload)
      })

      conn.release()
    })
  })
}
