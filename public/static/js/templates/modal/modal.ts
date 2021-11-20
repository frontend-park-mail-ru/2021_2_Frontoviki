import {autorisation} from '../../modules/autorisation.js';
import Bus from '../../modules/EventBus.js';
import {registration} from '../../modules/registration.js';
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
  modal.innerHTML = modalT();
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

  const regEmail = document.querySelector('#regEmail') as HTMLFormElement;
  const regName = document.querySelector('#regName') as HTMLFormElement;
  const regSurname = document.querySelector('#regSurname') as HTMLFormElement ;
  const regPassword = document.querySelector('#regPassword')as HTMLFormElement ;
  const regRepPassword = document.querySelector('#regRepPassword')as HTMLFormElement ;
  document.querySelector('#regButton')?.addEventListener('click', (e) => {
    e.preventDefault();
    registration(regName, regSurname, regEmail, regPassword,
        regRepPassword, globalEventBus);
  });

  const logEmail = document.querySelector('#logEmail') as HTMLFormElement;
  const logPassword = document.querySelector('#logPassword') as HTMLFormElement;
  document.querySelector('#logButton')?.addEventListener('click', (e) => {
    e.preventDefault();
    autorisation(logEmail, logPassword, globalEventBus);
  });
}
