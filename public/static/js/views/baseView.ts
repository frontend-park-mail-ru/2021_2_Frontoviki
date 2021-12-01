import '../../css/layout.sass';
import '../../css/variables.sass';
import Bus from '../modules/EventBus';
import '../templates/button/button.sass';
import '../templates/input/input.sass';
import '../templates/mainBtnWrapper/btn-wrapper.sass';
/**
 * Base view class, each view must extends it
 */
export default class BaseView {
  eventBus: Bus
  root : HTMLDivElement

  /**
     * Base view constructor
  */
  constructor(eventBus : Bus) {
    this.eventBus = eventBus;
    const docRoot = document.getElementById('root') as HTMLDivElement;
    this.root = docRoot;
  }
}
