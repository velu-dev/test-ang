import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Router } from '@angular/router';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { saveAs } from 'file-saver';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface PeriodicElement {
  name: string;
  uploaded_on: string;
  action: string;
}
@Component({
  selector: 'app-correspondance',
  templateUrl: './correspondance.component.html',
  styleUrls: ['./correspondance.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class CorrespondanceComponent implements OnInit {
  // displayedColumns: string[] = ['doc_image', 'name', 'uploaded_on', 'action'];
  correspondance: FormGroup;
  @Input('state') states;
  correspondForm: FormGroup;
  correspondenceSource: any = [];
  @Input('claimId') claimId;
  documents_ids = [];
  @ViewChild('uploader', { static: true }) fileUpload: ElementRef;
  file: any = null;
  note: string = '';
  dataSource: any;
  columnName = []
  columnsToDisplay = [];
  expandedElement: any;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isMobile = false;
  constructor(private formBuilder: FormBuilder,
    private claimService: ClaimService,
    private alertService: AlertService,
    private router: Router,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Name", "Action"]
        this.columnsToDisplay = ['is_expand', 'file_name', "action"]
      } else {
        this.columnName = ["", "Name", "Uploaded On ", "Action"]
        this.columnsToDisplay = ['doc_image', 'file_name', 'uploaded_on', "action"]
      }
    })
  }

  ngOnInit() {
    this.correspondForm = this.formBuilder.group({
      file: ['', Validators.compose([Validators.required])],
      note: ['']
    });

    this.claimService.getcorrespondence(this.claimId).subscribe(correspondRes => {
      console.log(correspondRes);
      this.correspondenceSource = new MatTableDataSource(correspondRes['data'])
    }, error => {
      console.log(error);
    })
  }

  selectedFile: File;
  uploadFile(event) {
    this.selectedFile = null;
    let fileTypes = ['pdf', 'doc', 'docx']

    if (fileTypes.includes(event.target.files[0].name.split('.').pop().toLowerCase())) {
      var FileSize = event.target.files[0].size / 1024 / 1024; // in MB
      if (FileSize > 30) {
        this.alertService.openSnackBar("This file too long", 'error');
        return;
      }
      this.selectedFile = event.target.files[0];
      console.log(" this.selectedFile", this.selectedFile);
      this.file = event.target.files[0].name;
    } else {
      this.selectedFile = null;
      //this.errorMessage = 'This file type is not accepted';
      this.alertService.openSnackBar("This file type is not accepted", 'error');
    }

  }

  correspondFormSubmit() {
    // console.log(this.correspondForm.value)
    // console.log(this.claimId)
    // if (this.correspondForm.invalid) {
    //   this.correspondForm.get('note').markAsTouched();
    //   this.correspondForm.get('file').markAsTouched();
    //   return;
    // }
    if (this.file == null) {
      return;
    }
    let formData = new FormData()
    formData.append('file', this.selectedFile);
    formData.append('notes', this.note);
    if (this.claimId) {
      formData.append('claim_id', this.claimId)
    }
    this.claimService.postcorrespondence(formData).subscribe(data => {
      let details = {
        id: data['data'].id,
        file_name: data['data'].file_name,
        notes: this.note,
        updatedAt: data['data'].createdAt,
        exam_report_file_url: data['data'].exam_report_file_url
      }
      const tabledata = this.correspondenceSource.data ? this.correspondenceSource.data : this.correspondenceSource.data = [];
      tabledata.push(details);
      this.correspondenceSource = new MatTableDataSource(tabledata);
      this.fileUpload.nativeElement.value = "";
      this.selectedFile = null;
      this.file = null;
      this.note = '';
      //this.correspondForm.reset();
      this.alertService.openSnackBar("File added successfully", 'success');
    }, error => {
      console.log(error);
      this.selectedFile = null;
      this.fileUpload.nativeElement.value = "";
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  deletecorrespondence(data) {
    this.openDialog('delete', data);
  }

  openDialog(dialogue, data) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: dialogue, address: true, title: data.file_name }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.claimService.deleteCorrespondence(data.id).subscribe(deleteRes => {
          let type = this.correspondenceSource.data.findIndex(element => element.id == data.id);
          const tabledata = this.correspondenceSource.data;
          tabledata.splice(type, 1);
          this.documents_ids.splice(type, 1)
          this.correspondenceSource = new MatTableDataSource(tabledata);
          this.alertService.openSnackBar("File deleted successfully", 'success');
        }, error => {
          console.log(error);
        })
      }
    })
  }

  download(data) {
    this.alertService.openSnackBar("File downloaded successfully", "success");
    saveAs(data.exam_report_file_url, data.file_name);
  }

  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
    }
  }
}
