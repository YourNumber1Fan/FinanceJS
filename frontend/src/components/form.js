import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";

export class Form {
    constructor(page) {
        this.rememberMe = document.getElementById("remember-me");
        this.button = document.getElementById("process");
        this.page = page;

        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false
            }
        ];

        if (this.page === 'signup') {
            this.fields.unshift({
                    name: 'fullName',
                    id: 'fullName',
                    element: null,
                    regex: /^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/,
                    valid: false
                },
                {
                    name: 'passwordRepeat',
                    id: 'passwordRepeat',
                    element: null,
                    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                    valid: false,
                    matchPassword: 'password',
                });
        }

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        });
        this.button.onclick = function () {
            that.processForm();
        }
    }

    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.classList.add("is-invalid");
            // element.parentNode.style.borderColor = 'red';
            field.valid = false;
        } else {
            // element.parentNode.removeAttribute('style');
            element.classList.remove("is-invalid");
            field.valid = true;
        }
        if (field.matchPassword) {
            const password = this.fields.find(item => item.name === field.matchPassword).element;
            if (password.value !== element.value) {
                element.classList.add("is-invalid");
                field.valid = false;
            } else {
                element.classList.remove("is-invalid");
                field.valid = true;
            }
        }
        this.validateForm();
    }

    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        const isValid = validForm;
        if (isValid) {
            this.button.removeAttribute("disabled");
        } else {
            this.button.setAttribute("disabled", "disabled");
        }
        return isValid;
    }

    async processForm() {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === "email").element.value;
            const password = this.fields.find(item => item.name === "password").element.value;

            let rememberMe = true;
            if (this.rememberMe && !this.rememberMe.checked) {
                rememberMe = false;
            }

            if (this.page === "signup") {
                const nameInput = document.getElementById("fullName");
                const nameInputParts = nameInput.value.split(" ");
                const name = nameInputParts[0];
                const lastName = nameInputParts.length > 1 ? nameInputParts.slice(1).join(" ") : "";

                try {
                    const result = await CustomHttp.request(config.host + "/signup", "POST", {
                        name: name,
                        lastName: lastName,
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === "passwordRepeat").element.value,
                    });

                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }
                    }
                } catch (error) {
                    return console.log(error);
                }
            }

            try {
                const result = await CustomHttp.request(config.host + "/login", "POST", {
                    email: email,
                    password: password,
                    rememberMe: rememberMe,
                });

                if (result) {
                    // if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user.name || !result.user.lastName || !result.user.id) {
                    if (result.error || !result.tokens || !result.user ) {
                        throw new Error(result.message);
                    }

                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        name: result.user.name,
                        lastName: result.user.lastName,
                        id: result.user.id,
                    });
                    location.href = "#/main";
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}