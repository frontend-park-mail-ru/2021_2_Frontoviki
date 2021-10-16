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
  if (searchText !== null) {
    infoBlock.appendChild(createProductSearch(searchText));
  }
  if (productPath !== null) {
    infoBlock.appendChild(createProductPath(productPath));
  }
  return infoBlock;
}

function createProductPath(productPath) {
  const productClass = document.createElement('div');
  productClass.classList.add('info-block__left');
  productClass.classList.add('info-block__category');
  const productClassTemplate = Handlebars.templates.productPath;
  productClass.innerHTML = productClassTemplate(productPath);
  return productClass;
};

function createProductSearch(searchText) {
  const search = document.createElement('div');
  search.classList.add('info-block__left');
  search.classList.add('info-block__search');
  const searchTemplate = Handlebars.templates.productSearch;
  search.innerHTML = searchTemplate({searchText: searchText});
  return search;
}
