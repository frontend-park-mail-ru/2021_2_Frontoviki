import paymentFormT from './paymentForm.handlebars';
import { templateFunc } from '../../types';

export function createPayment(): templateFunc {
    return <templateFunc>paymentFormT;
  }