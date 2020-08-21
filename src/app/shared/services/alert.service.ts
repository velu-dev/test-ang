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
                message = message + "!"
            }
        this.snackBar.openFromComponent(AlertComponent, {
            duration: 6 * 1000,
            data: { message: message, action: action },
            panelClass: action,
            verticalPosition: 'top', // 'top' | 'bottom'
            horizontalPosition: 'center' //'start' | 'center' | 'end' | 'left' | 'right'
        });
    }
}