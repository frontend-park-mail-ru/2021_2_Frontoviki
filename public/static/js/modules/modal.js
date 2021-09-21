'use strict';

import { CreateHeader } from "../content/header.js";

// Добавляем возможность скрывать модальное окно по клику по затемнению
/// выполняется создание хедера и  привязка к событиям в ней юзаю асинк, чтобы дождаться генерации всех нужных объектов
export async function ModalWork() {
    CreateHeader();
    const modalWindow = document.querySelector('.modal-window');
    const blackout = document.querySelector('.blackout');
    blackout.addEventListener('click', e => {
        e.preventDefault();

        modalWindow.classList.remove('active');
        blackout.classList.remove('active');

        const listener = function (e) {
            modalWindow.removeEventListener('webkitTransitionEnd', listener, false);
        }
        modalWindow.addEventListener('webkitTransitionEnd', listener, false);
    });

    const authLink = document.getElementById('auth');
    authLink.addEventListener('click', e => {
        e.preventDefault();

        replaceAuthForms('login');

        modalWindow.classList.add('active');
        blackout.classList.add('active');
    });


    // Добавляем возможность изменять форму логина на форму регистрации по клику по ссылке модального окна
    const loginToSignupAnchor = document.getElementById('mf-login_to_signup');
    loginToSignupAnchor.addEventListener('click', e => {
        e.preventDefault();
        replaceAuthForms('signup');
    });


    // Добавляем возможность изменять форму регистрации на форму логина по клику по ссылке модального окна
    const signupToLoginAnchor = document.getElementById('mf-signup_to_login');
    signupToLoginAnchor.addEventListener('click', e => {
        e.preventDefault();
        replaceAuthForms('login');
    });


    /**
     * Заменяет формы логина и регистрации на модальном окне
     * @param {string} replaceTo - строка, указывающая на что заменить
     */
    const replaceAuthForms = (replaceTo) => {
        const loginBlock = document.getElementById('modal-login-form');
        const signupBlock = document.getElementById('modal-signup-form');

        switch (replaceTo) {
            case 'signup':
                signupBlock.className = "";
                loginBlock.className = "mf-unactive";
                break;

            case 'login':
                signupBlock.className = "mf-unactive";
                loginBlock.className = "";
                break;
        }
    }


    const patterns = {
        username: /^[a-z\d]{5,12}$/i,
        email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
        password: /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}$/i,
        telephone: /^\d{11}$/,
        slug: /^[a-z\d-]{8,20}$/i,
    };


    const validate = (field, regex) => {
        const valid = regex.test(field.value);
        if (valid) {
            field.className = 'valid';
        } else {
            field.className = 'invalid';
        }
        return valid;
    };


    const modalInputs = modalWindow.querySelectorAll('input:not([type="submit"])');
    modalInputs.forEach((input) => {
        input.addEventListener('keyup', (e) => {
            validate(e.target, patterns[e.target.attributes.name.value]);
        });
    });


    const forms = modalWindow.getElementsByClassName('modal-form');
    for (let form of forms) {
        form.addEventListener('submit', (e) => {
            const inputs = form.querySelectorAll('input:not([type="submit"])');
            let access = true;

            for (let input of inputs) {
                access = access && validate(input, patterns[input.attributes.name.value]);
            }

            if (!access) {
                alert('wrong data');
            }
        });
    }
};
