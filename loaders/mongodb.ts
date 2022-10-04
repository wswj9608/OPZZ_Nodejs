import mongodb, { Db, MongoClient } from "mongodb"

export default async (): Promise<any> => {
  const DB_CONNECT_URL = process.env.DB_CONNECT_URL

  if (!DB_CONNECT_URL) return

  const connection = await MongoClient.connect(DB_CONNECT_URL)

  return connection.db
}
