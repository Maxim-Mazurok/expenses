import BasicProfile = gapi.auth2.BasicProfile;

export type SelectedMenuIndex = number;
export type ClientId = string;
export type SpreadSheetId = string;
export type GapiReady = boolean;
export type Profile = BasicProfile | undefined;
export type Account = string;
export type Category = string;

export default interface GlobalState {
  menu: {
    readonly selectedMenuIndex: SelectedMenuIndex,
  },
  settings: {
    readonly clientId: ClientId,
    readonly spreadSheetId: SpreadSheetId,
    readonly profile: Profile,
  },
  misc: {
    readonly isGapiReady: GapiReady,
  },
  data: {
    expenses: Expense[],
    categories: Category[],
    accounts: Account[],
  }
}
