import inputT from 'input.handlebars';
import './input.sass';

/**
 * Создает инпут
 * @param {*} title имя инпута
 * @param {*} description описание в случае ошибка
 * @return {*}
 */
export function createInput(title, description) {
  const input = document.createElement('div');
  input.innerHTML = inputT({inputName: title, inputDesc: description});
  input.classList.add('text-input');
  return input;
}
