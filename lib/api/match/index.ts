import { getSummonerSpellIcons } from "../../../services/iconService"
import { riotClient } from "../common"

const BASE_URL = "https://asia.api.riotgames.com/lol/match/v5/matches"
const DDRAGON_URL = "http://ddragon.leagueoflegends.com/cdn/12.19.1/data/ko_KR"

export const getSummonerMatches = async (puuid: string) => {
  const { data: matchIds } = await riotClient.get<
    string[]
  >(`${BASE_URL}/by-puuid/${puuid}/ids?start=0&count=3
  `)

  let matchInfos: MatchInfoType[] = []

  for (let i = 0; i < matchIds.length; i++) {
    const { data } = await riotClient.get(`${BASE_URL}/${matchIds[i]}`)
    matchInfos.push(data.info)
  }

  return matchInfos
}

// export const getItemInfos = async (item: number) => {
//   const { data } = await riotClient.get(`${DDRAGON_URL}/item.json`)

//   // console.log("dddddd =======>", data.data[item]?.name)

//   if (data.data[item]?.name) {
//     const { name, description, gold } = data.data[item]
//     const payload = {
//       name,
//       description,
//       gold,
//     }
//     return payload
//   }
// }

export const getItemsToRiot = async () => {
  const { data } = await riotClient.get(`${DDRAGON_URL}/item.json`)

  // console.log("dddddd =======>", data.data[item]?.name)

  // if (data.data[item]?.name) {
  //   const { name, description, gold } = data.data[item]
  //   const payload = {
  //     name,
  //     description,
  //     gold,
  //   }
  return data.data
}
