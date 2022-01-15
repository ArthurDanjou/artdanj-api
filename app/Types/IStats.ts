export interface Time {
  hours: number
  minutes: number
  seconds: number
}

export interface Stats {
  range: {
    start: string
    end: string
  }

  development_time: Time
  commands_ran: number
  builds_ran: number
}
