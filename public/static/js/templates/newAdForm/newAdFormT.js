import newAdFormT from './newAdForm.handlebars';
import './new_advert.sass';
import './radio_button.sass';
import './textarea.sass';
import './select.sass';
import './image_uploader.sass';

/**
 * Пробрасывает шаблон во вьюху
 * @return {string} шаблон формы нового объявления
 */
export function createNewAdForm() {
  return newAdFormT;
}
