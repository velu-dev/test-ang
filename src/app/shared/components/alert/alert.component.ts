import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {

    let config = new MatSnackBarConfig();
    let horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    let verticalPosition: MatSnackBarVerticalPosition = 'top';
    config.verticalPosition = verticalPosition;
    config.horizontalPosition = horizontalPosition;
  }
}
