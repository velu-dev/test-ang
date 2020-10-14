import { animate, state, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
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
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  dataSource = ELEMENT_DATA;
  columnsToDisplay = [];
  expandedElement;
  isMobile = false;
  columnName = [];
  filterValue: string;

  constructor(public router: Router, private logger: NGXLogger, private cookieService: CookieService, private breakpointObserver: BreakpointObserver) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Claimant", "Action"]
        this.columnsToDisplay = ['is_expand', 'claimant_name', "disabled"]
      } else {
        this.columnName = ["Claimant", "Procedure Type", "Examiner", "Date of service / Date Item Received", "Bill Date", "Status"]
        this.columnsToDisplay = ['claimant_name', 'procedure_type', "examiner", "dos", 'bill_date', 'status']
      }
    })
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

  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
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


const ELEMENT_DATA = [
  { "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "procedure_type": "Examination", "ex_lastname": "Jorge", "ex_firstname": "Sanchez", "ex_suffix": "M.D.", "dos": "12-10-2020", "bill_date": "10-25-2020", "status": "Not Sent", },
  { "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "procedure_type": "Examination", "ex_lastname": "Jorge", "ex_firstname": "Sanchez", "ex_suffix": "M.D.", "dos": "12-10-2020", "bill_date": "10-25-2020", "status": "Accepted" },
  { "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "procedure_type": "Examination", "ex_lastname": "Jorge", "ex_firstname": "Sanchez", "ex_suffix": "M.D.", "dos": "12-10-2020", "bill_date": "10-25-2020", "status": "Sent" },
  { "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "procedure_type": "Examination", "ex_lastname": "Jorge", "ex_firstname": "Sanchez", "ex_suffix": "M.D.", "dos": "12-10-2020", "bill_date": "10-25-2020", "status": "Not Sent" },
  { "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "procedure_type": "Examination", "ex_lastname": "Jorge", "ex_firstname": "Sanchez", "ex_suffix": "M.D.", "dos": "12-10-2020", "bill_date": "10-25-2020", "status": "Accepted" },
  { "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "procedure_type": "Examination", "ex_lastname": "Jorge", "ex_firstname": "Sanchez", "ex_suffix": "M.D.", "dos": "12-10-2020", "bill_date": "10-25-2020", "status": "Not Sent" },

];