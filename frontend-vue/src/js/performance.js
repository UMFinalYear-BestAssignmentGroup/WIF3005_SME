import axios from "axios";
import { CONST } from './const';
const url = CONST.CONST_URL.concat('perf/');

class performance {

  static get_performance(year) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(`${url}get_overall`, {
            year
        },{
          withCredentials: true
        });
        resolve(res.data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static get_all_user_performance(year) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(`${url}all`, {
            year
        },{
          withCredentials: true
        });
        resolve(res.data);
      } catch (err) {
        reject(err);
      }
    });
  }

}

export default performance;