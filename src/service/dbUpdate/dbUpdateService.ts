import communityDragonClient from '../../service/riot/communityDragonClient'
import { getConnection } from '../../util/mysql'
import { RiotResponseItem } from './types'
import * as query from '../../models/query'

export const insertItems = async (): Promise<void> => {
  const items = (await communityDragonClient.get<RiotResponseItem[]>('/items.json')).data.map(item => [
    item.id,
    item.name,
    item.iconPath.split('Icons2D/')[1],
    item.description,
    item.priceTotal,
  ])

  getConnection(conn => {
    conn.query(query.insertItems, [items], (err, result) => {
      if (err) {
        console.log('err', err)
        conn.rollback()
      }
      console.log(result)
      return 'update 완료'
    })

    conn.release()
  })
}
