import config from "../../config/config.js";
import {CustomHttp} from "./custom-http.js";

export class Balance {

    static async getActualBalance(){
        let balanceElement = document.getElementById('balance');
        try {
          const response = await CustomHttp.request(config.host + '/balance');
          if(response.error){
              throw new Error(response.message);
          } else {
              return balanceElement.textContent = String(response.balance) + ' $';
          }
        } catch (error) {
            console.log(error);
        }
    }


}