import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ExaminerService } from 'src/app/subscriber/service/examiner.service';
import { Location } from '@angular/common';
import { saveAs } from 'file-saver';
import { AlertService } from 'src/app/shared/services/alert.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-upcomming-billable-item',
  templateUrl: './upcomming-billable-item.component.html',
  styleUrls: ['./upcomming-billable-item.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UpcommingBillableItemComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  upcomingAppointment: any = new MatTableDataSource([])
  columnsToDisplay = [];
  expandedElement;
  isMobile = false;
  columnName = [];
  filterValue: string;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(public router: Router, private breakpointObserver: BreakpointObserver, private examinerService: ExaminerService,
    private alertService: AlertService,
    private _location: Location) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Claimant", "Action"]
        this.columnsToDisplay = ['is_expand', 'claimant', "disabled"]
      } else {
        this.columnName = ["Claimant", "Exam Procedure Type", "Location", "Date of service / Date Item Received", "History", "Records", 'Icon']
        this.columnsToDisplay = ['claimant', 'type', "location", "dos", 'history_on_demand', 'records_on_demand', 'icon']
      }
    })
  }

  ngOnInit() {

    this.examinerService.getUpcomingAppointment().subscribe(res => {
      res.data.map(data => {
        data.claimant = data.last_name + ' ' + data.first_name;
        data.type = data.exam_type_code + ' - ' + (data.procedure_type == 'Evaluation' || data.procedure_type == 'Reevaluation' ? 'Examination' : data.procedure_type);
        data.dos = data.date_of_service ? moment(data.date_of_service, 'MM-dd-yyyy') : '';
      })
      console.log(res.data)
      this.upcomingAppointment = new MatTableDataSource(res.data);
      this.upcomingAppointment.paginator = this.paginator;
      this.upcomingAppointment.sort = this.sort;
    }, error => {
      this.upcomingAppointment = new MatTableDataSource([])
    })
  }
  expandId: any = null;
  openElement(element) {
    if (this.isMobile) {
      if (this.expandId && this.expandId == element) {
        this.expandId = null;
      } else {
        this.expandId = element;
      }
    } else {
      this.router.navigate(['subscriber/claimants/claimant/' + element.claimant_id + '/claim/' + element.claim_id + '/billable-item/' + element.bill_id])
    }
  }
  applyFilter(filterValue: string) {
    this.upcomingAppointment.filter = filterValue.trim().toLowerCase();
    if (this.upcomingAppointment.paginator) {
      this.upcomingAppointment.paginator.firstPage();
    }
  }

  back() {
    this._location.back();
  }

  downloadDocumet(element) {
    this.examinerService.downloadOndemandDocuments({ file_url: element.file_url }).subscribe(res => {
      this.alertService.openSnackBar("File downloaded successfully", "success");
      saveAs(res.signed_file_url, element.file_name);
    })
  }

}
