import { Component, OnInit, ɵbypassSanitizationTrustHtml } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {

  }

  login() {
    let auth = { username: "velu", password: "Velu@123" }
    this.authenticationService.logIn(auth).subscribe(response => {
      console.log(response.signInUserSession.idToken.jwtToken)
    })
  }

  signup() {
    let userDetails = {
      'username': 'velu',
      'password': 'Velu@123',
      'attributes': {
        'email': 'velusamy.v@auriss.com',
        'name': 'velu',
        'middle_name': 'v',
        'custom:isAdmin': "0",
        'custom:Organization_ID': "1",
        'custom:Postgres_UserID': "2"
      }
    }
    this.authenticationService.signUp(userDetails).subscribe(signUpRes => {
      console.log(signUpRes);

    })
  }

  signupVerify() {
    this.authenticationService.signUpVerification('velu', '970936').subscribe(verifydata => {
      console.log(verifydata)
    })
  }

}
