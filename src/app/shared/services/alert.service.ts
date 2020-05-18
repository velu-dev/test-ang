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
        if (message)
            if (!message.includes("!")) {
                message + "!"
            }
        this.snackBar.openFromComponent(AlertComponent, {
            duration: 2 * 1000,
            data: { message: message, action: action },
            panelClass: action,
            verticalPosition: 'top',
            horizontalPosition: 'end'
        });
    }
}