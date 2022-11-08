import { riotClient } from "../common"

const BASE_URL = "/lol/league/v4/entries/by-summoner"

export const getLeagueToRiot = async (summonerId: string) => {
  const { data } = await riotClient.get<LeagueInfo[]>(
    `${BASE_URL}/${summonerId}`
  )
  const leagues = data.map((league) => {
    const { queueType, leaguePoints, wins, losses, tier, rank } = league

    return { queueType, leaguePoints, tier, rank, wins, losses }
  })

  return leagues
}
