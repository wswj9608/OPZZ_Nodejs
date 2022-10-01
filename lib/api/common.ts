import axios from "axios"
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"
import dotenv from "dotenv"

dotenv.config()

const RIOT_BASE_URL = process.env.RIOT_BASE_URL
const RIOT_API_KEY = process.env.RIOT_API_KEY

export const riotClient: AxiosInstance = axios.create({
  baseURL: RIOT_BASE_URL,
})

riotClient.interceptors.request.use((req: AxiosRequestConfig) => {
  const config = req
  if (!config.headers) return
  if (!RIOT_API_KEY) return

  config.headers["X-Riot-Token"] = RIOT_API_KEY
  return config
})
