import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import dotenv from "dotenv";

dotenv.config();

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const RIOT_KR_BASE_URL = process.env.RIOT_KR_BASE_URL;
const RIOT_ASIA_BASE_URL = process.env.RIOT_ASIA_BASE_URL;

export const krRiotClient: AxiosInstance = axios.create({
  baseURL: RIOT_KR_BASE_URL,
});

export const asiaRiotClient : AxiosInstance = axios.create({
  baseURL: RIOT_ASIA_BASE_URL,
});

krRiotClient.interceptors.request.use((req) => {
  const config = req;
  if (!config.headers) return;
  if (!RIOT_API_KEY) return;

  config.headers["X-Riot-Token"] = RIOT_API_KEY;
  return config;
});

asiaRiotClient.interceptors.request.use((req) => {
  const config = req;
  if (!config.headers) return;
  if (!RIOT_API_KEY) return;

  config.headers["X-Riot-Token"] = RIOT_API_KEY;
  return config;
});
