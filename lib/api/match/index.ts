import { getSummonerSpellIcons } from '../../../services/iconService'
import { riotClient } from '../common'

const BASE_URL = 'https://asia.api.riotgames.com/lol/match/v5/matches'

export const getSummonerMatches = async (puuid: string) => {
  console.log('puuid ====>', puuid)

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
