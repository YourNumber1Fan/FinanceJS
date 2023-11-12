import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {CommonConstruction} from "../services/common-construction.js";
import {Balance} from "../services/balance.js";


export class EditCategoryIncome {
    constructor() {
        Balance.getActualBalance();
        this.idElement = CommonConstruction.getIdElement();
        this.newNameCetegoryIncome = document.getElementById('newNameCategoryIncome');

        this.editCategoryIncomeButton = document.getElementById('editCategoryIncomeButton');
        this.editCategoryIncomeButton.onclick = () => {
            this.editCategoryIncome();
        }

        this.cancelEditCategoryIncomeButton = document.getElementById('cancelEditCategoryIncomeButton');
        this.cancelEditCategoryIncomeButton.onclick = () => {
            location.href = '#/income';
        }
    }

    async editCategoryIncome() {
        try {
            if(this.newNameCetegoryIncome.value){
                const response = await CustomHttp.request(config.host + '/categories/income/' + this.idElement, 'PUT', {
                    'title': this.newNameCetegoryIncome.value
                });
                if (!response) {
                    throw new Error("Неправильно отправлен запрос на изменение категории");
                } else {
                    localStorage.removeItem('idElement');
                    location.href = '#/income';
                }
            } else {
                alert('Укажите наименование категории');
            }
        } catch (error) {
            console.log(error);
        }
    }
}