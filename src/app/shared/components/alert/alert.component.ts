import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,private snackBar: MatSnackBar) { }

  ngOnInit() {
    if(this.data.message == null || typeof(this.data.message) != 'string'){
      this.data.message = 'Unknown error'
    }
  }

  close(){
   this.snackBar.dismiss()
  }
}