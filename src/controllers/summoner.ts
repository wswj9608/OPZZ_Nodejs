import { Request, Response } from 'express'
import * as riotService from '../service/riot/riotService'

export const getSummoner = async (req: Request, res: Response): Promise<void> => {
  const summonerName = req.params.summonerName

  const summonerProfile = await riotService.getSummonerProfile(summonerName)

  const matchHistory = await riotService.getMatchHistory(summonerProfile.id)

  res.json({ summonerProfile, matchHistory })
}
