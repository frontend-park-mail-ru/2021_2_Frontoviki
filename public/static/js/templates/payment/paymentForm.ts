import paymentFormT from './paymentForm.handlebars';
import promotionContainerT from './promotionContainer.handlebars';
import './payment.sass'
import { templateFunc } from '../../types';

export function createPayment(): templateFunc {
    return <templateFunc>paymentFormT;
}

export function createPromotionContainer(): templateFunc {
    return <templateFunc>promotionContainerT;
}