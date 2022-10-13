import { rejects } from "assert"
import AWS from "aws-sdk"
import { s3Config } from "../config/s3"
import { connection as OPZZ } from "../loaders/mysql"
import {
  getProfileUrlQuery,
  insertChampIcons,
  insertProfileIcons,
} from "../models"

AWS.config.update(s3Config)
const s3 = new AWS.S3()

export let params: { Bucket: string; ContinuationToken: string | undefined } = {
  Bucket: "opzz.back",
  ContinuationToken: undefined,
}

let objects: any[] = []

export const getObject = (s3Params: any) => {
  let params = s3Params

  s3.listObjectsV2(params, (err, data) => {
    objects = objects.concat(data.Contents?.slice(1))
    if (data.IsTruncated) {
      params.ContinuationToken = data.NextContinuationToken
      getObject(params)
    } else {
      objects?.forEach((el, i) => {
        if (!el.Key) return
        s3.getSignedUrl(
          "getObject",
          { Bucket: "opzz.back", Key: el.Key },
          (err, data) => {
            const image_url = data.split("?")[0]
            console.log(objects.length)
            OPZZ.query(
              insertProfileIcons,
              { image_url, file_name: el.Key?.split("/")[1] as string },
              (err, result) => {
                if (err) return
                console.log(result)
              }
            )
          }
        )
      })
    }
  })
}

export const getProfileUrl = (fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    OPZZ.query(getProfileUrlQuery, fileName, (err, result) => {
      console.log("result= =====>", result)
      if (err) {
        reject(err)
      }
      resolve(
        result[0]?.image_url ||
          "https://s3.ap-northeast-2.amazonaws.com/opzz.back/profileicon/1.png"
      )
    })
  })
}

export const uploadChampIcons = async (params: any) => {
  const { Location } = await s3.upload(params).promise()

  console.log(Location)

  OPZZ.query(
    insertChampIcons,
    {
      image_url: Location,
      file_name: Location?.split("champIcon/")[1] as string,
    },
    (err, result) => {
      if (err) return
      console.log(result)
    }
  )
  return new Promise((resolve, rejects) => {
    s3.upload(params, (err: any, data: any) => {
      if (err) return rejects(err)

      resolve(console.log(data))
    })
  })
}
