import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import * as moment from 'moment';
import { ExaminerService } from 'src/app/subscriber/service/examiner.service';
import { Location } from '@angular/common';
import { IntercomService } from 'src/app/services/intercom.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { saveAs } from 'file-saver';
import { AlertDialogueComponent } from 'src/app/shared/components/alert-dialogue/alert-dialogue.component';
@Component({
  selector: 'app-billable-item-awaiting',
  templateUrl: './billable-item-awaiting.component.html',
  styleUrls: ['./billable-item-awaiting.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BillableItemAwaitingComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  dataSource: any;
  columnsToDisplay = [];
  expandedElement;
  isMobile = false;
  columnName = [];
  filterValue: string;
  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;
  constructor(private breakpointObserver: BreakpointObserver,
    private router: Router,
    private _location: Location,
    private examinerService: ExaminerService,
    public dialog: MatDialog,
    private cookieService: CookieService,
    private alertService: AlertService,
    private intercom: IntercomService) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Claimant"]
        this.columnsToDisplay = ['is_expand', 'claimant_name']
      } else {
        this.columnName = ["Claimant", "Exam Procedure Type", "Date Of Service / Date Item Received", "Date Due", "Report SimpleService", "Status", "Compiled Report", "Upload Final Report", "Icon"]
        this.columnsToDisplay = ['claimant_name', 'procedure_type', "dos", "due_date", "report", "status", "compiled_report", "final_report", "icon"]
      }
    })
  }

  ngOnInit() {
    this.examinerService.getItemsAwaiting().subscribe(billable => {
      // billable.data.map(bill => {
      //   bill.date_of_birth = bill.date_of_birth ? moment(bill.date_of_birth).format("MM-DD-YYYY") : '';
      //   bill.claimant_name = bill.claimant_last_name + ', ' + bill.claimant_first_name;
      //   bill.created_date = bill.createdAt ? moment(bill.createdAt).format("MM-DD-YYYY") : '';
      //   bill.created_time = bill.createdAt ? moment(bill.createdAt).format("hh:mm a") : '';
      //   bill.examiner = bill.ex_last_name + ' ' + bill.ex_first_name + '' + (bill.ex_suffix ? ', ' + bill.ex_suffix : '');
      //   bill.procedure_type = bill.procedure_type_name;
      // })
      // console.log(billable);
      this.dataSource = new MatTableDataSource(billable.data)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // this.dataSource.filterPredicate = function (data, filter: string): boolean {
      //   return data.claimant_name.toLowerCase().includes(filter) || (data.date_of_birth && data.date_of_birth.includes(filter)) || (data.claim_number && data.claim_number.includes(filter)) || (data.examiner && data.examiner.toLowerCase().includes(filter)) || (data.created_date && data.created_date.includes(filter)) || (data.created_time && data.created_time.toLowerCase().includes(filter)) || (data.procedure_type && data.procedure_type.toLowerCase().includes(filter));
      // };
      // this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
    }, error => {
      this.dataSource = new MatTableDataSource([])
    })
  }
  expandId: any;
  openElement(element) {
    if (this.isMobile)
      if (this.expandId && this.expandId == element) {
        this.expandId = null;
      } else {
        this.expandId = element;
      }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  navigateBillableEdit(e) {
    this.router.navigate([this.router.url + '/billable-item/edit-billable-item', e.claim_id, e.claimant_id, e.id])
  }

  back() {
    this._location.back();
  }
  selectedFile: File;
  formData = new FormData();
  errors = { file: { isError: false, error: "" } }
  uploadFile(element, e) {
    this.selectedFile = null;
    this.selectedFile = element.target.files[0];

    let fileTypes = ['pdf', 'doc', 'docx'];
    if (fileTypes.includes(this.selectedFile.name.split('.').pop().toLowerCase())) {
      var FileSize = this.selectedFile.size / 1024 / 1024; // in MB
      if (FileSize > 501) {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          data: { title: this.selectedFile.name, message: "File size is too large. Contact your organization's Simplexam Admin", yes: false, ok: true, no: false, type: "info", info: true }
        });
        dialogRef.afterClosed().subscribe(result => {
        })
        this.fileUpload.nativeElement.value = "";
        return;
      }
      this.errors = { file: { isError: false, error: "" } }
    } else {
      this.selectedFile = null;
      this.fileUpload.nativeElement.value = "";
      this.errors.file.isError = true;
      this.errors.file.error = "This file type is not accepted";
      this.alertService.openSnackBar("This file type is not accepted", 'error');
    }

    if (!this.selectedFile) {
      this.alertService.openSnackBar("Please select file", 'error');
      this.errors.file.isError = true;
      this.errors.file.error = "Please select a file";
      return;
    }
    this.formData = new FormData();
    this.formData.append('file', this.selectedFile);
    this.formData.append('document_category_id', '6');
    this.formData.append('claim_id', e.claim_id.toString());
    this.formData.append('bill_item_id', e.bill_item_id.toString());
    this.formData.append('isReportUpload', 'true');
    this.examinerService.postDocument(this.formData).subscribe(res => {
      this.selectedFile = null;
      this.fileUpload.nativeElement.value = "";
      this.formData = new FormData();
      this.errors = { file: { isError: false, error: "" } }
      this.alertService.openSnackBar("File added successfully", 'success');
    }, error => {
      this.fileUpload.nativeElement.value = "";
      this.selectedFile = null;
    })
  }

  goToReport(e) {
    this.intercom.setClaimant(e.first_name + ' ' + e.last_name);
    this.cookieService.set('claimDetails', e.first_name + ' ' + e.last_name)
    this.intercom.setClaimNumber(e.claim_number);
    this.cookieService.set('claimNumber', e.claim_number)
    this.intercom.setBillableItem(e.exam_procedure_name);
    this.cookieService.set('billableItem', e.exam_procedure_name)
    this.router.navigate([this.router.url + "/billable-item/" + e.claim_id + '/' + e.claimant_id + '/' + e.bill_item_id + '/reports'])
  }

  downloadDocumet(element) {
    this.examinerService.downloadOndemandDocuments({ file_url: element.compiled_report_file_url }).subscribe(res => {
      this.alertService.openSnackBar("File downloaded successfully", "success");
      saveAs(res.signed_file_url, element.compiled_report_file_name);
    })
  }

}