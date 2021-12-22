import categoryblockT from './categories.handlebars';
import {categoryList, templateFunc} from '../../types';
import './categories.sass';
import { engCategories } from '../../constatns';
/**
 * Функция создает блок категорий и возвращает html элемент
 * @param {Json} categoryList список категорий
 * @return {HTMLDivElement}
 */
export function categoriesBlock(categoryList : categoryList[]): HTMLDivElement {
  const rootCategory = document.createElement('div');
  rootCategory.classList.add('root__category');
  let list: categoryList[];
  categoryList.forEach(elem => {
    elem.href = elem.name;
  })
  if (window.localizer.userLang == 'en') {
    engCategories.forEach((elem, i: number) => {
      elem.href = categoryList[i].href;
    });
    list = engCategories;
  } else {
    list = categoryList;
  }
  rootCategory.innerHTML = (<templateFunc>categoryblockT)({
    category: list,
    categoryWelcome: window.localizer.getLocaleItem('categoryWelcome'),
  });
  return rootCategory;
}
