import { riotClient } from "../common"

const BASE_URL = "https://asia.api.riotgames.com/lol/match/v5/matches"

export const getSummonerMatches = async (puuid: string) => {
  const { data: matchIds } = await riotClient.get<
    string[]
  >(`${BASE_URL}/by-puuid/${puuid}/ids?start=0&count=3
  `)

  let test: any

  for (let i = 0; i > matchIds.length; i++) {
    const a = await riotClient.get(`${BASE_URL}/${matchIds[i]}`)
    console.log(a)
  }

  console.log(test)
  return test
}
