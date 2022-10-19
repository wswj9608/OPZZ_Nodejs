interface ProfileIconsType {
  _id: number
  fileName: string
  imageUrl: string
}

interface SummonerInfoType {
  id: string
  accountId: string
  puuid: string
  name: string
  profileIconId: number
  revisionDate: number
  summonerLevel: number
}

interface TeamType {
  bans: {
    championId: number
    pickTurn: number
  }[]
  objectives: {
    baron: {
      first: boolean
      kills: number
    }
    champion: {
      first: boolean
      kills: number
    }
    dragon: {
      first: boolean
      kills: number
    }
    inhibitor: {
      first: boolean
      kills: number
    }
    riftHerald: {
      first: boolean
      kills: number
    }
    tower: {
      first: boolean
      kills: number
    }
  }
  teamId: number
  win: boolean
}

interface MatchInfoType {
  gameCreation: number
  gameDuration: number
  gameEndTimestamp: number
  gameId: number
  mapId: number
  participants: {
    summonerSpells: any[]
    assists: number
    champLevel: number
    championId: number
    championName: string
    deaths: number
    doubleKills: number
    firstBloodKill: boolean
    firstTowerKill: boolean
    goldEarned: number
    neutralMinionsKilled: number
    totalMinionsKilled: number
    item0: number
    item1: number
    item2: number
    item3: number
    item4: number
    item5: number
    item6: number
    kills: number
    participantId: number
    pentaKills: number
    perks: {
      statPerks: {
        defense: number
        flex: number
        offense: number
      }
      styles: {
        description: string
        selections: {
          perk: number
          var1: number
          var2: number
          var3: number
        }[]
        style: number
      }[]
    }
    profileIcon: number
    puuid: string
    quadraKills: number
    summoner1Casts: number
    summoner1Id: number
    summoner2Casts: number
    summoner2Id: number
    summonerLevel: number
    summonerName: string
    teamId: number
    teamPosition: number
    tripleKills: number
    visionScore: number
    visionWardsBoughtInGame: number
    wardsKilled: number
    wardsPlaced: number
    win: boolean
  }[]
  teams: TeamType[]
  tournamentCode: string
}

interface ItemsType {
  icon_id: number
  item_id: number
  image_url: string
  file_name: string
  name: string
  description: string
  gold_total: number
}

interface PerkType {
  id: number
  name: string
  majorChangePatchVersion: string
  tooltip: string
  shortDesc: string
  longDesc: string
  iconPath: string
  endOfGameStatDescs: string[]
}

interface SelectPerkType {
  id: number
  perk_id: number
  name: string
  long_desc: string
  icon_path: string
}
