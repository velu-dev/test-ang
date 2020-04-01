import { createAction } from '@ngrx/store';
import { Action } from '@ngrx/store';

export enum HeaderActions {
    LIST_HEADER = "[Header] List",
    ADD_HEADER = "[Header] Add"
}
export class HeaderList implements Action {
    readonly type = HeaderActions.LIST_HEADER
    constructor() {
    }
}
export class HeaderAdd implements Action {
    readonly type = HeaderActions.ADD_HEADER;
    constructor(public payload: any) {
    }
}