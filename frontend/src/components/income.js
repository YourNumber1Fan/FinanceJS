import {CustomHttp} from "../services/custom-http.js";
import {CommonConstruction} from "../services/common-construction.js";
import config from "../../config/config.js";
import {Balance} from "../services/balance.js";

export class Income {
    constructor() {
        Balance.getActualBalance();
        this.idElement = null;
        this.incomeCategory = [];
        this.wrapperIncomeCategories = document.getElementById('income-item-elements');
        this.getIncomeCategories();

        this.removeCategoryIncome = document.getElementById('remove-category');
        this.removeCategoryIncome.onclick = () => {
            this.removeIncomeCategory();
        }

        this.createCategoryIncome = document.getElementById('add-category');
        this.createCategoryIncome.onclick = () => {
            location.href = '#/create-category-income';
        }
    }

    async getIncomeCategories(){
        try {
            const response = await CustomHttp.request(config.host + '/categories/income');
            if (response.error) {
                throw new Error(response.message);
            } else {
                this.incomeCategory = response;
                CommonConstruction.showCategory(this.incomeCategory, this.wrapperIncomeCategories, 'edit-category-income');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async removeIncomeCategory(){
        this.idElement = CommonConstruction.getIdElement();
        try {
            await CommonConstruction.removeOperations(this.idElement, 'income');
            const response = await CustomHttp.request(config.host + '/categories/income/' + this.idElement,
                "DELETE");
            if (response.error) {
                throw new Error(response.message);
            } else {
                localStorage.removeItem('idElement');
                location.href = '#/income';
            }
        } catch (error) {
            console.log(error);
        }
    }

}