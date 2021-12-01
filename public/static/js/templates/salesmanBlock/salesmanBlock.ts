import { templateFunc } from '../../types';
import salesmanT from './salesmanBlock.handlebars';

/**
 * пробрасывает шаблон
 * @return {*} шаблон профиля продавца
 */
export function createSalesman(): templateFunc {
  return<templateFunc>salesmanT;
}
