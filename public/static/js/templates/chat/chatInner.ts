import { templateFunc } from '../../types';
import chatAdvT from './chatAdvBlock.handlebars';

export function createAdvBlock(title: string, location: string, price: string, image: string, href: string): HTMLDivElement {
    const chatDiv = document.createElement('div');
    chatDiv.classList.add('chat_order');
    chatDiv.innerHTML = (<templateFunc> chatAdvT)({
        title: title,
        location: location,
        price: price,
        image: image,
        href: href
    });
    return chatDiv;
}