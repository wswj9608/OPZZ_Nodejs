import { ResChampion, ResItem, ResMatches } from '@/service/riot/types'

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

export const sumDataInMatches = (matches: ResMatches[], puuid: string, key: 'kills' | 'deaths' | 'assists'): number => {
  const sumNumber = matches
    .map(match => match.playerMatchDatas.find(data => data.puuid === puuid)[key])
    .reduce((a, b) => a + b)

  return sumNumber
}

export const getQueueType = (queueId: number) => {
  if (queueId === 420) return '솔랭'
  if (queueId === 430) return '일반'
  if (queueId === 440) return '자유 5:5 랭크'
  if (queueId === 900) return '모두 무작위 U.R.F.'
  return '무작위 총력전'
}

interface PlayedChampions {
  [key: number]: {
    championId: number
    chmapionIcon: string
    championName: string
    matchNumber: number
  }
}

export const getChmapionCount = (champions: ResChampion[]): PlayedChampions =>
  champions.reduce(
    (ac: { [key: number]: any }, v) => ({
      ...ac,
      [v.championId]: {
        championId: v.championId,
        championIcon: v.championIcon,
        championName: v.championName,
        matchNumber: (ac[v.championId].matchNumber || 0) + 1,
      },
    }),
    {}
  )
