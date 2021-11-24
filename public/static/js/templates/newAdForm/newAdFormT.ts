import newAdFormT from './newAdForm.handlebars';
import './new_advert.sass';
import './radio_button.sass';
import './textarea.sass';
import './select.sass';
import './image_uploader.sass';
import { templateFunc } from '../../types';

/**
 * Пробрасывает шаблон во вьюху
 * @return {string} шаблон формы нового объявления
 */
export function createNewAdForm():templateFunc {
  return <templateFunc>newAdFormT;
}
