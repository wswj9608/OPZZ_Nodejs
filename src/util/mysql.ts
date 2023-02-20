import mysql from 'mysql'
import { dbConfig } from '../config/database'

const pool = mysql.createPool(dbConfig)

export const getConnection = (callback: (conn: mysql.PoolConnection) => void) => {
  pool.getConnection((err, conn) => {
    if (!err) {
      callback(conn)
    }
  })
}
