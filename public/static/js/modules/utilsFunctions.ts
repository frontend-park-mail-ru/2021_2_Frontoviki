import {monthMap, monthMapEng} from '../constatns';
/**
 * Меняет формат даты регистрации
 * @param {*} date дата в формате год-месяц-день
 * @return {String} дата в формате день-месяц(словами)-год
 */
export function properDate(date: string):string {
  const regDate = date;
  const regArr = regDate.split('-');
  if (window.localizer.userLang == 'en') {
    regArr[1] = <string>monthMapEng.get(regArr[1]);
  } else {
    regArr[1] = <string>monthMap.get(regArr[1]);
  }
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