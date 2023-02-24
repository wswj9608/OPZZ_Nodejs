import { ResItem, ResMatches } from '@/service/riot/types'

export const arrayPushNull = (items: ResItem[]): ResItem[] => {
  const payload = items.slice()

  for (let i = 0; i < 7 - items.length; i++) {
    payload.push(null)
  }

  return payload
}

export const timeForToday = (value: Date) => {
  const today = new Date()
  const timeValue = new Date(value)

  const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60)
  if (betweenTime < 1) return '방금전'
  if (betweenTime < 60) {
    return `${betweenTime}분전`
  }

  const betweenTimeHour = Math.floor(betweenTime / 60)
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간전`
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24)
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일전`
  }

  return `${Math.floor(betweenTimeDay / 365)}년전`
}

export const sumDataInMatches = (
  matches: ResMatches[],
  summonerName: string,
  key: 'kills' | 'deaths' | 'assists'
): number => {
  const sumNumber = matches
    .map(match => match.playerMatchDatas.find(data => data.summonerName === summonerName)[key])
    .reduce((a, b) => a + b)

  return sumNumber
}
