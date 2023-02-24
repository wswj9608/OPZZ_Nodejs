import { Request, Response } from 'express'
import * as riotService from '../service/riot/riotService'

export const getSummoner = async (req: Request, res: Response): Promise<void> => {
  const summonerName = req.params.summonerName

  const summonerProfile = await riotService.getSummonerProfile(summonerName)

  const matchHistory = await riotService.getMatches(summonerProfile.id, summonerName)

  res.json({ summonerProfile, matchHistory })
}
