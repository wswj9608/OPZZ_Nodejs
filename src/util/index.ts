import { Item } from '@/service/riot/types'

export const arrayPushNull = (items: Item[]): Item[] => {
  const payload = items.slice()

  for (let i = 0; i < 7 - items.length; i++) {
    payload.push(null)
  }

  return payload
}
