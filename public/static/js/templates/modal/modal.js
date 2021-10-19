import {autorisation} from '../../modules/autorisation.js';
import {registration} from '../../modules/registration.js';
import modalT from './modal.handlebars';
import './modal.css';

/**
 * Создает модальное окно и цепляет его в основной div 'wrapper'
 * Важно, что функция запускается после создания root,
 * в котором лежит основной контент страницы
 * @param {*} globalEventBus глобальный емитер событий
 */
export function createModal(globalEventBus) {
  const modal = document.createElement('div');
  modal.classList.add('modal-window');
  modal.id = 'modal-window';
  modal.innerHTML = modalT();
  const wrapper = document.querySelector('.wrapper');
  wrapper.appendChild(modal);

  const signUpButton = document.getElementById('overlay-sign-up');
  const signInButton = document.getElementById('overlay-sign-in');
  const container = document.getElementById('modal-window');

  signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
  });

  signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
  });
  const blackout = document.createElement('div');
  blackout.classList.add('blackout');
  wrapper.appendChild(blackout);

  blackout.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.remove('active');
    blackout.classList.remove('active');

    const listener = function(e) {
      modal.removeEventListener('webkitTransitionEnd', listener, false);
    };
    modal.addEventListener('webkitTransitionEnd', listener, false);
  });

  const regEmail = document.querySelector('#regEmail');
  const regName = document.querySelector('#regName');
  const regSurname = document.querySelector('#regSurname');
  const regPassword = document.querySelector('#regPassword');
  const regRepPassword = document.querySelector('#regRepPassword');
  document.querySelector('#regButton').addEventListener('click', (e) => {
    e.preventDefault();
    registration(regName, regSurname, regEmail, regPassword,
        regRepPassword, globalEventBus);
  });

  const logEmail = document.querySelector('#logEmail');
  const logPassword = document.querySelector('#logPassword');
  document.querySelector('#logButton').addEventListener('click', (e) => {
    e.preventDefault();
    autorisation(logEmail, logPassword, globalEventBus);
  });
}
