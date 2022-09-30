import express, { Express, Request, Response } from "express"
import cors from "cors"

const app: Express = express()
const port = 8080

app.use(cors())
// var cors = require("cors")
// app.use(cors())

app.get("/summoner", (req, res) => {
  console.log(req.query.summonerName)
  // res.json()
})

app.listen(port, () => {
  console.log(`[server]: Server is running at <https://localhost>:${port}`)
})
