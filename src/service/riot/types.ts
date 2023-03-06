// riot api response types

export interface RiotSummonerInfo {
  id: string
  accountId: string
  puuid: string
  name: string
  profileIconId: number
  revisionDate: number
  summonerLevel: number
}

export interface RiotLeague {
  leagueId: string
  queueType: 'RANKED_SOLO_5x5' | 'RANKED_FLEX_SR'
  tier: string
  rank: string
  summonerId: string
  summonerName: string
  leaguePoints: number
  wins: number
  losses: number
  veteran: boolean
  inactive: boolean
  freshBlood: boolean
  hotStreak: boolean
}

export interface RiotTeam {
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

interface RiotChallenges {
  '12AssistStreakCount': number
  abilityUses: number
  acesBefore15Minutes: number
  alliedJungleMonsterKills: number
  baronTakedowns: number
  blastConeOppositeOpponentCount: number
  bountyGold: number
  buffsStolen: number
  completeSupportQuestInTime: number
  controlWardsPlaced: number
  damagePerMinute: number
  damageTakenOnTeamPercentage: number
  dancedWithRiftHerald: number
  deathsByEnemyChamps: number
  dodgeSkillShotsSmallWindow: number
  doubleAces: number
  dragonTakedowns: number
  earliestBaron: number
  earliestDragonTakedown: number
  earliestElderDragon: number
  earlyLaningPhaseGoldExpAdvantage: number
  effectiveHealAndShielding: number
  elderDragonKillsWithOpposingSoul: number
  elderDragonMultikills: number
  enemyChampionImmobilizations: number
  enemyJungleMonsterKills: number
  epicMonsterKillsNearEnemyJungler: number
  epicMonsterKillsWithin30SecondsOfSpawn: number
  epicMonsterSteals: number
  epicMonsterStolenWithoutSmite: number
  fastestLegendary: number
  firstTurretKilledTime: number
  flawlessAces: number
  fullTeamTakedown: number
  gameLength: number
  getTakedownsInAllLanesEarlyJungleAsLaner: number
  goldPerMinute: number
  hadOpenNexus: number
  highestChampionDamage: number
  immobilizeAndKillWithAlly: number
  initialBuffCount: number
  initialCrabCount: number
  jungleCsBefore10Minutes: number
  junglerTakedownsNearDamagedEpicMonster: number
  kTurretsDestroyedBeforePlatesFall: number
  kda: number
  killAfterHiddenWithAlly: number
  killParticipation: number
  killedChampTookFullTeamDamageSurvived: number
  killingSprees: number
  killsNearEnemyTurret: number
  killsOnOtherLanesEarlyJungleAsLaner: number
  killsOnRecentlyHealedByAramPack: number
  killsUnderOwnTurret: number
  killsWithHelpFromEpicMonster: number
  knockEnemyIntoTeamAndKill: number
  landSkillShotsEarlyGame: number
  laneMinionsFirst10Minutes: number
  laningPhaseGoldExpAdvantage: number
  legendaryCount: number
  lostAnInhibitor: number
  maxCsAdvantageOnLaneOpponent: number
  maxKillDeficit: number
  maxLevelLeadLaneOpponent: number
  moreEnemyJungleThanOpponent: number
  multiKillOneSpell: number
  multiTurretRiftHeraldCount: 0
  multikills: number
  multikillsAfterAggressiveFlash: number
  mythicItemUsed: number
  outerTurretExecutesBefore10Minutes: number
  outnumberedKills: number
  outnumberedNexusKill: number
  perfectDragonSoulsTaken: number
  perfectGame: number
  pickKillWithAlly: number
  poroExplosions: number
  quickCleanse: number
  quickFirstTurret: number
  quickSoloKills: number
  riftHeraldTakedowns: number
  saveAllyFromDeath: number
  scuttleCrabKills: number
  shortestTimeToAceFromFirstTakedown: number
  skillshotsDodged: number
  skillshotsHit: number
  snowballsHit: number
  soloBaronKills: number
  soloKills: number
  stealthWardsPlaced: number
  survivedSingleDigitHpCount: number
  survivedThreeImmobilizesInFight: number
  takedownOnFirstTurret: number
  takedowns: number
  takedownsAfterGainingLevelAdvantage: number
  takedownsBeforeJungleMinionSpawn: number
  takedownsFirstXMinutes: number
  takedownsInAlcove: number
  takedownsInEnemyFountain: number
  teamBaronKills: number
  teamDamagePercentage: number
  teamElderDragonKills: number
  teamRiftHeraldKills: number
  threeWardsOneSweeperCount: number
  tookLargeDamageSurvived: number
  turretPlatesTaken: number
  turretTakedowns: number
  turretsTakenWithRiftHerald: number
  twentyMinionsIn3SecondsCount: number
  unseenRecalls: number
  visionScoreAdvantageLaneOpponent: number
  visionScorePerMinute: number
  wardTakedowns: number
  wardTakedownsBefore20M: number
  wardsGuarded: number
}

export interface RiotMatch {
  gameCreation: number
  gameDuration: number
  gameEndTimestamp: number
  gameId: number
  puuid: string
  role: string

