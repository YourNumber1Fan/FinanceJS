import {Form} from "./components/form.js";
import {Auth} from "./services/auth.js";
import {Income} from "./components/income.js";
import {CreateCategoryIncome} from "./components/income-create.js";
import {EditCategoryIncome} from "./components/income-edit.js";
import {Expense} from "./components/expense.js";
import {CreateCategoryExpense} from "./components/expense-create.js";
import {EditCategoryExpense} from "./components/expense-edit.js";
import {IncomeExpenses} from "./components/income-expenses.js";
import {IncomeExpensesCreate} from "./components/income-expenses-create.js";
import {IncomeExpensesEdit} from "./components/income-expenses-edit.js";
import {Pie} from "./components/pie.js";
import {Menu} from "./services/menu.js";


export class Router {
    constructor() {

        this.contentElement = document.getElementById('content');
        this.titleElement = document.getElementById('page-title');

        this.routes = [
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: 'styles/common.css',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'templates/login.html',
                styles: 'styles/common.css',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/main',
                title: 'Главная',
                template: 'templates/main.html',
                styles: 'styles/common.css',
                secondPartTemplate: "templates/extraTemplates/pie.html",
                load: () => {
                    new Pie();
                }
            },
            {
                route: "#/income",
                title: "Доходы",
                template: "templates/main.html",
                secondPartTemplate: "templates/extraTemplates/income.html",
                load: () => {
                    new Income();
                }
            },
            {
                route: '#/create-category-income',
                title: 'Создание категории дохода',
                template: "templates/main.html",
                secondPartTemplate: "templates/extraTemplates/income-create.html",
                load: () => {
                    new CreateCategoryIncome();
                }
            },
            {
                route: '#/edit-category-income',
                title: 'Редактирование категории дохода',
                template: "templates/main.html",
                secondPartTemplate: "templates/extraTemplates/income-edit.html",
                load: () => {
                    new EditCategoryIncome();
                }
            },
            {
                route: "#/expenses",
                title: "Расходы",
                template: "templates/main.html",
                secondPartTemplate: "templates/extraTemplates/expense.html",
                load: () => {
                    new Expense();
                }
            },
            {
                route: '#/create-category-expense',
                title: 'Создание категории расхода',
                template: "templates/main.html",
                secondPartTemplate: "templates/extraTemplates/expense-create.html",
                load: () => {
                    new CreateCategoryExpense();
                }
            },
            {
                route: '#/edit-category-expense',
                title: 'Редактирование категории расхода',
                template: "templates/main.html",
                secondPartTemplate: "templates/extraTemplates/expense-edit.html",
                load: () => {
                    new EditCategoryExpense();
                }
            },
            {
                route: '#/income-expenses',
                title: 'Доходы и расходы',
                template: "templates/main.html",
                secondPartTemplate: "templates/extraTemplates/income-expenses.html",
                load: () => {
                    new IncomeExpenses();
                    new Menu();
                }
            },
            {
                route: '#/create-income-expenses',
                title: 'Создание дохода/расхода',
                template: "templates/main.html",
                secondPartTemplate: "templates/extraTemplates/income-expenses-create.html",
                load: () => {
                    new IncomeExpensesCreate();
                }
            },
            {
                route: '#/edit-income-expenses',
                title: 'Редактирование дохода/расхода',
                template: "templates/main.html",
                secondPartTemplate: "templates/extraTemplates/income-expenses-edit.html",
                load: () => {
                    new IncomeExpensesEdit();
                }
            },

        ]
    }

    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/login';
            this.modal = document.getElementsByClassName('modal-backdrop fade show');
            this.modal[0].classList.remove('modal-backdrop');
            return;
        }

        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });

        if (!newRoute) {
            window.location.href = '#/login';
            return;
        }

        this.contentElement.innerHTML =
            await fetch(newRoute.template).then(response => response.text());
        // this.stylesElement.setAttribute('href', newRoute.styles);
        this.secondaryContent = document.getElementById("main-content");
        if (this.secondaryContent) {
            this.secondaryContent.innerHTML = await fetch(newRoute.secondPartTemplate).then(response => response.text());
        }
        this.titleElement.innerText = newRoute.title;

        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);

        if (userInfo && accessToken) {
            this.userName = document.getElementById('profile-full-name');
            if(this.userName){
                this.userName.innerText = Auth.getUserInfo().name + ' ' + Auth.getUserInfo().lastName;
            }
        }

        newRoute.load();
    }

}