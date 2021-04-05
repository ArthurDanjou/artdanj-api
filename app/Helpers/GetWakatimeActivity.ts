import axios from "axios";
import Env from "@ioc:Adonis/Core/Env";

export default function getActivity() {
  let last_activity = ''
  axios.get('https://wakatime.com/api/v1/users/current', {
    headers: {
      'Authorization': `Basic ${Env.get('WAKATIME_API_KEY')}`
    }
  })
    .then((res) => {
      last_activity = res.data.last_heartbeat_at
    })
  return last_activity
}
