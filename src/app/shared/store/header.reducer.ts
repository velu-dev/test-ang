import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import * as headerAction from './header.actions';
export interface State {
  user: {}
}
const initialState: State = {
  user: {}
};
export function headerreducer(
  state = initialState,
  action: headerAction.HeaderActions
): State {
  switch (action['type']) {
    case headerAction.HeaderActions.LIST_HEADER: {
      return {
        ...state
      }
    }
    case headerAction.HeaderActions.ADD_HEADER: {
      return {
        user: action['payload']
      }
    }
  }
}
export const HeadersState = createFeatureSelector<State>('header');
export const getAllHeaders = createSelector(HeadersState, (state: State) => state);