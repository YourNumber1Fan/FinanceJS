import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Balance} from "../services/balance.js";
import {ProcessIncomeExpenses} from "../services/process-income-expenses.js";

export class IncomeExpensesCreate {

    constructor() {
        Balance.getActualBalance();
        this.selectIncomeExpenses = document.getElementById('selectIncomeExpenses');
        this.categoriesSelect = document.getElementById('categoriesSelect');
        this.createItemIncomeExpenses = document.getElementById('createIncomeExpenses');
        this.cancelCreateItemIncomeExpenses = document.getElementById('cancelCreateIncomeExpenses');
        this.categories = [];

        //получение категорий с сервера дохода/расхода при изменении select
        this.selectIncomeExpenses.onchange = () => {
            this.getCategories();
        }

        //отправка запроса на создание дохода/расхода
        this.createItemIncomeExpenses.onclick = () => {
            this.createItem();
        }

        //отмена отправки запроса на создание дохода/расхода
        this.cancelCreateItemIncomeExpenses.onclick = () => {
            location.href = '#/income-expenses';
        }

        new AirDatepicker('#date');
    }

    async getCategories() {
        try {
            let selectIncomeExpensesCurrent = document.getElementById('selectIncomeExpenses');
            let name = null;
            if (selectIncomeExpensesCurrent.value === 'доход') {
                name = 'income';
                ProcessIncomeExpenses.removeCategoriesInfo('categoriesName');
                ProcessIncomeExpenses.setCategoriesInfo('categoriesName', 'income');
            } else if (selectIncomeExpensesCurrent.value === 'расход') {
                name = 'expense';
                ProcessIncomeExpenses.removeCategoriesInfo('categoriesName');
                ProcessIncomeExpenses.setCategoriesInfo('categoriesName', 'expense');
            }

            if (name) {
                this.categories = await this.responseCategories('/categories/' + name);
                this.setCategoriesToSelect();
            } else {
                this.removeCategoriesToSelect();
                throw new Error('Отсутствует значение дохода/расхода');
            }

        } catch (error) {
            console.log(error);
        }
    }

    async responseCategories(hashResponse) {
        try {
            const response = await CustomHttp.request(config.host + hashResponse);
            if (response.error) {
                throw new Error(response.message);
            } else {
                return response;
            }
        } catch (error) {
            console.log(error);
        }
    }

    setCategoriesToSelect() {
        if (this.categories) {
            this.removeCategoriesToSelect();
            for (let i = 0; i < this.categories.length; i++) {
                const optionElement = document.createElement('option');
                optionElement.setAttribute('id', this.categories[i].id);
                optionElement.setAttribute('value', this.categories[i].title);
                optionElement.innerText = this.categories[i].title;
                this.categoriesSelect.append(optionElement);
            }
        }
    }

    removeCategoriesToSelect() {
        this.categoriesSelect.innerHTML = '';
    }

    async createItem() {
        const categoriesName = ProcessIncomeExpenses.getCategoriesInfo('categoriesName');
        const selectIncomeExpenses = document.getElementById('selectIncomeExpenses');
        const categoriesSelect = document.getElementById('categoriesSelect');
        const amount = document.getElementById('amount');
        const date = document.getElementById('date');
        const dateArray = date.value.split('.').reverse();
        const dateResponse = dateArray.join('-');
        const comment = document.getElementById('comment');
        const category_id = this.getCategoryId();

        if(!selectIncomeExpenses.value || !categoriesSelect.value ||
            !amount.value || !date.value || !comment.value){
            alert ('Заполните все поля для создания категории');
        } else {
            try {
                if (categoriesName){
                    const result = await CustomHttp.request(config.host + '/operations', 'POST',{
                        type: categoriesName,
                        amount: +amount.value,
                        date: dateResponse,
                        comment: comment.value,
                        category_id: +category_id
                        });

                    if(result.error){
                        throw new Error(result.message);
                    } else {
                        ProcessIncomeExpenses.removeCategoriesInfo('categoriesName');
                        location.href = '#/income-expenses';
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }

    }

    getCategoryId() {
        let selectCategoryActual = document.getElementById('categoriesSelect');
        let categories = Array.from(this.categoriesSelect.childNodes);
        let activeCategory = categories.find(item => {
            return item.textContent === selectCategoryActual.value;
        })
        if(activeCategory){
            return activeCategory.getAttribute('id');
        }
    }

}