import { createStore, Reducer } from 'redux';
import menuReducer from './reducers/menu';
import GlobalState from './types/GlobalState';
import { Actions } from './actions';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { Menu } from './selectors';

function configureStore(state: GlobalState = {
  selectedMenuIndex: Menu.findIndex(menuItem => menuItem.url === window.location.pathname) || 0,
}) {
  return createStore(
    menuReducer as Reducer<GlobalState, Actions>,
    state as any,
    devToolsEnhancer({ trace: true }),
  );
}

export default configureStore;
