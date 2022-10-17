import AWS from 'aws-sdk'
import { s3Config } from '../config/s3'
import { getConnection } from '../loaders/mysql'
import { insertIcons } from '../models'

AWS.config.update(s3Config)
const s3 = new AWS.S3()

export const uploadIcons = async (params: any, table: string) => {
  const { Location } = await s3.upload(params).promise()

  if (table === 'item') {
    getConnection((conn) => {
      conn.query(
        insertIcons(table),
        {
          item_id: Number(Location?.split(`${table}Icon/`)[1].split('.')[0]),
          image_url: Location,
          file_name: Location?.split(`${table}Icon/`)[1] as string,
        },
        (err, result) => {
          if (err) return
          console.log(result)
        }
      )
      conn.release()
    })
    return
  }

  getConnection((conn) => {
    conn.query(
      insertIcons(table),
      {
        image_url: Location,
        file_name: Location?.split(`${table}Icon/`)[1] as string,
      },
      (err, result) => {
        if (err) return
        console.log(result)
      }
    )
    conn.release()
  })
}

export const getSummonerSpellIcons = (
  spellId1: number,
  spellId2: number
): Promise<{ image_url: string; spell_id: number; file_name: string }[]> => {
  return new Promise((resolve, reject) => {
    getConnection((conn) => {
      conn.query(
        `SELECT image_url,spell_id,file_name FROM spell_icon WHERE spell_id = ? || spell_id = ?`,
        [String(spellId1), String(spellId2)],
        (err, result) => {
          if (err) reject(err)
          resolve(result)
        }
      )

      conn.release()
    })
  })
}

export const getChapmIcon = (
  champName: string
): Promise<{ image_url: string; file_name: string }> => {
  return new Promise((resolve, reject) => {
    getConnection((conn) => {
      conn.query(
        `SELECT image_url FROM champ_icon WHERE SUBSTRING_INDEX(file_name, '.', 1) = ?`,
        champName,
        (err, result) => {
          if (err) reject(err)
          resolve(result[0])
        }
      )

      conn.release()
    })
  })
}
