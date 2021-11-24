import { templateFunc } from '../../types';
import newImageT from './image.handlebars';

/**
 * Шаблон нового объявления
 * @return {*}
 */
export function newImage(): templateFunc {
  return <templateFunc>newImageT;
}
