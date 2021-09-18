'use strict';

const root = document.getElementById('root');
const modalWindow = document.createElement('div');
modalWindow.classList.add('modal-window');

/**
 * Создает скрытое модальное окно при загрузке страницы
 * @function createModalWindow
 */
const createModalWindow = (modalWindow) => {
    const socials = document.createElement('div');
    socials.classList.add('socials');
    const socialsCaption = document.createElement('h1');
    socialsCaption.innerHTML = 'Connect with';

    const links = document.createElement('div');
    const vkLogin = createSocialLogin('VK', '#');
    const googleLogin = createSocialLogin('Google', '#');
    const otherLogin = createSocialLogin('Another way', '#');

    links.appendChild(vkLogin);
    links.appendChild(googleLogin);
    links.appendChild(otherLogin);

    socials.appendChild(socialsCaption);
    socials.appendChild(links);

    modalWindow.appendChild(socials);

    // создание фона
    const blackout = document.createElement('div');
    blackout.classList.add('blackout');
    // добавляю возможность сокрытия окна по клику по фону
    blackout.addEventListener('click', e => {
        modalWindow.classList.remove('active');
        blackout.classList.remove('active');

        const listener = function (e) {
            modalWindow.removeEventListener('webkitTransitionEnd', listener, false);
        }
        modalWindow.addEventListener('webkitTransitionEnd', listener, false);
    });

    root.appendChild(modalWindow);
    root.appendChild(blackout);

}


/**
 * Удаляет актуальную форму модального окна
 * @function removeForm
 */
const removeForm = () => {
    const form = document.getElementById('modal-form');
    if (!form) return;
    // удаление всех полей в форме
    while (form.firstChild) {
        while (form.firstChild.firstChild) {
            form.firstChild.firstChild.remove();
        }
        form.firstChild.remove();
    }
    form.remove();
}


/**
 * Генерирует тег для входа по соц сети
 * @param {string} text - текст для соц сетки
 * @param {string} link - ссылка на авторизацию
 * @returns {HTMLElement} - сгенерированный тег
 */
const createSocialLogin = (text, link) => {
    const social = document.createElement('a');
    social.innerHTML = text;
    social.href = link;                         // link!
    return social;
}


const authLink = document.getElementById('auth');
const loginElement = document.createElement('div');
const signupElement = document.createElement('div');

loginElement.id = 'modal-form';
signupElement.id = 'modal-form';


authLink.addEventListener('click', e => {
    e.preventDefault();

    const modalWindow = document.querySelector('.modal-window');
    const blackout = document.querySelector('.blackout');

    // createLoginForm(modalWindow);
    replaceAuthForms(modalWindow, 'login');

    modalWindow.classList.add('active');
    blackout.classList.add('active');
})


/**
 * Функция для удобного создания частей формы
 * @function createInput
 * @param {string} type - тип input-а
 * @param {string} text - текст-подсказка input-а
 * @param {name} text - имя input-а
 * @returns {HTMLElement} - сгенерированный тег
 */
const createInput = (type, text, name) => {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.placeholder = text;

    return input;
}

/**
 * Заменяет формы логина и регастрации на модальном окне
 * @param {HTMLElement} modalWindow - объект модельного окна
 * @param {string} replaceTo - строка, указывающая на что заменить
 */
const replaceAuthForms = (modalWindow, replaceTo) => {
    const authElement = document.getElementById('modal-form');
    if (modalWindow.contains(authElement)) {
        modalWindow.removeChild(authElement);
    }

    switch (replaceTo) {
        case 'signup':
            modalWindow.appendChild(signupElement);
            break;

        case 'login':
            modalWindow.appendChild(loginElement);
            break;
    }
}


/**
 * Создает форму входа
 * @function createLoginForm
 */
const createLoginForm = (modalWindow) => {
    const form = document.createElement('form');

    const loginCaption = document.createElement('h1');
    loginCaption.innerHTML = 'Вход';

    const emailInput = createInput('email', 'Емайл', 'email');
    const passwordInput = createInput('password', 'Пароль', 'password');

    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.value = 'Войти';

    const signupA = document.createElement('a');
    signupA.innerHTML = 'Регистрация';
    signupA.href = '';
    signupA.addEventListener('click', (e) => {
        e.preventDefault();
        replaceAuthForms(modalWindow, 'signup');
    });

    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(submitBtn);
    form.appendChild(signupA);

    // добавить eventListener на форму для отправки запроса
    // ...

    loginElement.appendChild(loginCaption);
    loginElement.appendChild(form);
}


/**
 * Создает форму регистрации
 * @function createSignUpForm
 */
const createSignUpForm = (modalWindow) => {
    const signupCaption = document.createElement('h1');
    signupCaption.innerHTML = 'Регистрация';

    const form = document.createElement('form');
    form.id = 'modal-form';

    const nameInput = createInput('text', 'Имя', 'text');
    const emailInput = createInput('email', 'Емайл', 'email');
    const passwordInput = createInput('password', 'Пароль', 'password');
    const confirmPasswordInput = createInput('password', 'Повторите пароль', 'password');

    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.value = 'Создать';

    const loginA = document.createElement('a');
    loginA.innerHTML = 'Вход';
    loginA.href = '';
    loginA.addEventListener('click', (e) => {
        e.preventDefault();
        replaceAuthForms(modalWindow, 'login');
    })

    form.appendChild(nameInput);
    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(confirmPasswordInput);
    form.appendChild(loginA);
    form.appendChild(submitBtn);

    // добавить eventListener на форму для отправки запроса
    // ...

    signupElement.appendChild(signupCaption);
    signupElement.appendChild(form);
}



createModalWindow(modalWindow);
createLoginForm(modalWindow);
createSignUpForm(modalWindow);
