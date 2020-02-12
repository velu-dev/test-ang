import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-user-verification',
  templateUrl: './user-verification.component.html',
  styleUrls: ['./user-verification.component.scss']
})
export class UserVerificationComponent implements OnInit {
  verificationForm: FormGroup;
  isSubmitted = false;
  constructor(private formBuilder: FormBuilder, private cognitoService: CognitoService, private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.verificationForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      code: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(6)])]
    });
  }
  get formControls() { return this.verificationForm.controls; }

  verifySubmit() {
    console.log(this.verificationForm)
    if (this.verificationForm.invalid) {
      return;
    }
    this.cognitoService.signUpVerification(this.verificationForm.value.email, this.verificationForm.value.code).subscribe(signUpVerify => {
      console.log("signUpVerify", signUpVerify);
      if (signUpVerify == 'SUCCESS') {
        this.authenticationService.signUpVerify(this.verificationForm.value.email).subscribe(res => {
          this.router.navigate(['/login'])
        },
          error => {
            console.log("Error", error)
          })

      }

    })
  }

}
