import { createAction } from '@ngrx/store';
import { Action } from '@ngrx/store';

export enum BreadcrumActions {
    LIST = "[Breadcrumb] List",
    ADD = "[BreadCrumb] Add",
    REMOVE = "[BreadCrumb] Remove",
    RESET = "[BreadCrumb] Reset"
}
export class ListBreadcrumb implements Action {
    readonly type = BreadcrumActions.LIST
    constructor() {
    }
}
export class AddBreadcrumb implements Action {
    readonly type = BreadcrumActions.ADD;
    constructor(public payload: any) {
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