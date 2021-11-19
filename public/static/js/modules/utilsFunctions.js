import {monthMap} from '../constatns.js';
/**
 * Меняет формат даты регистрации
 * @param {*} date дата в формате год-месяц-день
 * @return {String} дата в формате день-месяц(словами)-год
 */
export function properDate(date) {
  const regDate = date;
  const regArr = regDate.split('-');
  regArr[1] = monthMap.get(regArr[1]);
  regArr.reverse();
  const properDate = regArr.join(' ');
  return properDate;
}
