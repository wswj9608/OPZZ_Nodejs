import { Collection, Db, MongoClient } from "mongodb"

export let db: Db
export let counters: Collection
export let profileIcons: Collection<ProfileIcons>
export let summoners: Collection

export const getCollection = (client: MongoClient) => {
  db = client.db("opzz")

  counters = db?.collection("counters")
  profileIcons = db?.collection("profileIcons")
  summoners = db?.collection("summoners")
}
