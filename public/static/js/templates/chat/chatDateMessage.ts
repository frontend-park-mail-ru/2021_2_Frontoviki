import { properDate } from '../../modules/utilsFunctions';
import { templateFunc } from '../../types';
import chatTimeBlock from './chatDayStamp.handlebars';

export function createChatTime(sendTime:string): HTMLDivElement {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat_history_element');
    messageDiv.innerHTML = (<templateFunc>chatTimeBlock)({time:properDate(sendTime)})
    return messageDiv;
}