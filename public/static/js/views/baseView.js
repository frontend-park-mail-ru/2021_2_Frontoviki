import '../../css/expand-menu.css';
import '../../css/layout.css';
import '../../css/variables.css';
import '../templates/button/button.css';
import '../templates/input/input.css';
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
