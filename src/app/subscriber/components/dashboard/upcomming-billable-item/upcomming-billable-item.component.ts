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
import { CookieService } from 'src/app/shared/services/cookie.service';
import { IntercomService } from 'src/app/services/intercom.service';
import { MatDialog } from '@angular/material/dialog';
import { RegulationDialogueComponent } from 'src/app/shared/components/regulation-dialogue/regulation-dialogue.component';
import { UserService } from 'src/app/shared/services/user.service';
import * as regulation from 'src/app/shared/services/regulations';
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
  regulation = regulation;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(public router: Router, private breakpointObserver: BreakpointObserver, private examinerService: ExaminerService,
    private alertService: AlertService,
    private _location: Location, private cookieService: CookieService, private intercom: IntercomService,
    public dialog: MatDialog, private userService: UserService) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Claimant"]
        this.columnsToDisplay = ['is_expand', 'claimant']
      } else {
        this.columnName = ["Claimant", "Date of Birth", "Exam Procedure Type", "Location", "Date of service / Date Item Received", "History", "Records", 'Icon']
        this.columnsToDisplay = ['claimant', 'date_of_birth', 'type', "location", "dos", 'history_on_demand', 'records_on_demand', 'icon']
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
  openElement1(element) {
    this.intercom.setClaimant(element.first_name + ' ' + element.last_name);
    this.cookieService.set('claimDetails', element.first_name + ' ' + element.last_name)
    this.intercom.setBillableItem(element.exam_procedure_name);
    this.cookieService.set('billableItem', element.exam_procedure_name)//response.data.exam_procedure_name
    // this.router.navigate(['subscriber/examiner/upcomming-billable-item/' + 'billable-item/' + element.claim_id + '/' + element.claimant_id + "/" + element.billable_item_id])
    this.router.navigate(['subscriber/examiner/upcomming-billable-item/' + "claimants/claimant/" + element.claimant_id + "/claim/" + element.claim_id + "/billable-item/" + element.billable_item_id]);
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
      this.intercom.setClaimant(element.first_name + ' ' + element.last_name);
      this.cookieService.set('claimDetails', element.first_name + ' ' + element.last_name)
      this.intercom.setBillableItem(element.exam_procedure_name);
      this.cookieService.set('billableItem', element.exam_procedure_name)
      // this.router.navigate(['subscriber/examiner/upcomming-billable-item/' + 'billable-item/' + element.claim_id + '/' + element.claimant_id + "/" + element.billable_item_id])
      this.router.navigate(['subscriber/examiner/upcomming-billable-item/' + "claimants/claimant/" + element.claimant_id + "/claim/" + element.claim_id + "/billable-item/" + element.billable_item_id]);
    }
  }
  openPopup(title, value) {
    let data = this.userService.getRegulation(value)
    const dialogRef = this.dialog.open(RegulationDialogueComponent, {
      width: '1000px',
      data: { title: title, regulations: data },
      panelClass: 'info-regulation-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
    })
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
