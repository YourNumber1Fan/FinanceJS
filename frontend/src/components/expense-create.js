import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Balance} from "../services/balance.js";

export class CreateCategoryExpense {
    constructor() {
        Balance.getActualBalance();
        this.createButton = document.getElementById('createCategoryExpense');
        this.cancelButton = document.getElementById('cancelCreateCategoryExpense');
        let that = this;

        this.createButton.onclick = function () {
            that.createCategoryExpense();
        }

        this.cancelButton.onclick = () => {
            location.href = '#/expenses';
        }
    }

    async createCategoryExpense() {
        const nameCategoryExpense = document.getElementById('nameCategoryExpense');
        try {
            if (nameCategoryExpense.value) {
                let result = await CustomHttp.request(config.host + '/categories/expense', 'POST', {
                    title: nameCategoryExpense.value
                });
                if (!result && result.error) {
                    throw new Error(result.message);
                } else {
                    location.href = '#/expenses';
                }
            } else {
                alert('Укажите наименование категории');
            }

        } catch (error) {
            console.log (error);
        }
    }
}