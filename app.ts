import express from "express"
import loader from "./loaders"

import dotenv from "dotenv"
import summonerRoutes from "./routes/summoner"
import loaders from "./loaders"
import { Collection, Db, MongoClient } from "mongodb"
import { envData } from "./config"
import formidableMiddleware from "express-formidable"

const { port } = envData
const startServer = async () => {
  const app = express()
  await loaders({ expressApp: app })

  // MongoClient.connect(DB_CONNECT_URL, (err, client) => {
  //   if (err) return console.error(err)
  //   if (!client) return

  //   getCollection(client)
  // })

  app.use("/summoner", summonerRoutes)

  app.listen(port, () => {
    console.log(`[server]: Server is running at <https://localhost>:${port}`)
  })
}
startServer()
// export const
// export const
// export const
