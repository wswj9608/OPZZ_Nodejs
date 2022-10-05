import mysql from "mysql"
import { dbConfig } from "../config/database"

export const connection = mysql.createConnection(dbConfig)

connection.connect()
console.log("mysql connect")
