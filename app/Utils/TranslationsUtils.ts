import Translation from 'App/Models/Translation'

export async function getTranslation(code: string): Promise<Translation> {
  return await Translation.firstOrNew({ code }, { code })
}
