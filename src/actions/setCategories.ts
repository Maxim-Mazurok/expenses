import { Category } from '../types/GlobalState';

export const SET_CATEGORIES = 'setCategories';

export const setCategories = (categories: Category[]): SetCategories => ({
  type: SET_CATEGORIES,
  payload: categories,
});

export interface SetCategories {
  type: typeof SET_CATEGORIES,
  payload: Category[],
}
