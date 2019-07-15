export type SelectedMenuIndex = number | undefined;

export default interface GlobalState {
  readonly selectedMenuIndex: SelectedMenuIndex,
}
