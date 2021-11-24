import { templateFunc } from '../../types';
import headerT from './header.handlebars';
import './header.sass';
import './mobile-search.sass';

export function createHeader(): templateFunc {
  return <templateFunc>headerT;
}

