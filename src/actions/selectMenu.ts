import { SelectedMenuIndex } from '../types/GlobalState';

export const SELECT_MENU = 'selectMenu';

export const selectMenu = (index: SelectedMenuIndex): SelectMenu => ({
  type: SELECT_MENU,
  payload: index,
});

export interface SelectMenu {
  type: typeof SELECT_MENU,
  payload: SelectedMenuIndex,
}
