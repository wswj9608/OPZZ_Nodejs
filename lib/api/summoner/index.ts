import { riotClient } from "../common"

const BASE_URL = "/lol/summoner/v4/summoners"

export const getSummonerPuuid = async (summonerName: string) => {
  const res = await riotClient.get(`${BASE_URL}/by-name/${summonerName}`)

  return res.data
}
