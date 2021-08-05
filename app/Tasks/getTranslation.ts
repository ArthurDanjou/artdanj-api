import Translation from "App/Models/Translation";

export default async function getTranslation(code: string): Promise<Translation> {
  let translation = await Translation.findBy('code', code)
  if (!translation) {
    translation = await Translation.create({code: code})
  }
  return translation
}
