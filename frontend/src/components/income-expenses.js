import {CustomHttp} from "../services/custom-http.js";
import {CommonConstruction} from "../services/common-construction.js";
import config from "../../config/config.js";
import {Balance} from "../services/balance.js";
import {Filter} from "../services/filter.js";


export class IncomeExpenses {
    constructor() {
        new AirDatepicker('#with');
        new AirDatepicker('#before');

        Balance.getActualBalance();
        this.buttons = document.getElementsByClassName('btn-filter');

        this.createIncomeButton = document.getElementById('createIncome');
        this.createIncomeButton.onclick = () => {
            console.log('1')
            location.href = '#/create-income-expenses';
        }

        this.createExpenseButton = document.getElementById('createExpense');
        this.createExpenseButton.onclick = () => {
            console.log('1')
            location.href = '#/create-income-expenses';
        }

        this.tableElement = document.getElementById('table');

        //Загрузка операций дохода/расхода "Сегодня" по умолчанию
        window.addEventListener('DOMContentLoaded', this.initShowFilterElementDefault());

        //Загрузка фильтра
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].onclick = () => {
                this.initShowFilterElement(this.buttons[i], this.tableElement);
                //Вешаем на кнопки класс active
                for (let j = 0; j < this.buttons.length; j++) {
                    this.buttons[j].classList.remove('active');
                }
                return this.buttons[i].classList.add('active');
            }
        }

        // обработка удаления в модальном окне
        this.deleteOperations = document.getElementById('deleteOperation');
        this.deleteOperations.onclick = () => {
            this.deleteOperationsIncomeExpense();
        }

        this.cancelDeleteOperation = document.getElementById('cancelDeleteOperation');
        this.cancelDeleteOperation.onclick = () => {
            location.href = '#/income-expenses';
        }

        //Обрабатываем разблокировку кнопки "Интервал" при наличии дат в полях ввода
        Filter.activeButtonInterval();
    }

    initShowFilterElementDefault() {
        return Filter.showFilterElementDefault(this.tableElement);
    }

    initShowFilterElement(buttons, tableElement) {
        return Filter.showFilterElement(buttons, tableElement);
    }

    async deleteOperationsIncomeExpense() {
        let operationId = CommonConstruction.getIdElement();
        try {
            const response = await CustomHttp.request(config.host + '/operations/' + operationId, 'DELETE');
            if (response.error) {
                throw new Error(response.message);
            } else {
                localStorage.removeItem('IdElement');
                location.href = '#/income-expenses';
            }
        } catch (error) {
            console.log(error);
        }
    }


}