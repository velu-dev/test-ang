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
        this.columnName = ["", "Claimant", "Examiner", "Exam Procedure Type", "Standing", "Date of Service / Date of Item Received", "Critical"]
        this.columnsToDisplay = ['is_expand','claimant_name', 'examiner_name', "exam_procedure_type", "standing", 'dos', 'critical']
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
    // if (this.isMobile) {
      this.expandId = element.id;
    // }
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
  { "id": 1, "claimant_name": "Sam, Toucan", "examiner_name": "Denzel Washington", "exam_procedure_type": "QME", "standing": "Correspondence Not Sent", "dos": "06-21-2020", "critical": "Critical", "correspondence": "Sent", "history": "Completed", "records": "Summarized", "examination":"06-30-2020", "report":"Something", "transcription":"Something", "billing":"Something"},
  { "id": 2, "claimant_name": "Tiger, Tony", "examiner_name": "Jessica Simpson", "exam_procedure_type": "QME", "standing": "Appointment Awaiting Date", "dos": "06-21-2020", "critical": "Critical", "correspondence": "Sent", "history": "Completed", "records": "Summarized", "examination":"06-30-2020", "report":"Something", "transcription":"Something", "billing":"Something"},
  { "id": 3, "claimant_name": "Chocula, Count", "examiner_name": "Jennifer Lopez", "exam_procedure_type": "QME", "standing": "Appointment 06-30-2020", "dos": "06-21-2020", "critical": "Critical", "correspondence": "Sent", "history": "Completed", "records": "Summarized", "examination":"06-30-2020", "report":"Something", "transcription":"Something", "billing":"Something"},
 // { "id": 132, "claimant_name": "Mariyappan", "examiner_name": "Venkatesan", "exam_procedure_type": "", "standing": "", "dos": "", "critical": "", "correspondence": "", "history": "", "records": "", "examination":"", "report":"", "transcription":"", "billing":""},
 
];