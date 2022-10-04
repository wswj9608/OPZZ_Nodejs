import { counters } from "../models"

export const addCounter = (counterName: string) => {
  counters.updateOne({ name: counterName }, { $inc: { total: 1 } }, (err) => {
    if (err) return console.error(err)
  })
}
