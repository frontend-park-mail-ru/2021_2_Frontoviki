import {autorisation} from '../../modules/autorisation';
import Bus from '../../modules/EventBus.js';
import {registration} from '../../modules/registration';
import { templateFunc } from '../../types';
import modalT from './modal.handlebars';
import './modal.sass';

/**
 * Создает модальное окно и цепляет его в основной div 'wrapper'
 * Важно, что функция запускается после создания root,
 * в котором лежит основной контент страницы
 * @param {*} globalEventBus глобальный емитер событий
 */
export function createModal(globalEventBus: Bus) {
  const modal = document.createElement('div');
  modal.classList.add('modal-window');
  modal.id = 'modal-window';
  modal.innerHTML = (<templateFunc>modalT)({
    createAccout: window.localizer.getLocaleItem('createAccout'),
    emailHint: window.localizer.getLocaleItem('emailHint'),
    name: window.localizer.getLocaleItem('name'),
    nameHint: window.localizer.getLocaleItem('nameHint'),
    surname: window.localizer.getLocaleItem('surname'),
    surnameHint: window.localizer.getLocaleItem('surnameHint'),
    password: window.localizer.getLocaleItem('password'),
    repeatPassword: window.localizer.getLocaleItem('repeatPassword'),
    repeatPasswordHint: window.localizer.getLocaleItem('repeatPasswordHint'),
    signUp: window.localizer.getLocaleItem('signUp'),
    signIn: window.localizer.getLocaleItem('signIn'),
    emailLogInHint: window.localizer.getLocaleItem('emailLogInHint'),
    passwordLogInHint: window.localizer.getLocaleItem('passwordLogInHint'),
    welcome: window.localizer.getLocaleItem('welcome'),
    signUpText: window.localizer.getLocaleItem('signUpText'),
    hi: window.localizer.getLocaleItem('hi'),
    signInText: window.localizer.getLocaleItem('signInText'),
    passwordFullHint: window.localizer.getLocaleItem('passwordFullHint'),
  });
  const wrapper = document.querySelector('.wrapper');
  wrapper?.appendChild(modal);

  const signUpButton = document.getElementById('overlay-sign-up');
  const signInButton = document.getElementById('overlay-sign-in');
  const container = document.getElementById('modal-window');

  signUpButton?.addEventListener('click', () => {
    container?.classList.add('right-panel-active');
  });

  signInButton?.addEventListener('click', () => {
    container?.classList.remove('right-panel-active');
  });
  const blackout = document.createElement('div');
  blackout.classList.add('blackout');
  wrapper?.appendChild(blackout);

  blackout.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.remove('active');
    blackout.classList.remove('active');

    const listener = function() {
      modal.removeEventListener('webkitTransitionEnd', listener, false);
    };
    modal.addEventListener('webkitTransitionEnd', listener, false);
  });

  const regEmail = document.querySelector('#regEmail') as HTMLDivElement;
  const regName = document.querySelector('#regName') as HTMLDivElement;
  const regSurname = document.querySelector('#regSurname') as HTMLDivElement ;
  const regPassword = document.querySelector('#regPassword')as HTMLDivElement ;
  const regRepPassword = document.querySelector('#regRepPassword')as HTMLDivElement ;
  document.querySelector('#regButton')?.addEventListener('click', (e) => {
    e.preventDefault();
    registration(regName, regSurname, regEmail, regPassword,
        regRepPassword, globalEventBus);
  });

  const logEmail = document.querySelector('#logEmail') as HTMLDivElement;
  const logPassword = document.querySelector('#logPassword') as HTMLDivElement;
  document.querySelector('#logButton')?.addEventListener('click', (e) => {
    e.preventDefault();
    autorisation(logEmail, logPassword, globalEventBus);
  });
}
