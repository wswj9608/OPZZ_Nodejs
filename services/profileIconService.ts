import { rejects } from "assert"
import AWS from "aws-sdk"
import { s3Config } from "../config/s3"
import { getConnection } from "../loaders/mysql"
import { getProfileUrlQuery, insertIcons, insertProfileIcons } from "../models"

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
            getConnection((conn) => {
              conn.query(
                insertIcons("profile"),
                { image_url, file_name: el.Key?.split("/")[1] as string },
                (err, result) => {
                  if (err) return
                  console.log(result)
                }
              )

              conn.release()
            })
          }
        )
      })
    }
  })
}

export const getProfileUrl = (fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    getConnection((conn) => {
      conn.query(getProfileUrlQuery, fileName, (err, result) => {
        // console.log('result= =====>', result)
        if (err) {
          reject(err)
        }
        resolve(
          result[0]?.image_url ||
            "https://s3.ap-northeast-2.amazonaws.com/opzz.back/profileicon/1.png"
        )
      })

      conn.release()
    })
  })
}
