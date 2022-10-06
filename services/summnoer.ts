import AWS from "aws-sdk"
import { s3Config } from "../config/s3"
import { connection as OPZZ } from "../loaders/mysql"

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
        console.log(i)
        s3.getSignedUrl(
          "getObject",
          { Bucket: "opzz.back", Key: el.Key },
          (err, data) => {
            const sql = "INSERT INTO profile_icon SET ?"
            OPZZ.query(
              sql,
              { image_url: data, file_name: el.Key?.split("/")[1] as string },
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
