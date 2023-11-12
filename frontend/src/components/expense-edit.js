import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {CommonConstruction} from "../services/common-construction.js";
import {Balance} from "../services/balance.js";


export class EditCategoryExpense {
    constructor() {
        Balance.getActualBalance();
        this.idElement = CommonConstruction.getIdElement();
        this.newNameCetegoryExpense = document.getElementById('newNameCategoryExpense');

        this.editCategoryIncomeExpense = document.getElementById('editCategoryExpenseButton');
        this.editCategoryIncomeExpense.onclick = () => {
            this.editCategoryExpense();
        }

        this.cancelEditCategoryIncomeButton = document.getElementById('cancelEditCategoryExpenseButton');
        this.cancelEditCategoryIncomeButton.onclick = () => {
            location.href = '#/expenses';
        }
    }

    async editCategoryExpense() {
        try {
            if(this.newNameCetegoryExpense.value){
                const response = await CustomHttp.request(config.host + '/categories/expense/' + this.idElement, 'PUT', {
                    'title': this.newNameCetegoryExpense.value
                });
                if (!response) {
                    throw new Error("Неправильно отправлен запрос на изменение категории");
                } else {
                    localStorage.removeItem('idElement');
                    location.href = '#/expenses';
                }
            } else {
                alert('Укажите наименование категории');
            }
        } catch (error) {
            console.log(error);
        }
    }
}