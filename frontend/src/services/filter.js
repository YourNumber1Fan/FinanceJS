import {CustomHttp} from "./custom-http.js";
import config from "../../config/config.js";
import {CommonConstruction} from "./common-construction.js";

export class Filter {

    static activeButtonInterval() {
        this.buttonInterval = document.getElementById('button-interval');

        document.getElementById('with').addEventListener('focusout', () => {
            let withValue = document.getElementById('with');
            let beforeValue = document.getElementById('before');
            if (withValue.value && beforeValue.value) {
                this.buttonInterval.disabled = false;
            }
        })

        document.getElementById('before').addEventListener('focusout', () => {
            let withValue = document.getElementById('with');
            let beforeValue = document.getElementById('before');
            if (withValue.value && beforeValue.value) {
                this.buttonInterval.disabled = false;
            }
        })

    }

    static async showFilterElementDefault(tableElement = null) {
        let actualDate = new Date();
        actualDate = this.ChangeDateFormatFilter(actualDate.toLocaleDateString());
        let result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + actualDate + '&dateTo=' + actualDate);
        if (tableElement) {
            CommonConstruction.getTable(result, tableElement);
        }
    }

    static async showFilterElement(button, tableElement = null) {
        let actualDate = new Date();
        let responseDate = null;
        let responseDateArray = [];
        let decreaseDate = null;
        let actualDateFormat = null;
        let responseDateFormat = null;
        let result = null;

        try {
            switch (button.innerText) {
                case 'Неделя':
                    decreaseDate = actualDate.getTime() - 604800000;
                    responseDate = new Date(decreaseDate);
                    actualDateFormat = this.ChangeDateFormatFilter(actualDate.toLocaleDateString());
                    responseDateFormat = this.ChangeDateFormatFilter(responseDate.toLocaleDateString());
                    result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + responseDateFormat + '&dateTo=' + actualDateFormat);
                    break;
                case 'Месяц':
                    let actualDateMonthArray = actualDate.toLocaleDateString().split('.');
                    let previousMonth = Number(actualDateMonthArray[1]) - 1;
                    responseDateArray[0] = actualDateMonthArray[2];
                    responseDateArray[1] = '0' + String(previousMonth);
                    responseDateArray[2] = actualDateMonthArray[0];
                    actualDateFormat = this.ChangeDateFormatFilter(actualDate.toLocaleDateString());
                    responseDateFormat = responseDateArray.join('-');
                    result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + responseDateFormat + '&dateTo=' + actualDateFormat);
                    break;
                case 'Год':
                    let actualDateYearArray = actualDate.toLocaleDateString().split('.');
                    let newYear = Number(actualDateYearArray[2]) - 1;
                    responseDateArray[0] = String(newYear);
                    responseDateArray[1] = actualDateYearArray[1];
                    responseDateArray[2] = actualDateYearArray[0];
                    actualDateFormat = this.ChangeDateFormatFilter(actualDate.toLocaleDateString());
                    responseDateFormat = responseDateArray.join('-');
                    result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + responseDateFormat + '&dateTo=' + actualDateFormat);
                    break;
                case 'Все':
                    result = await CustomHttp.request(config.host + '/operations?period=all&dateFrom=&dateTo=');
                    break;
                case 'Интервал':
                    responseDateFormat = document.getElementById('with');
                    actualDateFormat = document.getElementById('before');
                    if (responseDateFormat.value && actualDateFormat.value) {
                        result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + this.ChangeDateFormat(responseDateFormat) + '&dateTo=' + this.ChangeDateFormat(actualDateFormat));
                        responseDateFormat.value = '';
                        actualDateFormat.value = '';
                    }
                    break;
                default:
                    actualDate = this.ChangeDateFormatFilter(actualDate.toLocaleDateString());
                    result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + actualDate + '&dateTo=' + actualDate);
                    break;
            }

            if (!result && result.error) {
                throw new Error(result.message);
            } else {
                if (tableElement) {
                    CommonConstruction.getTable(result, tableElement);
                }
                // console.log(result);
                return result;
            }
        } catch (error) {
            console.log(error);
        }
    }

    static ChangeDateFormat(date) {
        const dateArray = date.value.split('.').reverse();
        return dateArray.join('-');
    }

    static ChangeDateFormatFilter(date) {
        const dateArray = date.split('.').reverse();
        return dateArray.join('-');
    }
}