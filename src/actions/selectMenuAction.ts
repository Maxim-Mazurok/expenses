import { SELECT_MENU } from "./index";
import { SelectedMenuIndex } from "../types/GlobalState";

export const selectMenuAction = (index: SelectedMenuIndex): SelectMenuAction => ({
  type: SELECT_MENU,
  payload: index,
});

export interface SelectMenuAction {
  type: typeof SELECT_MENU,
  payload: SelectedMenuIndex,
}
