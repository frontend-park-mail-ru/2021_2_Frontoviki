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
export function createProductPath(productPath) {
  const productClass = document.createElement('div');
  productClass.classList.add('product-path');
  const productClassTemplate = Handlebars.templates.productPath;
  productClass.innerHTML = productClassTemplate(productPath);
  return productClass;
};
