import axios, {AxiosResponse} from "axios";
import Env from "@ioc:Adonis/Core/Env";

export async function getDiscordActivity(): Promise<AxiosResponse> {
  return await axios.get(`https://api.lanyard.rest/v1/users/${Env.get('DISCORD_ID')}`)
}
