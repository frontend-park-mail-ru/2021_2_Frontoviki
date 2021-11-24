import infoBlockT from './profileInfoBlock.handlebars';
import './profile.sass';
import { userInfo } from '../../constatns';
/**
 * Создает левую часть страницы профиля из шаблона
 * @return {HTMLDivElement}
 */
export function profileInfoBlock() : HTMLDivElement {
  const infoBlock = document.createElement('div');
  infoBlock.classList.add('root__profile-content');
  infoBlock.classList.add('profile-content');
  const StarAlgorithym = [true, true, true, true, true];
  infoBlock.innerHTML = infoBlockT(
      {userName: userInfo.get('name'),
        userAvatar: userInfo.get('image'),
        star: StarAlgorithym.
            slice(0, Math.round(Number(userInfo.get('rating')))),
        emptyStar: StarAlgorithym.
            slice(Math.round(Number(userInfo.get('rating'))), 6),
      });
  return infoBlock;
}
