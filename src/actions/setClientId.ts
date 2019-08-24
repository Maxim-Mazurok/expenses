import { ClientId } from '../types/GlobalState';

export const SET_CLIENT_ID = 'setClientId';

export const setClientId = (clientId: ClientId): SetClientId => ({
  type: SET_CLIENT_ID,
  payload: clientId,
});

export interface SetClientId {
  type: typeof SET_CLIENT_ID,
  payload: ClientId,
}
