import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Balance} from "../services/balance.js";
import {ProcessIncomeExpenses} from "../services/process-income-expenses.js";

export class IncomeExpensesEdit {
    constructor() {
        Balance.getActualBalance();

        this.categoriesName = ProcessIncomeExpenses.getCategoryName('categoriesName');
        this.nameCategory = ProcessIncomeExpenses.getCategoryName('nameCategory');

        this.selectIncomeExpenses = document.getElementById('selectIncomeExpenses');
        this.categoriesSelect = document.getElementById('categoriesSelect');
        this.editIncomeEpenses = document.getElementById('editIncomeExpenses');
        this.cancelEditIncomeExpenses = document.getElementById('cancelEditIncomeExpenses');
        this.categories = [];

        //Присваивание в поля тип и категория значения редактируемой операции, чтобы пользователь их не исправил
        //для типа операции (доход/расход)
        this.setValueCategory(this.categoriesName, this.selectIncomeExpenses);

        //для категории операции
        this.categoriesSelect.innerHTML = "<option>" + this.nameCategory + "</option>";
        this.categoriesSelect.disabled = true;

        //получение категорий дохода/расхода
        this.selectIncomeExpenses.onchange = () => {
            this.getCategories();
        }

        //отправка запроса на редактирование дохода/расхода
        this.editIncomeEpenses.onclick = () => {
            this.editItem();
        }

        //отмена отправки запроса на редактирование дохода/расхода
        this.cancelEditIncomeExpenses.onclick = () => {
            ProcessIncomeExpenses.removeCategoriesInfo('categoriesName');
            ProcessIncomeExpenses.removeCategoriesInfo('idElement');
            ProcessIncomeExpenses.removeCategoriesInfo('nameCategory');
            location.href = '#/income-expenses';
        }

        new AirDatepicker('#date');

    }

    setValueCategory(nameLocalStorage, selectElement) {
        if (nameLocalStorage === 'income') {
            selectElement.value = 'доход';
            selectElement.disabled = true;
        } else if (nameLocalStorage === 'expense') {
            selectElement.value = 'расход';
            selectElement.disabled = true;
        }
        return selectElement;
    }

    async getCategories() {
        try {
            let selectIncomeExpensesActual = document.getElementById('selectIncomeExpenses');
            let name = null;
            if (selectIncomeExpensesActual.value === 'доход') {
                name = 'income';
                ProcessIncomeExpenses.removeCategoriesInfo('categoriesName');
                ProcessIncomeExpenses.setCategoriesInfo('categoriesName', 'income');
            } else if (selectIncomeExpensesActual.value === 'расход') {
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

    async editItem() {
        const amount = document.getElementById('amount');
        const date = document.getElementById('date');
        const dateArray = date.value.split('.').reverse();
        const dateResponse = dateArray.join('-');
        const comment = document.getElementById('comment');
        const element_id = Number(ProcessIncomeExpenses.getCategoryName('idElement'));

        //изменение операции
        const categoryArray = await CustomHttp.request(config.host + '/categories/' + this.categoriesName);
        const category_id = categoryArray.find (item=> {
            if (item.title === this.nameCategory) {
                return item.id;
            }
        })

        try {
            if (this.categoriesName){
                const result = await CustomHttp.request(config.host + '/operations/' + element_id, 'PUT', {
                    type: this.categoriesName,
                    amount : Number(amount.value),
                    date: dateResponse,
                    comment: comment.value,
                    category_id: category_id.id
                });

                if(result.error){
                    throw new Error (result.message);
                } else {
                    ProcessIncomeExpenses.removeCategoriesInfo('categoriesName');
                    ProcessIncomeExpenses.removeCategoriesInfo('idElement');
                    ProcessIncomeExpenses.removeCategoriesInfo('nameCategory');
                    location.href = '#/income-expenses';
                }
            }
        } catch (error) {
            console.log (error);
        }
    }

}