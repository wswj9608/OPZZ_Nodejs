import { Router } from 'express'
import axios from 'axios'
import { getSummonerPuuid } from '../lib/api/summoner'
import AWS from 'aws-sdk'
import { GetObjectRequest } from 'aws-sdk/clients/s3'
import { encode } from 'punycode'
import { profileIcons, db } from '../models'
import { addCounter } from '../utills'

const router = Router()

console.log('MongoDb Intialized')

AWS.config.update({
  region: 'ap-northeast-2',
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_PRIVATE_ACCESS_KEY,
})

const s3 = new AWS.S3()
const params = { Bucket: 'opzz.back' }

router.get('/', async (req, res) => {
  try {
    const summonerName = encodeURI(req.query.summonerName as string)

    const { name, id, puuid, summonerLevel, profileIconId }: SummonerInfoType =
      await getSummonerPuuid(summonerName)

    profileIcons.findOne(
      { fileName: `${profileIconId}.png` },
      (err, result) => {
        res.json({
          profileImageUrl: result?.imageUrl,
          id,
          name,
          summonerLevel,
          puuid,
        })
      }
    )

    // 소환사명
    // 레벨
    // 소환사 아이콘

    // s3.listObjectsV2({ Bucket: 'opzz.back' }, (err, data) => {
    //   const contents = data.Contents

    //   contents?.forEach((el, i) => {
    //     if (!el.Key) return
    //     s3.getSignedUrl(
    //       'getObject',
    //       { ...params, Key: el.Key },
    //       (err, data) => {
    //         profileIcons.insertOne({
    //           _id: i + 1,
    //           fileName: el.Key?.split('/')[1] as string,
    //           imageUrl: data,
    //         })

    //         addCounter('profileIcons')
    //       }
    //     )
    //   })
    // })

    // res.json(summonerInfo)
  } catch (err) {
    console.error(err)
  }

  // res.json()
})

router.get('/by-name/:summonerName', (req, res) => {
  console.log(req)
})

export default router
