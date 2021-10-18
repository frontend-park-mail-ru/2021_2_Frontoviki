/**
 * Создает левую часть страницы профиля из шаблона
 * @return {HTMLDivElement}
 */
export function profileInfoBlock() {
  const infoBlockTemplate = Handlebars.templates.profileInfoBlock;
  const infoBlock = document.createElement('div');
  infoBlock.classList.add('root__profile-content');
  infoBlock.classList.add('profile-content');
  infoBlock.innerHTML = infoBlockTemplate(
      {userName: localStorage.getItem('name'),
        userAvatar: localStorage.getItem('image'), star: [true, true, true]});
  return infoBlock;
}
