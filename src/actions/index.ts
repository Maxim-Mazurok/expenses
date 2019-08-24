import { SelectMenuAction } from './selectMenuAction';
import { action } from 'typesafe-actions';
import { SelectedMenuIndex } from '../types/GlobalState';

export const SELECT_MENU = 'selectMenuAction';

export type Actions = SelectMenuAction;

export const selectMenu = (index: SelectedMenuIndex) => action(SELECT_MENU, index);
