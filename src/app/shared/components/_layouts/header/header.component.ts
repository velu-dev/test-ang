import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // @ViewChild('sidenav', { static: false }) public sidenav: MatSidenav;
  @Input() inputSideNav: MatSidenav;


  constructor() { }

  ngOnInit() {
  }
  openSidenav() {
    this.inputSideNav.toggle();
  }
}
