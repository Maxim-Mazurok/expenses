import { Profile } from '../types/GlobalState';

export const SET_PROFILE = 'setProfile';

export const setProfile = (profile: Profile): SetProfile => ({
  type: SET_PROFILE,
  payload: profile,
});

export interface SetProfile {
  type: typeof SET_PROFILE,
  payload: Profile,
}
