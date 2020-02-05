import { Component } from '@angular/core';
import Amplify, { Auth } from 'aws-amplify';
import { environment } from '../environments/environment';
Amplify.configure(environment.Amplify);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // title = 'lucyfrontend';
}
