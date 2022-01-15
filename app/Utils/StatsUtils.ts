import DevelopmentHour from 'App/Models/DevelopmentHour'
import CommandsRun from 'App/Models/CommandsRun'
import BuildsRun from 'App/Models/BuildsRun'
import { Stats, Time } from 'App/Types/IStats'

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export const NOW = formatDate(new Date())

export async function getDevelopmentHours(start: string, end: string): Promise<Time> {
  const development_time = await DevelopmentHour
    .query()
    .where('date', '>=', start)
    .where('date', '<=', end)
    .orderBy('date', 'desc')

  if (!development_time) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  let total = 0
  development_time.forEach(item => total += item.seconds)

  const hours = Math.floor(total / 3600)
  const minutes = Math.floor(total / 60) - hours * 60
  const seconds = Math.floor(total) - minutes * 60 - hours * 3600

  return {
    hours,
    minutes,
    seconds,
  }
}

export async function getCommandsRan(start: string, end: string): Promise<number> {
  const commands_run = await CommandsRun
    .query()
    .where('date', '>=', start)
    .where('date', '<=', end)
    .orderBy('date', 'desc')

  if (!commands_run)
    return 0

  let commands = 0
  commands_run.forEach(item => commands += item.commands)

  return commands
}

export async function getBuildsRan(start: string, end: string): Promise<number> {
  const builds_run = await BuildsRun
    .query()
    .where('date', '>=', start)
    .where('date', '<=', end)
    .orderBy('date', 'desc')

  if (!builds_run)
    return 0

  let builds = 0
  builds_run.forEach(item => builds += item.builds)

  return builds
}

export async function fetchStatistics(): Promise<Stats> {
  const start = formatDate(new Date('2020-10-13'))

  const development_time = await getDevelopmentHours(start, NOW)
  const commands_ran = await getCommandsRan(start, NOW)
  const builds_ran = await getBuildsRan(start, NOW)

  return {
    range: {
      start,
      end: NOW,
    },
    development_time,
    commands_ran,
    builds_ran,
  }
}

export async function fetchMonthlyStatistics(): Promise<Stats> {
  const start = formatDate(new Date(new Date().setMonth(new Date().getMonth() - 1)))

  const development_time = await getDevelopmentHours(start, NOW)
  const commands_ran = await getCommandsRan(start, NOW)
  const builds_ran = await getBuildsRan(start, NOW)

  return {
    range: {
      start,
      end: NOW,
    },
    development_time,
    commands_ran,
    builds_ran,
  }
}

export async function fetchWeeklyStatistics(): Promise<Stats> {
  const start = formatDate(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000))

  const development_time = await getDevelopmentHours(start, NOW)
  const commands_ran = await getCommandsRan(start, NOW)
  const builds_ran = await getBuildsRan(start, NOW)

  return {
    range: {
      start,
      end: NOW,
    },
    development_time,
    commands_ran,
    builds_ran,
  }
}

export async function fetchDailyStatistics(): Promise<Stats> {
  const development_time = await getDevelopmentHours(NOW, NOW)
  const commands_ran = await getCommandsRan(NOW, NOW)
  const builds_ran = await getBuildsRan(NOW, NOW)

  return {
    range: {
      start: NOW,
      end: NOW,
    },
    development_time,
    commands_ran,
    builds_ran,
  }
}
