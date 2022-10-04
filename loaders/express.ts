import { Application } from "express"
import cors from "cors"
import bodyParser from "body-parser"

export default async ({ app }: { app: Application }) => {
  const corsOptions = {
    origin: "*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    preflightContinue: false,

    credentials: true,
    optionsSuccessStatus: 204,
  }

  app.use(cors(corsOptions))
  app.use(bodyParser.urlencoded({ extended: false }))

  return app
}
