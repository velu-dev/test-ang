import { createAction } from '@ngrx/store';
import { Action } from '@ngrx/store';

export const increment = createAction('[Counter Component] Increment');
export const decrement = createAction('[Counter Component] Decrement');
export const reset = createAction('[Counter Component] Reset');

export enum BreadcrumActions {
    LIST = "[Breadcrumb] List",
    ADD = "[BreadCrumb] Add",
    REMOVE = "[BreadCrumb] Remove",
    RESET = "[BreadCrumb] Reset"
}
export class ListBreadcrumb implements Action {
    readonly type = BreadcrumActions.LIST
    constructor() {
        // console.log("from action")/
    }
}
export class AddBreadcrumb implements Action {
    readonly type = BreadcrumActions.ADD;
    constructor(public payload: any) {
        // console.log("from action add", payload)
    }
}
export class RemoveBreadcrumb implements Action {
    readonly type = BreadcrumActions.REMOVE;
    constructor(public payload: any){
        
    }
}
export class ResetBreadcrumb implements Action {
    readonly type = BreadcrumActions.RESET;
}
// export type Action =
//     | AddBreadcrumb
//     | RemoveBreadcrumb
//     | ResetBreadcrumb;