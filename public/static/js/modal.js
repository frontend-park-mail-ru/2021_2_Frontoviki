'use strict';

const root = document.getElementById('root');

/**
 * Создает скрытое модальное окно при загрузке страницы
 * @function createModalWindow
 */
const createModalWindow = () => {
    // создание модального окна
    const window = document.createElement('div');
    window.classList.add('modal-window');

    const socials = document.createElement('div');
    const vkLogin = createSocialLogin('VK', '#');
    const googleLogin = createSocialLogin('Google', '#');
    const otherLogin = createSocialLogin('Another way', '#');

    socials.appendChild(vkLogin);
    socials.appendChild(googleLogin);
    socials.appendChild(otherLogin);
    window.appendChild(socials);

    // создание фона
    const blackout = document.createElement('div');
    blackout.classList.add('blackout');
    // добавляю возможность сокрытия окна по клику по фону
    blackout.addEventListener('click', e => {
        window.classList.remove('active');
        blackout.classList.remove('active');

        // удаление формы с окна строго после обновления анимации
        // необходимо объявить функцию для последующего удаления обработчика
        const listener = function(e) {
            removeForm();
            window.removeEventListener('webkitTransitionEnd', listener, false);
        }
        window.addEventListener('webkitTransitionEnd', listener, false);
    });

    root.appendChild(window);
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

authLink.addEventListener('click', e => {
    e.preventDefault();
    
    const window = document.querySelector('.modal-window');
    const blackout = document.querySelector('.blackout');

    createLoginForm(window);

    window.classList.add('active');
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
 * Создает форму входа и добавляет его на модальное окно
 * @function createLoginForm
 * @param {HTMLElement} window - объект модального окна
 */
const createLoginForm = (window) => {
    const form = document.createElement('form');
    form.id = 'modal-form';

    const H = document.createElement('h1');
    H.innerHTML = 'Вход';

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
        removeForm();
        createSignUpForm(window);
    })

    form.appendChild(H);
    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(submitBtn);
    form.appendChild(signupA);

    // добавить eventListener на форму для отправки запроса
    // ...

    window.appendChild(form);
}


/**
 * Создает форму регистрации и добавляет его на модальное окно
 * @function createSignUpForm
 * @param {HTMLElement} window - объект модального окна
 */
 const createSignUpForm = (window) => {
    const H = document.createElement('h1');
    H.innerHTML = 'Регистрация';

    const form = document.createElement('form');
    form.id = 'modal-form';

    const nameInput = createInput('text', 'Имя', 'text');
    const emailInput = createInput('email', 'Емайл', 'email');
    const passwordInput = createInput('password', 'Пароль', 'password');
    const confirmPasswordInput = createInput('password', 'Повторите пароль', 'password');

    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.value = 'Зарегистрироваться';

    const loginA = document.createElement('a');
    loginA.innerHTML = 'Вход';
    loginA.href = '';
    loginA.addEventListener('click', (e) => {
        e.preventDefault();
        removeForm();
        createLoginForm(window);
    })

    form.appendChild(H);
    form.appendChild(nameInput);
    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(confirmPasswordInput);
    form.appendChild(submitBtn);
    form.appendChild(loginA);

    // добавить eventListener на форму для отправки запроса
    // ...

    window.appendChild(form);
}



createModalWindow();
