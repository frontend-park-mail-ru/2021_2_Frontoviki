import infoBlockT from './profileInfoBlock.handlebars';
import './profile.sass';
import { userInfo } from '../../constatns';
import { templateFunc } from '../../types';
/**
 * Создает левую часть страницы профиля из шаблона
 * @return {HTMLDivElement}
 */
export function profileInfoBlock() : HTMLDivElement {
  const infoBlock = document.createElement('div');
  infoBlock.classList.add('root__profile-content');
  infoBlock.classList.add('profile-content');
  const StarAlgorithym = [true, true, true, true, true];
  infoBlock.innerHTML = (<templateFunc>infoBlockT)({
    profile: window.localizer.getLocaleItem('profile'),
    myAdverts: window.localizer.getLocaleItem('myAdverts'),
    favorite: window.localizer.getLocaleItem('favorite'),
    cart: window.localizer.getLocaleItem('cart'),
    messages: window.localizer.getLocaleItem('messages'),
    paid: window.localizer.getLocaleItem('paid'),
    settings: window.localizer.getLocaleItem('settings'),
    userName: <string>userInfo.get('name'),
    userAvatar: <string>userInfo.get('image'),
    format: '.' + (<string>userInfo.get('image')).split('__')[1],
    star: StarAlgorithym.
            slice(0, Math.round(<number>(userInfo.get('rating')))),
    emptyStar: StarAlgorithym.
            slice(Math.round(<number>(userInfo.get('rating'))), 6),
      });
  return infoBlock;
}
