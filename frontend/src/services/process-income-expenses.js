export class ProcessIncomeExpenses {

    static setCategoriesInfo(categoriesName, categoriesInfo) {
        localStorage.setItem(categoriesName, JSON.stringify(categoriesInfo));
    }

    static removeCategoriesInfo(categoriesName) {
        localStorage.removeItem(categoriesName);
    }

    static getCategoriesInfo(keyName) {
        const categoriesInfo = localStorage.getItem(keyName);
        if (categoriesInfo) {
            return JSON.parse(categoriesInfo);
        }
        return null;
    }

    static getCategoryName(keyName) {
        const categoriesInfo = localStorage.getItem(keyName);
        if (categoriesInfo) {
            return categoriesInfo;
        }
        return null;
    }
}