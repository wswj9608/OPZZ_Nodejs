import express, { Express, request, Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import summonerRoutes from "./routes/summoner"

const app: Express = express()
const port = 8080

const corsOptions = {
  origin: "*",
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
  preflightContinue: false,

  credentials: true,
  optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))

dotenv.config()

// var cors = require("cors")
// app.use(cors())

app.use("/summoner", summonerRoutes)

app.listen(port, () => {
  console.log(`[server]: Server is running at <https://localhost>:${port}`)
})
