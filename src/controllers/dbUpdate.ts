import { Request, Response } from 'express'
import * as dbUpdateService from '../service/dbUpdate/dbUpdateService'

export const updateItems = async (req: Request, res: Response) => {
  await dbUpdateService.insertItems()

  res.status(200)
  try {
  } catch (err) {
    console.error(err)
  }
}
