import {inputNum, regExPatterns, oldPassNum} from '../constatns';
import {validate} from './utilsFunctions';
/**
 * функция регистрация нового пользователя
 * @param {HTMLFormElement} regName имя пользователя
 * @param {HTMLFormElement} regSurname фамилия пользователя
 * @param {HTMLFormElement} regEmail почта пользователя для регистрации
 * @param {HTMLFormElement} regPass пароль пользователя
 * @param {HTMLFormElement} regPassRep форма повторного ввода пароля
 * @return {*} значения инпутов
 */
export function validateInfo(regName : HTMLDivElement, 
  regSurname: HTMLDivElement, regEmail : HTMLDivElement,
    regPass: HTMLDivElement, regPassRep : HTMLDivElement) {
  const nameInput = regName.childNodes[inputNum] as HTMLInputElement;
  const name = nameInput.value.trim();

  const surnameInput = regSurname.childNodes[inputNum] as HTMLInputElement;
  const surname = surnameInput.value.trim();

  const emailInput = regEmail.childNodes[inputNum] as HTMLInputElement;
  const email = emailInput.value.trim();

  const passwordInput = regPass.childNodes[inputNum] as HTMLInputElement;
  const password = passwordInput.value.trim();

  const passwordRepInput = regPassRep.childNodes[inputNum] as HTMLInputElement;
  const passwordRep = passwordRepInput.value.trim();


  const valid = validate(emailInput, regExPatterns['email']) &&
      validate(passwordInput, regExPatterns['password']);

  if (!valid) {
    const emailLabel = regEmail.childNodes[oldPassNum] as HTMLElement;
    emailLabel.innerHTML = 'Введите валидный email';
    return;
  }
  if (passwordRep !== null) {
    if (password !== passwordRep) {
      regPassRep.classList.add('text-input_wrong');
      return;
    }
    regPassRep.classList.remove('text-input_wrong');
    regPassRep.classList.add('text-input_correct');
  }
  if (!name.match(regExPatterns.name)) {
    regName.classList.add('text-input_wrong');
    return;
  }
  regName.classList.remove('text-input_wrong');
  regName.classList.add('text-input_correct');

  if (!surname.match(regExPatterns.name)) {
    regSurname.classList.add('text-input_wrong');
    return;
  }
  regSurname.classList.remove('text-input_wrong');
  regSurname.classList.add('text-input_correct');
  return {name, surname, email, password};
}
