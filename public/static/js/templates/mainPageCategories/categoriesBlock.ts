import categoryblockT from './categories.handlebars';
import {categoryList, templateFunc} from '../../types';
import './categories.sass';
/**
 * Функция создает блок категорий и возвращает html элемент
 * @param {Json} categoryList список категорий
 * @return {HTMLDivElement}
 */
export function categoriesBlock(categoryList : categoryList[]): HTMLDivElement {
  const rootCategory = document.createElement('div');
  rootCategory.classList.add('root__category');
  rootCategory.innerHTML = (<templateFunc>categoryblockT)({category: categoryList});
  return rootCategory;
}
