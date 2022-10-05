import dotenv from "dotenv"

dotenv.config()

export const envData = {
  port: process.env.EXPRESS_PORT,
  database: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    schemas: process.env.MYSQL_SCHEMAS,
  },
  s3: {
    region: process.env.S3_REGION,
    privateAccessKey: process.env.S3_PRIVATE_ACCESS_KEY,
    accessKey: process.env.S3_ACCESS_KEY,
  },
  riot: {
    baseUrl: process.env.RIOT_BASE_URL,
    apiKey: process.env.RIOT_API_KEY,
  },
}

// const { host, user, password, schemas } = envData.database

// const dbConfig = {
//   host: host,
//   user: user,
//   password: password,
//   database: schemas,
// }

// const { region, privateAccessKey, accessKey } = envData.s3

// const s3Config = {
//   region,
//   accessKeyId: accessKey,
//   secretAccessKey: privateAccessKey,
// }
