import infoBlockT from './profileInfoBlock.handlebars';
import './profile.sass';
/**
 * Создает левую часть страницы профиля из шаблона
 * @return {HTMLDivElement}
 */
export function profileInfoBlock() {
  const infoBlock = document.createElement('div');
  infoBlock.classList.add('root__profile-content');
  infoBlock.classList.add('profile-content');
  const StarAlgorithym = [true, true, true, true, true];
  infoBlock.innerHTML = infoBlockT(
      {userName: localStorage.getItem('name'),
        userAvatar: localStorage.getItem('image'),
        star: StarAlgorithym.
            slice(0, Math.round(Number(localStorage.getItem('rating')))),
        emptyStar: StarAlgorithym.
            slice(Math.round(Number(localStorage.getItem('rating')), 6)),
      });
  return infoBlock;
}
