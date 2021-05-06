import {FILTER} from '../const.js';
import Observer from '../utils/observer.js';

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = FILTER.ALL_MOVIES;
  }

  set(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  get() {
    return this._activeFilter;
  }
}
