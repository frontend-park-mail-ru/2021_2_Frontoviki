import { templateFunc } from '../../types';
import chatMessageT from './chatMessage.handlebars';

export function createChatMessage(message: string, sendTime:string): HTMLDivElement {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('user-message');
    messageDiv.innerHTML = (<templateFunc>chatMessageT)({text: message, time:sendTime})
    return messageDiv;
}