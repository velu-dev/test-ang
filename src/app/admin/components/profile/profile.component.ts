import { Component, OnInit } from '@angular/core';
import * as globals from '../../../globals';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  no_data = globals.no_data
  constructor() { }

  ngOnInit() {
  }

}
