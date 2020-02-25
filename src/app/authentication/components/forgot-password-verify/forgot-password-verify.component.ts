import { Component, OnInit } from '@angular/core';
import * as globals from '../../../globals';
@Component({
  selector: 'app-forgot-password-verify',
  templateUrl: './forgot-password-verify.component.html',
  styleUrls: ['./forgot-password-verify.component.scss']
})
export class ForgotPasswordVerifyComponent implements OnInit {
  logo = globals.logo;
  constructor() { }

  ngOnInit() {
  }

}
