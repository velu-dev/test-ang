import { Component, OnInit } from '@angular/core';
import * as globals from '../../../globals';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  profile_bg = globals.profile_bg;
  constructor() { }

  ngOnInit() {
  }

}
