import { envData } from "."

const { host, user, password, schemas } = envData.database

export const dbConfig = {
  host: host,
  user: user,
  password: password,
  database: schemas,
}
