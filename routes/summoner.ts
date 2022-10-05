import { Router } from "express"
import axios from "axios"
import { getSummonerPuuid } from "../lib/api/summoner"
import AWS from "aws-sdk"
import { GetObjectRequest } from "aws-sdk/clients/s3"
import { encode } from "punycode"
import { connection as OPZZ } from "../loaders/mysql"
import { s3Config } from "../config/s3"

const router = Router()

AWS.config.update(s3Config)

const s3 = new AWS.S3()
const params = { Bucket: "opzz.back" }

router.get("/", async (req, res) => {
  try {
    const summonerName = encodeURI(req.query.summonerName as string)

    const { name, id, puuid, summonerLevel, profileIconId }: SummonerInfoType =
      await getSummonerPuuid(summonerName)

    // 소환사명
    // 레벨
    // 소환사 아이콘

    // s3.listObjectsV2({ Bucket: 'opzz.back' }, (err, data) => {
    //   const contents = data.Contents

    // })

    // res.json(summonerInfo)
  } catch (err) {
    console.error(err)
  }

  // res.json()
})

router.get("/profileIcons", (req, res) => {
  OPZZ.query("SELECT * FROM profile_icon", (err, result) => {
    console.log(result)
  })
  s3.listObjectsV2({ Bucket: "opzz.back" }, (err, data) => {
    const contents = data.Contents

    console.log(contents?.length)

    // contents?.forEach((el, i) => {
    //   if (!el.Key) return

    //   s3.getSignedUrl("getObject", { ...params, Key: el.Key }, (err, data) => {
    //     const sql = "INSERT INTO profile_icon SET ?"
    //     // OPZZ.query(
    //     //   sql,
    //     //   { image_url: data, file_name: el.Key?.split("/")[1] as string },
    //     //   (err, result) => {
    //     //     if (err) return
    //     //     console.log(result)
    //     //   }
    //     // )
    //   })
    // })
  })
})

router.get("/by-name/:summonerName", (req, res) => {
  console.log(req)
})

export default router
