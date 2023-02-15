import riotClient from "./riotClient";
import { SummonerInfo } from "./types";


export const getSummonerProfile = async (summonerName: string) => {
  try {
    const summonerInfoRes = await riotClient.get<SummonerInfo>(`/lol/summoner/v4/summoners/by-name/${summonerName}`);
    const { name, id, puuid, summonerLevel, profileIconId  } = summonerInfoRes.data;
    // return res.data;
    
  } catch (err) {
    console.error(err);
  }

};