import { animate, state, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { SubscriberService } from '../../service/subscriber.service';

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
  dataSource: any //new MatTableDataSource(ELEMENT_DATA);
  columnsToDisplay = [];
  expandedElement;
  isMobile = false;
  columnName = [];
  filterValue: string;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  constructor(public router: Router, private logger: NGXLogger, private cookieService: CookieService, private breakpointObserver: BreakpointObserver, private subscriberService: SubscriberService) {
    this.subscriberService.getDashboardData().subscribe(res => {
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Claimant", "Action"]
        this.columnsToDisplay = ['is_expand', 'claimant_name', "disabled"]
      } else {
        this.columnName = ["", "Claimant", "Examiner", "Exam Procedure Type", "Standing", "Date of Service / Date of Item Received", "Critical"]
        this.columnsToDisplay = ['is_expand', 'claimant_name', 'examiner_name', "exam_procedure_type", "standing", 'date_of_service', 'critical']
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
    this.expandId = element.appointment_id;
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
  {
    "appointment_id": 74,
    "claimant_first_name": "KIMBERLY",
    "claimant_last_name": "LAGOW",
    "claimant_middle_name": "P",
    "examiner_first_name": "Christopher",
    "examiner_last_name": "Chow",
    "examiner_middle_name": "",
    "exam_procedure_type": "PsyUQMER",
    "exam_procedure_name": "Psychological Unrepresented QME Re-Evaluation",
    "standing": "",
    "date_of_service": "2020-11-26"
  },
  {
    "appointment_id": 162,
    "claimant_first_name": "KIMBERLY",
    "claimant_last_name": "LAGOW",
    "claimant_middle_name": "P",
    "examiner_first_name": null,
    "examiner_last_name": null,
    "examiner_middle_name": null,
    "exam_procedure_type": "UQME",
    "exam_procedure_name": "Unrepresented QME",
    "standing": "",
    "date_of_service": "2020-09-03"
  },
  {
    "appointment_id": 306,
    "claimant_first_name": "KIMBERLY",
    "claimant_last_name": "LAGOW",
    "claimant_middle_name": "P",
    "examiner_first_name": "Christopher",
    "examiner_last_name": "Chow",
    "examiner_middle_name": "",
    "exam_procedure_type": "PsyIMESUPP",
    "exam_procedure_name": "Psychological IME Supplemental",
    "standing": "Call back to Schedule",
    "date_of_service": "2020-10-31"
  }]