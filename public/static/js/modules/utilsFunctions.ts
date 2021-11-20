import {monthMap} from '../constatns';
/**
 * Меняет формат даты регистрации
 * @param {*} date дата в формате год-месяц-день
 * @return {String} дата в формате день-месяц(словами)-год
 */
export function properDate(date: string):string {
  const regDate = date;
  const regArr = regDate.split('-');
  regArr[1] = monthMap.get(regArr[1]);
  regArr.reverse();
  const properDate = regArr.join(' ');
  return properDate;
}


export const validate = (field : HTMLInputElement, regex:RegExp) => {
  const valid = regex.test(field.value);
  const parent = field.parentNode as HTMLElement;
  if (valid) {
    parent.classList.remove('text-input_wrong');
    parent.classList.add('text-input_correct');
  } else {
    parent.classList.add('text-input_wrong');
  }
  return valid;
};