import { Injectable } from '@angular/core';
import { AlertComponent } from '../components/alert/alert.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor(private snackBar: MatSnackBar) {

    }
    async openSnackBar(message, action) {
        this.snackBar.openFromComponent(AlertComponent, {
            duration: 1 * 1000,
            data: { message: message, action: action },
            panelClass: action,
            verticalPosition: 'top',
            horizontalPosition: 'end'
        });
    }
}