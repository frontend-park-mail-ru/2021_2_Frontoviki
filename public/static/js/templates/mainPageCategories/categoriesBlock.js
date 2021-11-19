import categoryblockT from './categories.handlebars';
import './categories.sass';
/**
 * Функция создает блок категорий и возвращает html элемент
 * @param {Json} categoryList список категорий
 * @return {HTMLDivElement}
 */
export function categoriesBlock(categoryList) {
  const rootCategory = document.createElement('div');
  rootCategory.classList.add('root__category');
  rootCategory.innerHTML = categoryblockT({category: categoryList});
  return rootCategory;
}
