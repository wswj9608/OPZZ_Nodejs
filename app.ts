import express from "express"
import loader from "./loaders"
import mongodbLoader from "./loaders/mongodb"

import dotenv from "dotenv"
import summonerRoutes from "./routes/summoner"
import loaders from "./loaders"
import { Collection, Db, MongoClient } from "mongodb"
import { db, getCollection } from "./models"

const DB_CONNECT_URL = process.env.DB_CONNECT_URL as string

const startServer = async () => {
  const app = express()
  await loaders({ expressApp: app })
  const port = 8080

  MongoClient.connect(DB_CONNECT_URL, (err, client) => {
    if (err) return console.error(err)
    if (!client) return

    getCollection(client)
  })

  dotenv.config()
  app.use("/summoner", summonerRoutes)

  app.listen(port, () => {
    console.log(`[server]: Server is running at <https://localhost>:${port}`)
  })
}
startServer()
// export const
// export const
// export const
