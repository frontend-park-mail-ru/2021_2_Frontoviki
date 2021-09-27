/**
 * Функция генерирует из шаблона левый блок информации о пользователе
 * @param {string} name
 * @param {int} rating
 * @param {string} profilePic путь до аватарки
 * @return {HtmlDivELement}
 */
export function createProfileBlock(name, rating, profilePic) {
  const profileBlock = document.createElement('div');
  profileBlock.classList.add('profile-block');
  const profileBlockTemplate = Handlebars.templates.profileBlock;
  profileBlock.innerHTML = profileBlockTemplate({name, rating, profilePic});
  return profileBlock;
}
