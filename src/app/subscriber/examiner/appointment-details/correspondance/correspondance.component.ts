import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatPaginator, MatSort, MatMenuTrigger } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map, subscribeOn, debounceTime } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Router, RouterState } from '@angular/router';
import { OnDemandService } from 'src/app/subscriber/service/on-demand.service';
import { DialogData } from 'src/app/shared/components/dialogue/dialogue.component';
import * as globals from '../../../../globals';
import { AlertService } from 'src/app/shared/services/alert.service';
import { saveAs } from 'file-saver';
import { formatDate } from '@fullcalendar/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { NGXLogger } from 'ngx-logger';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { AlertDialogueComponent } from 'src/app/shared/components/alert-dialogue/alert-dialogue.component';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { IntercomService } from 'src/app/services/intercom.service';
import { RegulationDialogueComponent } from 'src/app/shared/components/regulation-dialogue/regulation-dialogue.component';
import { UserService } from 'src/app/shared/services/user.service';
import * as regulation from 'src/app/shared/services/regulations';
import { BillingAlertComponent } from 'src/app/shared/components/billingalert/billing-alert.component';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { HttpEvent } from '@angular/common/http';
@Component({
  selector: 'app-billing-correspondance',
  templateUrl: './correspondance.component.html',
  styleUrls: ['./correspondance.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BillingCorrespondanceComponent implements OnInit {
  displayedColumns: string[] = ['select', 'form_name'];
  selection = new SelectionModel<any>(true, []);
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  default_select = globals.default_select
  sentDocuments: any = new MatTableDataSource([]);
  documents: any = new MatTableDataSource([]);
  recipients: any = new MatTableDataSource([]);
  // dataSource3: any = new MatTableDataSource([]);
  columnsToDisplay = [];
  columnsToDisplay1 = [];
  expandedElement;
  expandedElement1;
  isMobile = false;
  columnName = [];
  columnName1 = [];
  filterValue: string;
  displayedColumns1: string[] = ['select', 'recipient_type'];
  selection1 = new SelectionModel<any>(true, []);
  claim_id: any;
  billableId: any;
  examinerId: any;
  isLoading: boolean = false;
  correspondData: any;
  states = [];
  dataSource1: any;
  columnsToDisplays = [];
  columnNames = [];
  columnsToDisplayTracing = [];
  columnNameTracing = [];
  statusBarValues = { value: null, status: '', class: '' }
  statusOfAppointment = { isEmptyNoDate: false, IsEmptyAppointmentDate: false, isEmptyDuration: false, isEmptyLocation: false }
  is_appointment_incomplete = false;
  error_message = "";
  isExaminerChange = true;
  regulation = regulation;
  isIncompleteError = true;
  incompleteInformation: any;
  isExpandDetail = true;
  isIME: boolean = false;
  claimant_id: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('popupMenu', { static: false }) popupMenu: MatMenuTrigger;

  constructor(private claimService: ClaimService, private logger: NGXLogger, private breakpointObserver: BreakpointObserver, private route: ActivatedRoute, private router: Router, private onDemandService: OnDemandService, public dialog: MatDialog, private alertService: AlertService, private intercom: IntercomService, private cookieService: CookieService,
    private userService: UserService,) {
    this.claimService.seedData("state").subscribe(res => {
      this.states = res.data;
    })

    this.route.params.subscribe(params => {
      this.claim_id = params.claim_id;
      this.billableId = params.billId;
      this.examinerId = params.examiner_id;
      this.claimant_id = params.claimant_id;

      this.onDemandService.getCorresIncomplete(this.claim_id, this.billableId, []).subscribe(res => {
        this.isIncompleteError = true;
      }, error => {
        this.isIncompleteError = false;
        this.incompleteInformation = error.error.data;
      })
      this.onDemandService.getTrackingTable(this.claim_id, this.billableId).subscribe(res => {
        this.dataSource1 = new MatTableDataSource(res.data)
        this.dataSource1.paginator = this.paginator;
        this.dataSource1.sort = this.sort;
      })
      this.getBreadcrumbDetails();
      this.getData();
    })
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "File Name"]
        this.columnsToDisplay = ['is_expand', 'file_name']
      } else {
        this.columnName = ["Ref #", "File Name", "Action", "Date", "Recipients", "Download" + '\n' + "Generated Items", "Download" + '\n' + "On Demand Proof of Service", "Further Information"]
        this.columnsToDisplay = ['request_reference_id', 'file_name', 'action', "date", "recipients", 'download', 'download1', 'further_info']
      }
      this.isMobile = res;
      if (res) {
        this.columnNames = ["", "Ref #"]
        this.columnsToDisplays = ['is_expand', 'request_reference_id']
      } else {
        this.columnNames = ["Ref #", "Receiver Name", "Tracking Number", "Details"]
        this.columnsToDisplays = ['request_reference_id', 'receiver_name', "tracking_number", "more"]
      }
      this.isMobile = res;
      if (res) {
        this.columnNameTracing = ["", "Ref #"]
        this.columnsToDisplayTracing = ['is_expand', 'ref_id']
      } else {
        this.columnNameTracing = ["Ref #", "Receiver Name", "Internal Tracing Number", "Details"]
        this.columnsToDisplayTracing = ['ref_id', 'receiver_name', "tracing_id", "more"]
      }
    })
  }

  styleElement: HTMLStyleElement;
  getBreadcrumbDetails() {
    const ids = {
      claimant_id: this.claimant_id,
      claim_id: this.claim_id,
      billable_item_id: this.billableId
    }
    this.onDemandService.getBreadcrumbDetails(ids).subscribe(details => {
      this.intercom.setClaimant(details.data.claimant.first_name + ' ' + details.data.claimant.last_name);
      this.cookieService.set('claimDetails', details.data.claimant.first_name + ' ' + details.data.claimant.last_name);
      this.intercom.setClaimNumber(details.data.claim_number);
      this.cookieService.set('claimNumber', details.data.claim_number);
      this.intercom.setBillableItem(details.data.exam_procedure_name);
      this.cookieService.set('billableItem', details.data.exam_procedure_name);
      if (details.data && details.data.exam_procedure_name.includes('IME')) {
        this.isIME = true;
      }
    }, error => {
    });
  }

  changeColors(color) {
    color = color ? color : "#E6E6E6";
    const head = document.getElementsByTagName("head")[0];
    const css = `
  .progress .mat-progress-bar-fill::after {
    background-color: ${color} !important;
  }  `;
    this.styleElement.innerHTML = "";
    this.styleElement.type = "text/css";
    this.styleElement.appendChild(document.createTextNode(css));
    head.appendChild(this.styleElement);
  }
  tracingpopupData: any = [];
  openTracing(element) {
    this.tracingpopupData = [];
    this.onDemandService.getTracingPopUp(element.id, this.claim_id, this.billableId).subscribe(res => {
      this.tracingpopupData = res.data;
      //this.popupMenu.openMenu();
    }, error => {
      console.log(error);
    })
  }
  getData(data?) {
    let selected = [];
    if (data) {
      selected = data;
    } else {
      this.selection.clear();
      this.selection1.clear();
    }
    this.onDemandService.getCorresIncomplete(this.claim_id, this.billableId, []).subscribe(res => {
      this.isIncompleteError = true;
    }, error => {
      this.isIncompleteError = false;
      this.incompleteInformation = error.error.data;
    })
    this.onDemandService.getCorrespondingData(this.claim_id, this.billableId).subscribe(res => {
      this.selection1.clear();
      this.selection.clear();
      this.correspondData = res;

      console.log(res)
      this.changeColors(res.on_demand_status_color_code);
      if (res.examiner_user_id) {
        this.examinerId = res.examiner_user_id;
      }
      this.statusOfAppointment = { isEmptyNoDate: !res.is_appointment_no_date_present, IsEmptyAppointmentDate: !res.is_appointment_date_time_present, isEmptyDuration: !res.is_appointment_duration_present, isEmptyLocation: !res.is_appointment_location_present }
      // res.documents.map(doc => {
      //   if (doc.is_mandatory) {
      //     this.selection.select(doc);
      //   }
      // })
      // res.recipient.map(doc => {
      //   if (doc.is_mandatory) {
      //     this.selection1.select(doc);
      //   }
      // })
      this.documents = new MatTableDataSource(res.documents);
      this.recipients = new MatTableDataSource(res.recipient);
      this.sentDocuments = new MatTableDataSource(res.documents_sent_and_received);
      this.statusBarChanges(this.correspondData.on_demand_status)
    })
  }
  isAllSelected() {
    if (!this.isLoading) {
      const numSelected = this.selection.selected.length;
      const numRows = this.documents.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.documents.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.form_name + 1}`;
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected1() {
    if (this.recipients.data) {
      const numSelected = this.selection1.selected.length;
      const numRows = this.recipients.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection1. */
  masterToggle1() {
    this.isAllSelected1() ?
      this.selection1.clear() :
      this.recipients.data.forEach(row => this.selection1.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel1(row?: any): string {
    if (!row) {
      return `${this.isAllSelected1() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection1.isSelected(row) ? 'deselect' : 'select'} row ${row.recipient_type + 1}`;
  }
  isEditRecipient: boolean = false;
  editRecipient(element) {
    this.isEditRecipient = true;
    const dialogRef = this.dialog.open(CustomRecipient, {
      width: '800px',
      data: { claim_id: this.claim_id, billable_id: this.billableId, data: element, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getData();
      }
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(FileUploadComponent, {
      width: '800px',
      data: { message: 'Uploaded documents should not exceed 300 dpi', address: true, isMultiple: true, fileType: ['.pdf', '.doc', '.docx'], fileSize: 30 },
      panelClass: 'custom-drag-and-drop',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        let formData = new FormData()
        formData.append("document_category_id", "10");
        formData.append('claim_id', this.claim_id);
        formData.append('bill_item_id', this.billableId);
        for (let i = 0; i < result.files.length; i++) {
          formData.append('file', result.files[i]);
        }
        // console.log("result", result)
        this.onDemandService.uploadDocument(formData).subscribe((event: HttpEvent<any>) => {
          let progress = this.onDemandService.getProgress(event);
          if (progress == 0) {
            console.log(event, progress)
            if (event['body'])
              if (event['body'].status) {
                this.alertService.openSnackBar(event['body'].message, "success");
                this.getData();
              } else {
                this.alertService.openSnackBar(event['body'].message, "error");
              }
          }
        })
      }
    })
    // const dialogRef = this.dialog.open(CustomDocuments, {
    //   width: '800px',
    //   data: { claim_id: this.claim_id, billable_id: this.billableId }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.onDemandService.uploadDocument(result).subscribe(res => {
    //       if (res.status) {
    //         this.alertService.openSnackBar(res.message, "success");
    //         this.getData();
    //       } else {
    //         this.alertService.openSnackBar(res.message, "error");
    //       }
    //     })
    //   }
    //   // if (result) {
    //   //   this.getData();
    //   // }
    //   // this.animal = result;
    // });
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
  openCustomRecipient(): void {
    const dialogRef = this.dialog.open(CustomRecipient, {
      width: '800px',
      data: { claim_id: this.claim_id, billable_id: this.billableId, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getData();
      }
    });
  }
  openMailOnDemandConfirm(): void {
    const dialogRef = this.dialog.open(MailOnDemandConfirm, {
      width: '800px',
      data: { claim_id: this.claim_id, billable_id: this.billableId, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getData();
      }
    });
  }
  ngOnInit() {
    this.styleElement = document.createElement("style");
    this.changeColors("#E6E6E6");
  }
  downloadForms(sign) {
    if (!this.examinerId) {
      this.alertService.openSnackBar('Please select Examiner', "error");
      return;
    }
    if (this.selection.selected.length == 0) {
      this.alertService.openSnackBar('Please select Document(s)', "error");
      return;
    }
    if (this.selection1.selected.length > 12) {
      this.alertService.openSnackBar('Maximum 12 Recipients Allowed', "error");
      return;
    }

    let ids = [];
    this.selection1.selected.map(res => {
      ids.push(res.id)
    })
    this.onDemandService.getCorresIncomplete(this.claim_id, this.billableId, ids).subscribe(res => {
      this.downloadMethod(sign);
    }, error => {
      const dialogRef = this.dialog.open(BillingAlertComponent, {
        width: '500px',
        data: { title: 'Incomplete Information', incompleteInformation: error.error.data, ok: false, cancel: true, proceed: true }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.data) {
          this.downloadMethod(sign);
        }
      })
    })
    // if (this.isIncompleteError) {
    //   this.downloadMethod(sign);
    // } else {

    // }
  }
  downloadMethod(sign) {

    let signHide = false;
    if (sign) {
      signHide = sign;
    }
    let documents_ids: any = [];
    let custom_documents_ids: any = [];
    this.selection.selected.map(res => {
      if (res.doc_type == "custom") {
        custom_documents_ids.push(res.id)
      } else {
        documents_ids.push(res.id)
      }
    });
    // if (documents_ids.includes(3) || documents_ids.includes(5) || documents_ids.includes(16)) {
    //   if ((this.statusOfAppointment.IsEmptyAppointmentDate || this.statusOfAppointment.isEmptyDuration || this.statusOfAppointment.isEmptyLocation) && this.correspondData.exam_procedure_type.toLowerCase() != 'supplemental') {
    //     const dialogRef = this.dialog.open(AlertDialogueComponent, {
    //       width: '500px', data: { title: "Appointment Information Incomplete", message: "Please check the appointment date, time and location.", yes: true, no: true, type: "warning" }
    //     });
    //     dialogRef.afterClosed().subscribe(result => {
    //       if (result.data) {
    //         this.getDocs(documents_ids, custom_documents_ids, signHide);
    //       } else {
    //         return
    //       }
    //     })
    //   } else {
    //     this.getDocs(documents_ids, custom_documents_ids, signHide);
    //   }
    // } else {
    //   this.getDocs(documents_ids, custom_documents_ids, signHide);
    // }
    this.getDocs(documents_ids, custom_documents_ids, signHide);
  }
  getDocs(documents_ids, custom_documents_ids, signHide) {
    let recipientsDocuments_ids: any = [];
    let recipientsCustom_documents_ids: any = [];
    let selected_recipients: any = [];
    let document_ids_display_order: any = [];
    let addressEmpty = false;

    this.selection.selected.map(res => {
      if (res.doc_type != "custom") {
        document_ids_display_order.push({ form_id: res.id, custom_display_order: res.custom_display_oder })
      }
    })
    this.selection1.selected.map(res => {
      if (res.type == "custom") {
        recipientsCustom_documents_ids.push(res.id)
        selected_recipients.push(res);
      } else {
        recipientsDocuments_ids.push(res.id)
        selected_recipients.push(res.data);
      }
      if (res.message) {
        addressEmpty = true;
      }
    })
    let docDeatils = {
      documents_ids: documents_ids,
      custom_documents_ids: custom_documents_ids,
      recipients_ids: recipientsDocuments_ids,
      custom_recipients_ids: recipientsCustom_documents_ids,
      hide_sign: signHide,
      examiner_id: this.examinerId,
      selected_recipients: selected_recipients,
      document_ids_display_order: document_ids_display_order,
    }

    if (addressEmpty) {
      // const dialogRef = this.dialog.open(AlertDialogueComponent, {
      //   width: '500px',
      //   data: { title: signHide ? "Download" : 'E-Sign & Download', message: "Recipient address seems to be incomplete. Do you want to proceed further?", yes: true, no: true, type: "info", info: true, warning: true }
      // });
      // dialogRef.afterClosed().subscribe(result => {
      //   if (result.data) {
      const dialogRef = this.dialog.open(AlertDialogueComponent, {
        width: '500px', data: { title: "Confirm", message: "We are assuming you are processing Mailing Manually, Instead of 'Mail On-demand'.", yes: false, proceed: true, no: true, type: "warning" }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.data) {
          console.log("Need to update with api");
          this.downloadCorrespondance(docDeatils);
          documents_ids = [];
          custom_documents_ids = [];
          recipientsDocuments_ids = [];
          recipientsCustom_documents_ids = [];
        } else {
          this.downloadCorrespondance(docDeatils);
          documents_ids = [];
          custom_documents_ids = [];
          recipientsDocuments_ids = [];
          recipientsCustom_documents_ids = [];
        }
      })
      //   } else {
      //     return;
      //   }
      // })
    } else {
      // this.onDemandService.downloadCorrespondanceForm(this.claim_id, this.billableId, docDeatils).subscribe(res => {
      //   if (res.status) {
      //     let data = res.data;
      //     documents_ids = [];
      //     custom_documents_ids = [];
      //     recipientsDocuments_ids = [];
      //     recipientsCustom_documents_ids = [];
      //     this.selection.clear();
      //     this.selection1.clear();
      //     this.download(res.data.file_url, res.data.file_name);
      //     this.getData();
      //     this.alertService.openSnackBar("File downloaded successfully", 'success');
      //   } else {
      //     this.alertService.openSnackBar(res.message, "error");
      //   }
      // });
      const dialogRef = this.dialog.open(AlertDialogueComponent, {
        width: '500px', data: { title: "Confirm", message: "We are assuming you are processing mailing manually, instead of Mail On Demand.", yes: false, proceed: true, no: true, type: "warning" }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.data) {
          console.log("Need to update with api");
          this.downloadCorrespondance(docDeatils);
          documents_ids = [];
          custom_documents_ids = [];
          recipientsDocuments_ids = [];
          recipientsCustom_documents_ids = [];
        } else {
          this.downloadCorrespondance(docDeatils);
          documents_ids = [];
          custom_documents_ids = [];
          recipientsDocuments_ids = [];
          recipientsCustom_documents_ids = [];
        }
      })
    }
  }
  downloadCorrespondance(docDeatils) {
    this.onDemandService.downloadCorrespondanceForm(this.claim_id, this.billableId, docDeatils).subscribe(res => {
      if (res.status) {
        let data = res.data;
        this.selection.clear();
        this.selection1.clear();
        this.download(res.data.file_url, res.data.file_name);
        this.getData();
        this.alertService.openSnackBar("File downloaded successfully", 'success');
      } else {
        this.alertService.openSnackBar(res.message, "error");
      }
    });
  }
  download(url, name) {
    saveAs(url, name, '_self');
  }
  expandId: any;
  openElement(element) {
    if (this.isMobile)
      if (this.expandId && this.expandId == element.id) {
        this.expandId = null;
      } else {
        this.expandId = element.document_id;
      }
  }
  expandId2: any;
  openElement2(element) {
    if (this.isMobile) {
      this.expandId2 = element.id;
    }
  }
  expandId3: any;
  openElement3(element) {
    if (this.isMobile) {
      this.expandId3 = element.id;
    }
  }

  allOrNone(status) {
    if (!status) {
      this.selection.clear()
    } else {
      this.documents.data.forEach(row => this.selection.select(row))
    }
  }
  allOrNone1(status) {
    if (!status) {
      this.selection1.clear()
    } else {
      this.recipients.data.forEach(row => this.selection1.select(row))
    }
  }
  expandId1: any;
  openElement1(element) {
    if (this.isMobile) {
      this.expandId1 = element.document_id;
    }

  }
  removeCustomDocument(element) {
    let SelectedIds = [];
    SelectedIds = this.selection.selected;
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: {
        name: "remove this document", address: true, title: element.original_file_name && element.original_file_name != '' ? element.original_file_name :
          element.form_name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.onDemandService.removeDocument(element.id, 9).subscribe(res => {
          if (res.status) {
            this.alertService.openSnackBar(res.message, "success")
            let index = SelectedIds.indexOf(element.id);
            SelectedIds.splice(index, 1)
            this.getData(SelectedIds);
          } else {
            this.alertService.openSnackBar(res.message, "error")
          }
        })
      } else {
        return;
      }
    });

  }
  deleteRecipient(element) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: "remove this recipient", address: true, title: (element.name ? element.name : "") }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.onDemandService.removeRecipient(element.id, { request_type: "correspondence", claim_id: this.claim_id, billable_item_id: this.billableId }).subscribe(res => {
          if (res.status) {
            this.getData();
            this.alertService.openSnackBar(res.message, "success")
          } else {
            this.alertService.openSnackBar(res.message, "error")
          }
        });
      } else {
        return;
      }
    });
  }

  typeIfRecipient = "";// ["Claimant", "Insurance Company", "DEU Office", "Applicant Attorney", "Defense Attroney"]
  openAddAddress(element): void {
    this.typeIfRecipient = element.recipient_type;

    const dialogRef = this.dialog.open(AddAddress, {
      width: '800px',
      data: { type: this.typeIfRecipient, data: element.data, state: this.states }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getData();
      this.getBreadcrumbDetails();
    });
  }

  statusBarChanges(status) {
    switch (status) {
      case 'Unsent':
        this.statusBarValues = { value: 0, status: status, class: 'not-sent' }
        break;
      case 'In Progress':
        this.statusBarValues = { value: 50, status: status, class: 'sent' }
        break;
      case 'Completed':
        this.statusBarValues = { value: 100, status: status, class: 'complete' }
        break;
      case 'Error':
        this.statusBarValues = { value: 50, status: status, class: 'error' }
        break;

      default:
        this.statusBarValues = { value: 50, status: 'Error', class: '.error' }
        break;
    }
  }

  onDemandSubmit() {

    if (!this.examinerId) {
      this.alertService.openSnackBar('Please select Examiner', "error");
      return;
    }
    if (this.selection.selected.length == 0 && this.selection1.selected.length == 0) {
      this.alertService.openSnackBar('Please select Document(s) & Recipient(s)', "error");
      return;
    }
    if (this.selection.selected.length == 0) {
      this.alertService.openSnackBar('Please select Document(s)', "error");
      return;
    }
    if (this.selection1.selected.length == 0) {
      this.alertService.openSnackBar('Please select Recipient(s)', "error");
      return;
    }
    if (this.selection1.selected.length > 12) {
      this.alertService.openSnackBar('Maximum 12 Recipients Allowed', "error");
      return;
    }
    let ids = [];
    let have_address = [];
    let empty_address = [];
    let have_custom_recipient = "";
    this.selection1.selected.map(res => {
      if (!res.message) {
        if (res.type == 'custom') {
          have_custom_recipient = "Custom Recipient";
        }
        if (res.recipient_type) {
          have_address.push(res.recipient_type)
        }
        ids.push(res.id)
      } else {
        empty_address.push(res.recipient_type)
      }
    })
    this.selection
    if (ids.length == 0) {
      // let message = "";
      // empty_address.map(msg => {
      //   if (msg == "") {
      //     message = msg
      //   } else {
      //     message = message + " and " + msg;
      //   }
      // })
      // const dialogRef = this.dialog.open(AlertDialogueComponent, {
      //   width: '500px',
      //   data: { title: "Address incomplete", message: "Don't have address for " + empty_address.join(", ") + "!", ok: true, no: false, type: "warning", warning: true }
      // });
      // dialogRef.afterClosed().subscribe(result => {
      //   return
      // })
      this.checkIncomplete(ids)
    } else {
      if (empty_address.length > 0) {
        let message = "";
        empty_address.map(msg => {
          if (msg == "") {
            message = msg
          } else {
            message = message + " and " + msg;
          }
        })

        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          data: {
            title: "Address incomplete", message: empty_address.join(", ") + " does not have address details whereas " + have_address.join(', ') + (have_address.length && have_custom_recipient != "" ? ", " : "") + have_custom_recipient + " has the address details." + " Do you want to proceed?", proceed: true, cancel: true, type: "warning", warning: true
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.data) {
            this.createOndemand(ids)
          }
        })
        return
      } else {
        this.createOndemand(ids);
      }
    }
    if (ids.length == 0) {
      return;
    }
  }
  checkIncomplete(ids) {
    this.onDemandService.getCorresIncomplete(this.claim_id, this.billableId, ids).subscribe(res => {
      this.createOndemand(ids);
    }, error => {
      const dialogRef = this.dialog.open(BillingAlertComponent, {
        width: '500px',
        data: { title: 'Incomplete Information', incompleteInformation: error.error.data, ok: true }
      });
      dialogRef.afterClosed().subscribe(result => {
        return
      })
    })

  }
  createOndemand(ids) {
    let documents_ids: any = [];
    let document_ids_display_order: any = [];
    let custom_documents_ids: any = [];
    let selected_recipients: any = [];
    this.selection.selected.map(res => {
      if (res.doc_type == "custom") {
        custom_documents_ids.push(res.id)
      } else {
        document_ids_display_order.push({ form_id: res.id, custom_display_order: res.custom_display_oder })
        documents_ids.push(res.id)
      }
    })
    let recipientsDocuments_ids: any = [];
    let recipientsCustom_documents_ids: any = [];
    let addressEmpty = false;
    this.selection1.selected.map(res => {
      if (res.type == "custom") {
        recipientsCustom_documents_ids.push(res.id)
        selected_recipients.push(res);
      } else {
        if (!res.message) {
          recipientsDocuments_ids.push(res.id)
          selected_recipients.push(res.data);
        }
      }
      if (res.message) {
        addressEmpty = true;
      }
    })
    let data = {
      claim_id: this.claim_id,
      document_category_id: 9,
      billable_item_id: this.billableId,
      service_request_type_id: 4,
      documents_ids: documents_ids,
      document_ids_display_order: document_ids_display_order,
      custom_documents_ids: custom_documents_ids,
      recipients_ids: recipientsDocuments_ids,
      custom_recipients_ids: recipientsCustom_documents_ids,
      examiner_id: this.examinerId,
      selected_recipients: selected_recipients
    }
    this.getOndemandDocs(data);

  }
  getOndemandDocs(data) {
    this.onDemandService.onDemandCorrespondence(data).subscribe(record => {
      this.alertService.openSnackBar("Mail On Demand created successfully", 'success');
      if (record.data.file_url) {
        this.download(record.data.file_url, record.data.file_name);
      }
      this.getData();
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  inOutdownload(data, element?, status?) {
    let is_proof_of_service: any;
    if (status == 'download') {
      is_proof_of_service = false;
    } else {
      is_proof_of_service = true;
    }
    this.claimService.updateActionLog({ type: "correspondance", "document_category_id": 9, "claim_id": this.claim_id, "billable_item_id": this.billableId, "documents_ids": [element.document_id], is_proof_of_service: is_proof_of_service }).subscribe(res => {
    })
    saveAs(data.file_url, data.file_name, '_self');
  }

}

@Component({
  selector: 'custom-documents',
  templateUrl: 'custom-documents.html',
})
export class CustomDocuments {
  claim_id: any;
  billable_id: any;
  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;
  constructor(
    private logger: NGXLogger,
    public dialogRef: MatDialogRef<CustomDocuments>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private alertService: AlertService, private onDemandService: OnDemandService) {
    dialogRef.disableClose = true;
    this.claim_id = data['claim_id'];
    this.billable_id = data['billable_id'];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  selectedFile: FileList;
  selectedFiles: FileList;
  file: any = [];
  errors = { status: false, message: "" }
  selectFile(event) {
    this.selectedFiles = null;
    this.file = [];
    let fileTypes = ['pdf', 'doc', 'docx']
    if (!(fileTypes.includes(event.target.files[event.target.files.length - 1].name.split('.').pop().toLowerCase()))) {
      this.alertService.openSnackBar("This file type is not accepted", 'error');
      return;
    }
    this.selectedFiles = event.target.files;
    this.selectedFile = null;

    for (let i = 0; i < this.selectedFiles.length; i++) {
      if (fileTypes.includes(this.selectedFiles[i].name.split('.').pop().toLowerCase())) {
        this.selectedFile = this.selectedFiles;
        var FileSize = this.selectedFiles[i].size / 1024 / 1024; // in MB
        if (FileSize > 30) {
          this.fileUpload.nativeElement.value = "";
          this.errors = { status: true, message: "File size is too large" };
          return;
        }
        this.file.push(this.selectedFiles[i].name);
      } else {
        this.selectedFiles = null;
        this.file = [];
        this.fileUpload.nativeElement.value = "";
        this.alertService.openSnackBar("This file type is not accepted", 'error');
        // this.errors = { status: true, message: "This file type is not accepted" };
        console.log(this.selectedFile)
      }
    }

  }
  isUploading = false;
  uploadFile() {
    console.log(this.selectedFiles)
    if (!this.selectedFiles) {
      this.alertService.openSnackBar("Please select a file", 'error');
      return;
    }
    this.isUploading = true;
    let formData = new FormData()
    formData.append("document_category_id", "10");
    formData.append('claim_id', this.claim_id);
    formData.append('bill_item_id', this.billable_id);
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('file', this.selectedFiles[i]);
    }
    this.dialogRef.close(formData);
  }
}
@Component({
  selector: 'custom-recipient',
  templateUrl: 'custom-recipient.html',
})
export class CustomRecipient {
  customReceipient: any;
  states: any = [];
  claim_id: any;
  billable_id: any;
  isEdit: any = false;
  recipientData = {};
  isSubmit = false;
  isAddressError = false;
  streetAddressList = [];
  isAddressSearched = false;

  constructor(
    public dialogRef: MatDialogRef<CustomRecipient>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder, private claimService: ClaimService,
    private alertService: AlertService, private onDemandService: OnDemandService) {
    dialogRef.disableClose = true;
    this.claim_id = data['claim_id'];
    this.billable_id = data['billable_id'];
    this.isEdit = data['isEdit'];
    this.claimService.seedData("state").subscribe(res => {
      this.states = res.data;
    })
  }
  ngOnInit() {
    this.customReceipient = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      street1: [null, Validators.required],
      street2: [null],
      city: [null, Validators.required],
      state_id: [null, Validators.required],
      state: [null],
      zip_code: [null, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$'), Validators.required])],
    })

    this.customReceipient.get('street1').valueChanges
      .pipe(
        debounceTime(500),
      ).subscribe(key => {
        if (key && typeof (key) == 'string')
          key = key.trim();
        this.isAddressSearched = true;
        if (key)
          this.claimService.searchAddress(key).subscribe(address => {
            this.streetAddressList = address.suggestions;
            this.isAddressError = false;
          }, error => {
            if (error.status == 0)
              this.isAddressError = true;
            this.streetAddressList = [];
          })
        else
          this.streetAddressList = [];
      })


    if (this.isEdit) {
      this.data['data'].state_id = this.data['data'].state;
      if (this.data["data"].zip_code_plus_4) {
        this.data["data"].zip_code = this.data["data"].zip_code + '-' + this.data["data"].zip_code_plus_4;
      }
      this.changeState(this.data['data'].state, this.data['data'].state_code)
      this.customReceipient.patchValue(this.data["data"]);
    }
  }
  recipientState = {};
  changeState(state, state_code?) {
    if (state_code) {
      this.recipientState = state_code;
      return;
    }
    this.states.map(res => {
      if ((res.id == state) || (res.state == state)) {
        this.recipientState = res.state_code;
      }
    })
  }

  selectAddress(street) {
    let state_id: any;
    this.states.map(state => {
      if (state.state_code == street.state) {
        state_id = state.id;
      }
    })
    this.customReceipient.patchValue({
      street1: street.street_line,
      street2: "",
      city: street.city,
      state_id: state_id,
      zip_code: street.zipcode
    })
    this.changeState("", street.state)
  }

  saveClick() {
    Object.keys(this.customReceipient.controls).forEach((key) => {
      if (this.customReceipient.get(key).value && typeof (this.customReceipient.get(key).value) == 'string')
        this.customReceipient.get(key).setValue(this.customReceipient.get(key).value.trim())
    });
    if (this.customReceipient.invalid) {
      return
    }
    this.isSubmit = true;
    this.onDemandService.createCustomRecipient(this.claim_id, this.billable_id, this.customReceipient.value).subscribe(res => {
      if (res.status) {
        this.alertService.openSnackBar(res.message, "success");
        this.isSubmit = false;
        this.dialogRef.close(res)
      } else {
        this.alertService.openSnackBar(res.message, "error");
      }
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}




@Component({
  selector: 'add-address',
  templateUrl: 'add-address.html',
})
export class AddAddress {
  states: any;
  userData: any;
  type = "";
  isLoading = false;
  claimantForm: FormGroup;
  isSubmit = false;
  streetClaimantAddressList = [];
  isClaimantAddressError = false;
  isClaimantAddressSearched = false;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddAddress>,
    private claimService: ClaimService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.isLoading = true;
    this.states = data["state"];
    this.userData = data["data"];
    this.type = data["type"];
  }
  ngOnInit() {
    this.isLoading = false;
    if (this.type == "Claimant") {
      this.claimantForm = this.formBuilder.group({
        id: [""],
        name: [{ value: "", disabled: true }, Validators.compose([Validators.required])],
        street1: [null, Validators.compose([Validators.required])],
        street2: [null],
        city: [null, Validators.compose([Validators.required])],
        state: [null, Validators.compose([Validators.required])],
        date_of_birth: [null],
        organization_id: [null],
        gender: [null],
        zip_code: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])]
      });
      this.changeState(this.userData.state, this.userData.state_code)
      this.claimantForm.patchValue(this.userData);
      this.claimantForm.get('street1').valueChanges
        .pipe(
          debounceTime(500),
        ).subscribe(key => {
          if (key && typeof (key) == 'string')
            key = key.trim();
          this.isClaimantAddressSearched = true;
          if (key)
            this.claimService.searchAddress(key).subscribe(address => {
              this.streetClaimantAddressList = address.suggestions;
              this.isClaimantAddressError = false;
            }, error => {
              if (error.status == 0)
                this.isClaimantAddressError = true;
              this.streetClaimantAddressList = [];
            })
          else
            this.streetClaimantAddressList = [];
        })
    }
  }
  selectAddress(street) {
    let state_id: any;
    this.states.map(state => {
      if (state.state_code == street.state) {
        state_id = state.id;
      }
    })

    this.claimantForm.patchValue({
      street1: street.street_line,
      street2: "",
      city: street.city,
      state: state_id,
      zip_code: street.zipcode
    })
    this.changeState("", street.state)
  }
  corresState: any;
  changeState(state, state_code?) {
    if (state_code) {
      this.corresState = state_code;
    }
    this.states.map(res => {
      if ((res.id == state) || (res.state_code == state)) {
        this.corresState = res.state_code;
      }
    })
  }
  saveClaimant() {
    if (this.claimantForm.invalid) {
      return
    }
    this.isSubmit = true;
    this.claimService.updateClaimant(this.claimantForm.value).subscribe(res => {
      this.alertService.openSnackBar("Claimant updated successfully", 'success');
      this.isSubmit = false;
      this.dialogRef.close(true);
    }, error => {
      this.alertService.openSnackBar(error.error, 'error');
    })
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
export interface Section {
  recipient_name: string;
  recipient_address: string;
  recipient: string
}
export interface Section1 {
  doc_name: string;
}

@Component({
  selector: 'mail-on-demand-confirm',
  templateUrl: 'mail-on-demand-confirm.html',
})
export class MailOnDemandConfirm {


  constructor(
    public dialogRef: MatDialogRef<MailOnDemandConfirm>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  documents: Section1[] = [
    {
      doc_name: "QME Appointment Notification Form 110",
    },
    {
      doc_name: "QME or AME Appointment Notification Letter",
    },
    {
      doc_name: "Declaration of Service",
    },
    // {
    //   doc_name: "QME or AME conflict of interest disclosure form and objection or waiver",
    // },
    // {
    //   doc_name: "Claimant Questionnaire",
    // }
  ];
  recipients: Section[] = [
    {
      recipient: "Claimant",
      recipient_name: "Venkatesan Mariyappan",
      recipient_address: "4017 13TH AVE W 4017 13TH AVE W CA CZ - 12345"
    },
    {
      recipient: "Insurance Company",
      recipient_name: "AAA NCNU IE",
      recipient_address: "4712 ADMIRALTY WAY STE 401  MARINA DEL REY CA - 90292"
    },
    // {
    //   recipient: "Applicant Attorney",
    //   recipient_name: "Rajan Mariappan",
    //   recipient_address: "4017 13TH AVE W 4017 13TH AVE W CA CZ - 12345"
    // },
    // {
    //   recipient: "DEU Office",
    //   recipient_name: "Sarath Selvaraj",
    //   recipient_address: "4712 ADMIRALTY WAY STE 401  MARINA DEL REY CA - 90292"
    // },
    // {
    //   recipient: "Defense Attorney",
    //   recipient_name: "Kitchen Remodel",
    //   recipient_address: "4017 13TH AVE W 4017 13TH AVE W CA CZ - 12345"
    // }
  ];
}