  mapId: number
  participants: {
    summonerSpells: any[]
    assists: number
    champLevel: number
    championId: number
    championName: string
    challenges?: RiotChallenges
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
    totalDamageDealt: number
    totalDamageDealtToChampions: number
    totalDamageTaken: number
  }[]
  platformId: string
  queueId: number
  teams: RiotTeam[]
  tournamentCode: string
}

// OPZZ response type
export interface ResSummonerProfile {
  id: string
  accountId: string
  name: string
  summonerLevel: number
  summonerIconImageUrl: string
  leagues: ResLeague[]
}

export interface ResLeague {
  queueType: 'RANKED_SOLO_5x5' | 'RANKED_FLEX_SR'
  leaguePoints: number
  tier: string
  rank: string
  wins: number
  losses: number
}

export interface ResItem {
  itemId: number
  name: string
  iconImageUrl: string
  description: string
  totalGold: number
}

export interface ResChampion {
  championId: number
  championName: string
  championLevel: number
  championIcon: string
}

export interface ResChallenges {
  kda: number
  killParticipation: number
}

export interface ResSpell {
  image_url: string
  spell_id: number
  file_name: string
}

export interface ResMatch {
  puuid: string
  summonerName: string
  kills: number
  assists: number
  deaths: number
  champion: ResChampion
  items: ResItem[]
  teamId: number
  win: boolean
  challenges: ResChallenges
  visionWardsBoughtInGame: number
  wradsKilled: number
  wardsPlaced: number
  totalMinionsKilled: number
  minionsPerMinute: number
  primaryPerkId: number
  subPerkStyleId: number
  summonerSpells: ResSpell[]
  totalDamageDealt: number
  totalDamageDealtToChampions: number
  totalDamageTaken: number
  damageDealtToChampionPercent: number
  damageTakenPercent: number
}

export interface ResTeam {
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
  totalGold: number
}

export interface ResMatches {
  gameDuration: string
  gameEndTimestamp: string
  gameId: number
  queueId: number
  queueType: string
  playerMatchDatas: ResMatch[]
  friendlyTeam: ResTeam
  enemyTeam: ResTeam
}

export interface ResStatistics {
  totalMatchNumber: number
  totalWins: number
  totalLosses: number
  averageKills: number
  averageDeaths: number
  averageAssists: number
  averageKda: number
  killParticipationRate: number
  playedChampions: any
}

export interface ResChampionCount {
  championId: number
  championName: string
  championIcon: string
  kda: number
  win: number
  loss: number
  winningRate: number
  matchNumber: number
}

export interface DbItem {
  item_id: number
  name: string
  icon_name: string
  description: string
  total_gold: number
}

export interface PlayedChampions {
  championId: number
  championIcon: string
  championName: string
  matchNumber: number
  kills: number
  deaths: number
  assists: number
  win: number
}
