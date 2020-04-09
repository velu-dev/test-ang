import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import * as breadcrumActions from './breadcrumb.actions';
export interface State {
  menu: any[],
  // active_menu: "",
  active_title: "Dashboard"
}
const initialState: State = {
  menu: [],
  // active_menu: "",
  active_title: "Dashboard"
};
export function breadcrumbreducer(
  state = initialState,
  action: breadcrumActions.BreadcrumActions
): State {
  // console.log(state, action)
  switch (action['type']) {
    case breadcrumActions.BreadcrumActions.LIST: {
      console.log("log state", state)
      return {
        ...state
      }
    }
    case breadcrumActions.BreadcrumActions.ADD: {
      return {
        ...state,
        menu: action['payload'],
        active_title: action['payload'][action['payload'].length - 1].title
      }
    }
    case breadcrumActions.BreadcrumActions.REMOVE: {
      const menu = state.menu.filter((menu, i) => i <= Number(action['payload'].index))
      return {
        ...state,
        menu: menu
      }
    }
    case breadcrumActions.BreadcrumActions.RESET: {
      return {
        ...state,
        menu: initialState.menu
      }
    }

  }
}
export const BreadcrumbsState = createFeatureSelector<State>('breadcrumb');
export const getAllBreadcrumbs = createSelector(BreadcrumbsState, (state: State) => state);