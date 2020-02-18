import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import * as breadcrumActions from './breadcrumb.actions';
export interface State {
  menu: any[]
}
const initialState: State = {
  menu: []
};
export function breadcrumbreducer(
  state = initialState,
  action: breadcrumActions.BreadcrumActions
): State {
  // console.log(state, action)
  switch (action['type']) {
    case breadcrumActions.BreadcrumActions.LIST: {
      return {
        ...state
      }
    }
    case breadcrumActions.BreadcrumActions.ADD: {
      console.log(state)
      return {
        ...state,
        menu: [...state.menu, action['payload']]
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
      console.log(state)
      return {
        ...state,
        menu: initialState.menu
      }
    }

  }
}
export const BreadcrumbsState = createFeatureSelector<State>('breadcrumb');
export const getAllBreadcrumbs = createSelector(BreadcrumbsState, (state: State) => state);