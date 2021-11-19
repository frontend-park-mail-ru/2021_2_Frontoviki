import productPathT from './productPath.handlebars';
import productSearchT from './productSearch.handlebars';
import navigateBackT from './navigation.handlebars';
import './info-block.sass';
/**
 * Функция создания меню 'пути продукта' вида category / subcategory
 * @param {JSON} productPath формата
 * category основная категория сортировки страницы.
 * Например 'Электротехника'.
 * categoryHref
 * subCategory более специализированная категория
 * сортировки страницы. Например 'смартфоны'.
 * subCategoryHref
 * @return {HTMLDivElement}
*/
export function createInfoBlock(searchText = null, productPath = null) {
  const infoBlock = document.createElement('div');
  infoBlock.classList.add('root__info-block');
  const navigateContainer = document.createElement('div');
  navigateContainer.innerHTML = navigateBackT();
  if (searchText !== null || productPath !== null) {
    infoBlock.appendChild(navigateContainer);
    if (searchText !== null) {
      infoBlock.appendChild(createProductSearch(searchText));
    }
    if (productPath !== null) {
      infoBlock.appendChild(createProductPath(productPath));
    }
  }
  return infoBlock;
}

function createProductPath(productPath) {
  const productClass = document.createElement('div');
  productClass.classList.add('info-block__left');
  productClass.classList.add('info-block__category');
  productClass.innerHTML = productPathT(productPath);
  return productClass;
};

function createProductSearch(searchText) {
  const search = document.createElement('div');
  search.classList.add('info-block__left');
  search.classList.add('info-block__search');
  search.innerHTML = productSearchT({searchText: searchText});
  return search;
}
