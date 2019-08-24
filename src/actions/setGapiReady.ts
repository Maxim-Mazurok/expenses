import { GapiReady } from '../types/GlobalState';

export const SET_GAPI_READY = 'setGapiReady';

export const setGapiReady = (isGapiReady: GapiReady): SetGapiReady => ({
  type: SET_GAPI_READY,
  payload: isGapiReady,
});

export interface SetGapiReady {
  type: typeof SET_GAPI_READY,
  payload: GapiReady,
}
