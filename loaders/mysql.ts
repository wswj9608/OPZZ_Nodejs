import mysql, { MysqlError } from "mysql"
import { dbConfig } from "../config/database"

const connection = mysql.createConnection(dbConfig)

const pool = mysql.createPool(dbConfig)

export const getConnection = (
  callback: (conn: mysql.PoolConnection) => void
) => {
  pool.getConnection((err, conn) => {
    if (!err) {
      callback(conn)
    }
  })
}

// connection.beginTransaction()

// connection.commit()
