import DevelopmentHour from "App/Models/DevelopmentHour";
import CommandsRun from "App/Models/CommandsRun";
import BuildsRun from "App/Models/BuildsRun";

interface Stats {
  start: Date;
  end: Date;

  development_seconds: number;
  commands_ran: number;
  builds_ran: number;
}

export async function getDevelopmentHours(start: Date, end: Date): Promise<number> {
  const development_seconds = await DevelopmentHour
    .query()
    .where('date', '>=', start)
    .where('date', '<=', end)
    .orderBy('date', 'desc')

  if (!development_seconds || development_seconds.length <= 0) {
    return 0
  }

  const reduced = development_seconds.reduce((a: DevelopmentHour, b: DevelopmentHour) => {
    return {
      ...a,
      seconds: a.seconds + b.seconds
    }
  })

  return Number(reduced.seconds)
}

export async function getCommandsRan(start: Date, end: Date): Promise<number> {
  const commands_run = await CommandsRun
    .query()
    .where('date', '>=', start)
    .where('date', '<=', end)
    .orderBy('date', 'desc')

  if (!commands_run || commands_run.length <= 0) {
    return 0
  }

  const reduced = commands_run.reduce((a: CommandsRun, b: CommandsRun) => {
    return {
      ...a,
      commands: a.commands + b.commands
    }
  })

  return Number(reduced.commands)
}

export async function getBuildsRan(start: Date, end: Date): Promise<number> {
  const builds_run = await BuildsRun
    .query()
    .where('date', '>=', start)
    .where('date', '<=', end)
    .orderBy('date', 'desc')

  if (!builds_run || builds_run.length <= 0) {
    return 0
  }

  const reduced = builds_run.reduce((a: BuildsRun, b: BuildsRun) => {
    return {
      ...a,
      builds: a.builds + b.builds
    }
  })

  return Number(reduced.builds)
}

export async function fetchStatistics(): Promise<Stats> {
  const start = new Date("01-01-2000");
  const end = new Date();

  const development_seconds = await getDevelopmentHours(start, end)
  const commands_ran = await getCommandsRan(start, end)
  const builds_ran = await getBuildsRan(start, end)

  return {
    start,
    end,
    development_seconds,
    commands_ran,
    builds_ran
  }
}

export async function fetchMonthlyStatistics(): Promise<Stats> {
  const start = new Date(new Date().setMonth(new Date().getMonth() - 1));
  const end = new Date();

  const development_seconds = await getDevelopmentHours(start, end)
  const commands_ran = await getCommandsRan(start, end)
  const builds_ran = await getBuildsRan(start, end)

  return {
    start,
    end,
    development_seconds,
    commands_ran,
    builds_ran
  }
}

export async function fetchWeeklyStatistics(): Promise<Stats> {
  const start = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
  const end = new Date();

  const development_seconds = await getDevelopmentHours(start, end)
  const commands_ran = await getCommandsRan(start, end)
  const builds_ran = await getBuildsRan(start, end)

  return {
    start,
    end,
    development_seconds,
    commands_ran,
    builds_ran
  }
}

export async function fetchDailyStatistics(): Promise<Stats> {
  const start = new Date();
  const end = new Date();

  const development_seconds = await getDevelopmentHours(start, end)
  const commands_ran = await getCommandsRan(start, end)
  const builds_ran = await getBuildsRan(start, end)

  return {
    start,
    end,
    development_seconds,
    commands_ran,
    builds_ran
  }
}
