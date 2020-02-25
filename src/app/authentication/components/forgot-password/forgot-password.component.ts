import { Component, OnInit } from '@angular/core';
import * as globals from '../../../globals';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  logo = globals.logo;
  constructor() { }

  ngOnInit() {
  }

}
