// https://youtu.be/0A-2BhEZiM4?list=PLNYkxOF6rcIDP0PqVaJxqNWwIgvoEPzJi&t=1538
// https://tur-nr.github.io/polymer-redux/

import { selectListing, ... } from './actions-listings.js';
import { changeFilter, ... } from './actions-map.js';

import { listings, ... } from './reducer-listings.js';
import { map, ... } from './reducer-map.js';

store.addReducers({listings, map});

class ConnectedATimer extends ATimer {
  constructor() {
    super();
    store.subscribe(state => {
      this.setProperties({
        startTime: state.startTime,
        run: state.run,
        resetProp: state.resetProp,
        currentTime: state.currentTime,
        lastCurrentTime: state.lastCurrentTime,
        refreshRate: state.refreshRate,
        finished: state.finished,
        // listings: state.listings.items,
        // mapBounds: state.map.bounds,
        // selected: state.listings.selected,
      });
    });

    this.addEventListener('finish', e => {
      store.dispatch(timerFinished(e.detail))
    });
    // this.addEventListener('select-listing', e => {
    //   store.dispatch(selectListing(e.detail))
    // });

    }
} 