export interface MatchDetails {
  fistTeam: {
    name: string,
    id: number,
    goals: string,
    penaltyGoals: string,
    flag: string
  },
  secondTeam: {
    name: string,
    id: number,
    goals: string,
    penaltyGoals: string,
    flag: string
  },
  stage: string,
  group: string,
  date: Date
}
