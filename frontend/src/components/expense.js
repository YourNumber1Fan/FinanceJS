import {CustomHttp} from "../services/custom-http.js";
import {CommonConstruction} from "../services/common-construction.js";
import config from "../../config/config.js";
import {Balance} from "../services/balance.js";

export class Expense {
    constructor() {
        Balance.getActualBalance();
        this.idElement = null;
        this.expenseCategory = [];
        this.wrapperExpenseCategories = document.getElementById('expense-item-elements');
        this.getExpenseCategories();

        this.removeCategoryExpense = document.getElementById('remove-category');
        this.removeCategoryExpense.onclick = () => {
            this.removeExpenseCategory();
        }

        this.createCategoryExpense = document.getElementById('add-category');
        this.createCategoryExpense.onclick = () => {
            location.href = '#/create-category-expense';
        }

    }

    async getExpenseCategories(){
        try {
            const response = await CustomHttp.request(config.host + '/categories/expense');
            if (response.error) {
                throw new Error(response.message);
            } else {
                this.expenseCategory = response;
                CommonConstruction.showCategory(this.expenseCategory, this.wrapperExpenseCategories, 'edit-category-expense');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async removeExpenseCategory(){
        this.idElement = CommonConstruction.getIdElement();
        try {
            await CommonConstruction.removeOperations(this.idElement, 'expense');
            const response = await CustomHttp.request(config.host + '/categories/expense/' + this.idElement,
                "DELETE");
            if (response.error) {
                throw new Error(response.message);
            } else {
                localStorage.removeItem('idElement');
                location.href = '#/expenses';
            }
        } catch (error) {
            console.log(error);
        }
    }

}