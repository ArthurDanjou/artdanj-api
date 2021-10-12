import DevelopmentHour from "App/Models/DevelopmentHour";
import CommandsRun from "App/Models/CommandsRun";
import BuildsRun from "App/Models/BuildsRun";

interface Stats {
  range: {
    start: string
    end: string
  }

  development_time: Time
  commands_ran: number
  builds_ran: number
}

interface Time {
  total_hours: number
  total_minutes: number
  total_seconds: number
}

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
      total_hours: 0,
      total_minutes: 0,
      total_seconds: 0
    }
  }

  let total = 0
  development_time.forEach(item => total += item.seconds)

  return {
    total_hours: Math.round(total / 3600),
    total_minutes: Math.round(total / 60),
    total_seconds: Math.round(total)
  }
}

export async function getCommandsRan(start: string, end: string): Promise<number> {
  const commands_run = await CommandsRun
    .query()
    .where('date', '>=', start)
    .where('date', '<=', end)
    .orderBy('date', 'desc')

  if (!commands_run) {
    return 0
  }

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

  if (!builds_run) {
    return 0
  }

  let builds = 0
  builds_run.forEach(item => builds += item.builds)

  return builds
}

export async function fetchStatistics(): Promise<Stats> {
  const start = formatDate(new Date("2020-10-13"))

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
    builds_ran
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
    builds_ran
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
    builds_ran
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
    builds_ran
  }
}
