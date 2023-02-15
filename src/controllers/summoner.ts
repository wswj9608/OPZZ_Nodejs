import { Request, Response } from "express";
import * as riotService from "../service/riot/riotService";


export const getSummoner = async (req: Request, res: Response) : Promise<void> => {

  const summonerName = req.params.summonerName;

  const data = await riotService.getSummonerProfile(summonerName);
  console.log(data);
  res.json(data);
};
