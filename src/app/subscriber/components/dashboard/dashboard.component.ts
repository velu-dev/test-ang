import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { CookieService } from 'src/app/shared/services/cookie.service';


export interface PeriodicElement {
  claimant: string;
  examiner: string;
  exam_procedure_type: string;
  standing: string;
  dos: string;
  critical: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class DashboardComponent implements OnInit {
  role: any;
  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['Claimant', 'Examiner', 'Exam Procedure Type', 'Standing', 'Date of Service / Date of Item Received', 'Critical'];
  expandedElement: PeriodicElement | null;

  constructor(public router: Router, private logger: NGXLogger, private cookieService: CookieService) {

  }

  ngOnInit() {
    this.role = this.cookieService.get('role_id')
    switch (this.role) {
      case '1':
        this.router.navigate(["/admin"]);
        break;
      case '2':
        this.router.navigate(["/subscriber"]);
        break;
      case '3':
        this.router.navigate(["/subscriber/manager"]);
        break;
      case '4':
        this.router.navigate(["/subscriber/staff"]);
        break;
      case '11':
        this.router.navigate(["/subscriber/examiner"]);
        break;
    }
  }
  navigate(menu) {
    this.router.navigate([this.router.url + menu])
  }
  openMenu(menu) {
    if (menu == 'intake') {
      this.router.navigate(['subscriber/new-intake'])
    }
  }
}


const ELEMENT_DATA: PeriodicElement[] = [
  // {
  //   claimant: '1',
  //   examiner: 'Hydrogen',
  //   exam_procedure_type: '1.0079',
  //   standing: 'H',
  //   dos: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
  //       atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`,
  //   critical: ''
  // },
];