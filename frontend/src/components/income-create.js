import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Balance} from "../services/balance.js";

export class CreateCategoryIncome {
    constructor() {
        Balance.getActualBalance();
        this.createButton = document.getElementById('createCategoryIncome');
        this.cancelButton = document.getElementById('cancelCreateCategoryIncome');
        let that = this;

        this.createButton.onclick = () => {
            that.createCategoryIncome();
        }

        this.cancelButton.onclick = () => {
            location.href = '#/income';
        }

    }

    async createCategoryIncome() {
        const nameCategoryIncome = document.getElementById('nameCategoryIncome');
        try {
            if (nameCategoryIncome.value) {
                let result = await CustomHttp.request(config.host + '/categories/income', 'POST', {
                    title: nameCategoryIncome.value
                });
                if (!result && result.error) {
                    throw new Error(result.message);
                } else {
                    location.href = '#/income';
                }
            } else {
                alert('Укажите наименование категории');
            }

        } catch (error) {
            console.log (error);
        }
    }
}