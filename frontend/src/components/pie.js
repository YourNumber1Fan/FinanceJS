import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Balance} from "../services/balance.js";
import {Filter} from "../services/filter.js";
// import {Chart} from "chart.js";

export class Pie {
    constructor() {
        Balance.getActualBalance();
        this.categoryNameIncomeArray = [];
        this.categoryValueIncomeArray = [];
        this.categoryColorIncomeArray = [];
        this.categoryNameExpensesArray = [];
        this.categoryValueExpensesArray = [];
        this.categoryColorExpensesArray = [];
        this.result = null;
        this.refreshToken = null;
        this.pieIncome = null;
        this.pieExpenses = null;
        this.canvasIncome = document.getElementById('pie-income');
        this.canvasExpenses = document.getElementById('pie-expenses');
        this.buttons = document.getElementsByClassName('btn-filter');

        new AirDatepicker('#with');
        new AirDatepicker('#before');

        Filter.activeButtonInterval();

        //Загрузка операций дохода/расхода "Сегодня" по умолчанию
        window.addEventListener('DOMContentLoaded', this.initShowFilterElement());

        //Загрузка фильтра
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].onclick = () => {
                this.initShowFilterElement(this.buttons[i]);

                //Вешаем на кнопки класс active
                for (let j = 0; j < this.buttons.length; j++) {
                    this.buttons[j].classList.remove('active');
                }
                return this.buttons[i].classList.add('active');
            }
        }
    }

    async initShowFilterElement(buttons = null) {
        let actualDate = new Date();
        let responseDate = null;
        let responseDateArray = [];
        let decreaseDate = null;
        let actualDateFormat = null;
        let responseDateFormat = null;

        this.categoryNameIncomeArray = [];
        this.categoryValueIncomeArray = [];
        this.categoryColorIncomeArray = [];
        this.categoryNameExpensesArray = [];
        this.categoryValueExpensesArray = [];
        this.categoryColorExpensesArray = [];

        if (this.pieIncome) {
            this.pieIncome.destroy();
        }
        if (this.pieExpenses) {
            this.pieExpenses.destroy();
        }

        try {
            if (buttons) {
                switch (buttons.innerText) {
                    case 'Неделя':
                        decreaseDate = actualDate.getTime() - 604800000;
                        responseDate = new Date(decreaseDate);
                        actualDateFormat = Filter.ChangeDateFormatFilter(actualDate.toLocaleDateString());
                        responseDateFormat = Filter.ChangeDateFormatFilter(responseDate.toLocaleDateString());
                        this.result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + responseDateFormat + '&dateTo=' + actualDateFormat);
                        break;
                    case 'Месяц':
                        let actualDateMonthArray = actualDate.toLocaleDateString().split('.');
                        let previousMonth = Number(actualDateMonthArray[1]) - 1;
                        responseDateArray[0] = actualDateMonthArray[2];
                        responseDateArray[1] = '0' + String(previousMonth);
                        responseDateArray[2] = actualDateMonthArray[0];
                        actualDateFormat = Filter.ChangeDateFormatFilter(actualDate.toLocaleDateString());
                        responseDateFormat = responseDateArray.join('-');
                        this.result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + responseDateFormat + '&dateTo=' + actualDateFormat);
                        break;
                    case 'Год':
                        let actualDateYearArray = actualDate.toLocaleDateString().split('.');
                        let previousYear = Number(actualDateYearArray[2]) - 1;
                        responseDateArray[0] = String(previousYear);
                        responseDateArray[1] = actualDateYearArray[1];
                        responseDateArray[2] = actualDateYearArray[0];
                        actualDateFormat = Filter.ChangeDateFormatFilter(actualDate.toLocaleDateString());
                        responseDateFormat = responseDateArray.join('-');
                        this.result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + responseDateFormat + '&dateTo=' + actualDateFormat);
                        break;
                    case 'Все':
                        this.result = await CustomHttp.request(config.host + '/operations?period=all&dateFrom=&dateTo=');
                        break;
                    case 'Интервал':
                        responseDateFormat = document.getElementById('with');
                        actualDateFormat = document.getElementById('before');
                        if (responseDateFormat.value && actualDateFormat.value) {
                            this.result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + ChangeDate.ChangeDateFormat(responseDateFormat) + '&dateTo=' + ChangeDate.ChangeDateFormat(actualDateFormat));
                            responseDateFormat.value = '';
                            actualDateFormat.value = '';
                        }
                        break;
                    default:
                        actualDate = Filter.ChangeDateFormatFilter(actualDate.toLocaleDateString());
                        this.result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + actualDate + '&dateTo=' + actualDate);
                        break;
                }
            } else {
                actualDate = Filter.ChangeDateFormatFilter(actualDate.toLocaleDateString());
                this.result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + actualDate + '&dateTo=' + actualDate);
            }



            if (!this.result && this.result.error) {
                throw new Error(this.result.message);
            } else {
                let incomeArray = this.result.filter(item => {
                    return item.type === 'income';
                });
                let expensesArray = this.result.filter(item => {
                    return item.type === 'expense';
                });

                // console.log(incomeArray);
                // console.log(expensesArray);

                //Формирование данных для диаграммы Доходы
                try {
                    const incomeCategory = await CustomHttp.request(config.host + '/categories/income');
                    if (incomeCategory.error) {
                        throw new Error(incomeCategory.message);
                    } else {

                        for (let i = 0; i < incomeCategory.length; i++) {
                            this.categoryNameIncomeArray[i] = incomeCategory[i].title;
                        }

                        for (let i = 0; i < this.categoryNameIncomeArray.length; i++) {
                            this.categoryValueIncomeArray[i] = 0;
                            for (let j = 0; j < incomeArray.length; j++) {
                                if (this.categoryNameIncomeArray[i] === incomeArray[j].category) {
                                    this.categoryValueIncomeArray[i] += incomeArray[j].amount;
                                }
                            }
                        }

                        for (let i = 0; i < this.categoryValueIncomeArray.length; i++) {
                            this.categoryColorIncomeArray[i] = `hsla(${Math.random() * 360}, 100%, 50%, 1)`
                        }
                    }
                } catch (error) {
                    console.log(error);
                }

                //Загрузка диаграммы доходов
                let ctxIncome = this.canvasIncome.getContext('2d');
                this.pieIncome = new Chart(ctxIncome, {
                    type: 'pie',
                    data: {
                        datasets: [{
                            data: this.categoryValueIncomeArray,
                            background: this.categoryColorIncomeArray
                        }],
                        labels: this.categoryNameIncomeArray
                    },
                    options: {
                        responsive: true
                    }
                })

                //Формирование данных для диаграммы Расходы
                try {
                    const expensesCategory = await CustomHttp.request(config.host + '/categories/expense');
                    if (expensesCategory.error) {
                        throw new Error(expensesCategory.message);
                    } else {

                        for (let i = 0; i < expensesCategory.length; i++) {
                            this.categoryNameExpensesArray[i] = expensesCategory[i].title;
                        }

                        for (let i = 0; i < this.categoryNameExpensesArray.length; i++) {
                            this.categoryValueExpensesArray[i] = 0;
                            for (let j = 0; j < expensesArray.length; j++) {
                                if (this.categoryNameExpensesArray[i] === expensesArray[j].category) {
                                    this.categoryValueExpensesArray[i] += expensesArray[j].amount;
                                }
                            }
                        }

                        for (let i = 0; i < this.categoryValueExpensesArray.length; i++) {
                            this.categoryColorExpensesArray[i] = () => `hsla(${Math.random() * 360}, 100%, 50%, 1)`
                        }
                    }
                } catch (error) {
                    console.log(error);
                }

                //Загрузка диаграммы расходов
                let ctxExpenses = this.canvasExpenses.getContext('2d');
                this.pieExpenses = new Chart(ctxExpenses, {
                    type: 'pie',
                    data: {
                        datasets: [{
                            data: this.categoryValueExpensesArray,
                            background: this.categoryColorExpensesArray
                        }],
                        labels: this.categoryNameExpensesArray
                    },
                    options: {
                        responsive: true
                    }
                })
            }

        } catch (error) {
            console.log(error);
        }

    }

}