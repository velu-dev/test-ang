import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import * as headerAction from './header.actions';
export interface State {
  user: {}
}
const initialState: State = {
  user: {}
};
export function headerreducer(
  state_header = initialState,
  action: headerAction.HeaderActions
): State {
  switch (action['type']) {
    case headerAction.HeaderActions.LIST_HEADER: {
      return {
        ...state_header
      }
    }
    case headerAction.HeaderActions.ADD_HEADER: {
      console.log(state_header)
      return {
        ...state_header,
        user: action['payload']
      }
    }
  }
}
export const HeadersState = createFeatureSelector<State>('header');
export const getAllHeaders = createSelector(HeadersState, (state_header: State) => state_header);