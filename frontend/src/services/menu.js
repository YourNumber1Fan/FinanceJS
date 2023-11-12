export class Menu {
    constructor() {

        this.menuIncomeExpenses = document.getElementById('menu-income-expenses');

        this.menuIncomeExpenses.onclick = () => {
            this.menuIncomeExpenses.classList.add('active');
            console.log('111')
        }
    }
}