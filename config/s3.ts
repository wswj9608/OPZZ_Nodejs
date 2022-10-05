import { envData } from "."

const { region, privateAccessKey, accessKey } = envData.s3

export const s3Config = {
  region,
  accessKeyId: accessKey,
  secretAccessKey: privateAccessKey,
}
