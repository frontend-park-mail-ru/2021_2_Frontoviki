import productPathT from './productPath.handlebars';
import productSearchT from './productSearch.handlebars';
import navigateBackT from './navigation.handlebars';
import './info-block.sass';


export function createInfoBlock(searchText = null, category = null) {
  const infoBlock = document.createElement('div');
  infoBlock.classList.add('root__info-block');
  const navigateContainer = document.createElement('div');
  navigateContainer.innerHTML = navigateBackT();
  if (searchText !== null || category !== null) {
    infoBlock.appendChild(navigateContainer);
    if (searchText !== null) {
      infoBlock.appendChild(createProductSearch(searchText));
    }
    if (category !== null) {
      infoBlock.appendChild(createProductPath(category));
    }
  }
  return infoBlock;
}

function createProductPath(category : string): HTMLDivElement {
  const productClass = document.createElement('div');
  productClass.classList.add('info-block__left');
  productClass.classList.add('info-block__category');
  productClass.innerHTML = productPathT({category: category});
  return productClass;
};

function createProductSearch(searchText : string): HTMLDivElement {
  const search = document.createElement('div');
  search.classList.add('info-block__left');
  search.classList.add('info-block__search');
  search.innerHTML = productSearchT({searchText: searchText});
  return search;
}
