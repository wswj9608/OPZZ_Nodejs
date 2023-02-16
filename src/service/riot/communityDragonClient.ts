import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import dotenv from "dotenv";

dotenv.config();

const COMMUNITY_DRAGON_KR_BASE_URL = process.env.COMMUNITY_DRAGON_KR_BASE_URL;
console.log(COMMUNITY_DRAGON_KR_BASE_URL);

const communityClient: AxiosInstance = axios.create({
  baseURL: COMMUNITY_DRAGON_KR_BASE_URL,
});
export default communityClient;