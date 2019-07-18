import GlobalState, { SelectedMenuIndex } from "./types/GlobalState";

export type MenuItem = {
  url: string,
  icon: string,
  text: string
}

export type Menu = MenuItem[]

export const Menu = [
  {
    url: '/',
    icon: "dashboard",
    text: "Dashboard"
  },
  {
    url: '/charts',
    icon: "pie_chart",
    text: "Charts"
  },
  {
    url: '/settings',
    icon: "settings",
    text: "Settings"
  }
];

export const getSelectedMenuIndex = (state: GlobalState): SelectedMenuIndex => state.selectedMenuIndex;
export const getSelectedMenuTitle = (state: GlobalState): MenuItem['text'] => Menu[state.selectedMenuIndex].text;
