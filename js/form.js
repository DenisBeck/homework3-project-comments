import { appModules } from "./modules.js";
import Comment from "./commentsClass.js"; 

class FormClass {

    constructor(form) {
        this.form = form;
    }

    formData;

    formValidate() {
        return ({
            getErrors(form) {
                let error = 0;
                let formRequiredItems = form.querySelectorAll('*[data-required]');
                if (formRequiredItems.length) {
                    formRequiredItems.forEach(formRequiredItem => {
                        error += this.validateInput(formRequiredItem);
                    });
                }
                return error;
            },
            validateInput(formRequiredItem) {
                let error = 0;
                if (!formRequiredItem.value.trim()) {
                    this.addError(formRequiredItem);
                    error++;
                } else {
                    this.removeError(formRequiredItem);
                }
                return error;
            },
            addError(formRequiredItem) {
                formRequiredItem.classList.add('_form-error');
                formRequiredItem.parentElement.classList.add('_form-error');
                let inputError = formRequiredItem.parentElement.querySelector('.form__error');
                if (inputError) formRequiredItem.parentElement.removeChild(inputError);
                if (formRequiredItem.dataset.error) {
                    formRequiredItem.parentElement.insertAdjacentHTML('beforeend', `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
                }
            },
            removeError(formRequiredItem) {
                formRequiredItem.classList.remove('_form-error');
                formRequiredItem.parentElement.classList.remove('_form-error');
                if (formRequiredItem.parentElement.querySelector('.form__error')) {
                    formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector('.form__error'));
                }
            },
            formClean(form) {
                form.reset();
                setTimeout(() => {
                    let inputs = form.querySelectorAll('input,textarea');
                    for (let index = 0; index < inputs.length; index++) {
                        const el = inputs[index];
                        el.parentElement.classList.remove('_form-focus');
                        el.classList.remove('_form-focus');
                    }
                }, 0);
            }
        });
    
    }

    formFieldsInit() {
        // Если включено, добавляем функционал "скрыть плейсходлер при фокусе"
        const formFields = this.form.querySelectorAll('input[placeholder],textarea[placeholder]');

        const validate = this.formValidate;
        if (formFields.length) {
            formFields.forEach(formField => {
                formField.dataset.placeholder = formField.placeholder;
            });
        }
        this.form.addEventListener("focusin", function (e) {
            const targetElement = e.target;
            if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
                if (targetElement.dataset.placeholder) {
                    targetElement.placeholder = ''; 
                }
                validate().removeError(targetElement);
            }
        });
        this.form.addEventListener("focusout", function (e) {
            const targetElement = e.target;
            if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
                if (targetElement.dataset.placeholder) {
                    targetElement.placeholder = targetElement.dataset.placeholder;
                }
                // Моментальная валидация
                if (targetElement.hasAttribute('data-validate')) {
                    validate().validateInput(targetElement);
                }
            }
        });
    }

    formSubmit() {
        const validate = this.formValidate;

        this.form.addEventListener('submit', function (e) {
            formSubmitAction(this, e);
        });
        this.form.addEventListener('keydown', function (e) {
            if(e.key === 'Enter') {
                formSubmitAction(this, e);
                e.target.blur();
            }
        });
        function formSubmitAction(form, e) {
            const error = validate().getErrors(form);

            if (error === 0) {
                e.preventDefault();
                formSent(form);
            } else {
                e.preventDefault();
                const formError = form.querySelector('._form-error');
                if (formError && form.hasAttribute('data-goto-error')) {
                    gotoBlock(formError, true, 1000);
                }
            }
        }
        // Действия после отправки формы
        function formSent(form, responseResult) {
            // Сохраняем данные в объект комментария
            const formData = new FormData(form);
            const comment = {};
            for (let key of formData.keys()) {
                comment[key] = formData.get(key);
                if(key === 'date') {
                    let now = new Date();
                    comment[key] = {
                        day: formData.get(key) || `${now.getFullYear()}-${(now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1)}-${(now.getDate() < 10 ? '0' : '') + now.getDate()}`,
                        time: `${(now.getHours() < 10 ? '0' : '') + now.getHours()}:${(now.getMinutes() < 10 ? '0' : '') + now.getMinutes()}`
                    }
                }
            }
            Comment.addComment(comment);
            appModules.toggleActiveClass();
            appModules.removeComment();
            // Очищаем форму
            validate().formClean(form);
            
        }
    }


}

appModules.commentForm = new FormClass(document.forms[0]);