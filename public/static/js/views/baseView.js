import '../../css/expand-menu.sass';
import '../../css/layout.sass';
import '../../css/variables.sass';
import '../templates/button/button.sass';
import '../templates/input/input.sass';
/**
 * Base view class, each view must extends it
 */
export default class BaseView {
  /**
     * Base view constructor
     * @param {object} eventBus - local event bus
     */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.root = document.getElementById('root');
    this.inputtedData = {};
  }
}
