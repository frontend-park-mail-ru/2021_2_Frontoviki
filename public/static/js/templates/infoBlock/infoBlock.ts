import productPathT from './productPath.handlebars';
import productSearchT from './productSearch.handlebars';
import navigateBackT from './navigation.handlebars';
import './info-block.sass';
import { templateFunc } from '../../types';


export function createInfoBlock(searchText: string | null, category : string | null) {
  const infoBlock = document.createElement('div');
  infoBlock.classList.add('root__info-block');
  const navigateContainer = document.createElement('div');
  navigateContainer.innerHTML = (<templateFunc>navigateBackT)({
    back: window.localizer.getLocaleItem('back'),
  });
  if (searchText !== null) {
    infoBlock.appendChild(navigateContainer);
    infoBlock.appendChild(createProductSearch(searchText));
  }
  if (category !== null) {
    infoBlock.appendChild(navigateContainer);
    infoBlock.appendChild(createProductPath(category));
  }
  return infoBlock;
}

function createProductPath(category : string): HTMLDivElement {
  const productClass = document.createElement('div');
  productClass.classList.add('info-block__left');
  productClass.classList.add('info-block__category');
  productClass.innerHTML = (<templateFunc>productPathT)({
    category: category,
    adsInCategory: window.localizer.getLocaleItem('adsInCategory'),
  });
  return productClass;
}

function createProductSearch(searchText : string): HTMLDivElement {
  const search = document.createElement('div');
  search.classList.add('info-block__left');
  search.classList.add('info-block__search');
  search.innerHTML = (<templateFunc>productSearchT)({
    searchText: searchText,
    searchHelp: window.localizer.getLocaleItem('searchHelp'),
  });
  return search;
}
