import { card, templateFunc } from '../../types';
import productGridT from './productGrid.handlebars';
import './card.sass';
import './skiny.sass';
import './cardMenu.sass';
import './productGrid.sass';
/**
  * Экспортируемая функция для создания сетки объявлений
  * @param {Array<JSON>} jsonElements массив объявлений в формате json
  * @param {bool} canDelete добавляет значок удаления
  * @param {bool} canBuy добавляет кнопку купить
  * @return {HTMLDivElemnt} div элемент сетки
*/
export function createProductGrid(jsonElements: card[], canDelete : boolean, canBuy : boolean) : HTMLDivElement {
  const productGrid = document.createElement('div');
  productGrid.classList.add('grid-container');
  jsonElements.forEach((element) => {
    element.format = element.image.split('__')[1];
    element.canDelete = canDelete;
    element.canBuy = canBuy;
    element.location = element.location.split(',')[0];
    element.buy = <string>window.localizer.getLocaleItem('buy');
    if (element.price == '0') {
      element.price = <string>window.localizer.getLocaleItem('zeroPrice');
    } else {
      element.price += ' ₽';
    }
  });
  productGrid.innerHTML = (<templateFunc> productGridT)({adsArray: jsonElements});
  return productGrid;
}
