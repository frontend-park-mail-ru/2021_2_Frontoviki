'use strict';

import {createHeader} from '../content/header.js';

/**
  * Добавляем возможность скрывать модальное окно по клику по затемнению
*/
export function modalWork() {
  createHeader();
  const modalWindow = document.querySelector('.modal-window');
  const blackout = document.querySelector('.blackout');
  blackout.addEventListener('click', (e) => {
    e.preventDefault();

    modalWindow.classList.remove('active');
    blackout.classList.remove('active');

    const listener = function(e) {
      modalWindow.removeEventListener('webkitTransitionEnd', listener, false);
    };
    modalWindow.addEventListener('webkitTransitionEnd', listener, false);
  });

  const authLink = document.getElementById('auth');
  authLink.addEventListener('click', (e) => {
    e.preventDefault();

    replaceAuthForms('login');

    modalWindow.classList.add('active');
    blackout.classList.add('active');
  });


  /**
   * Добавляем возможность изменять форму логина на форму регистрации
   * по клику по ссылке модального окна
  */
  const loginToSignupAnchor = document.getElementById('mf-login_to_signup');
  loginToSignupAnchor.addEventListener('click', (e) => {
    e.preventDefault();
    replaceAuthForms('signup');
  });

  /**
   * Добавляем возможность изменять форму регистрации на форму
   *  логина по клику по ссылке модального окна
   */
  const signupToLoginAnchor = document.getElementById('mf-signup_to_login');
  signupToLoginAnchor.addEventListener('click', (e) => {
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

    if (replaceTo === 'signup') {
      signupBlock.className = '';
      loginBlock.className = 'mf-unactive';
    } else {
      signupBlock.className = 'mf-unactive';
      loginBlock.className = '';
    }
  };
};
