import { Component, OnInit, Inject } from '@angular/core';
import { SubscriberService } from '../../service/subscriber.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { CookieService } from 'src/app/shared/services/cookie.service';

@Component({
  selector: 'app-add-edit-service-location',
  templateUrl: './add-edit-service-location.component.html',
  styleUrls: ['./add-edit-service-location.component.scss']
})
export class AddEditServiceLocationComponent implements OnInit {

  locationForm: FormGroup;
  states: any;
  addressType: any;
  locationSubmit: boolean = false;
  pageStatus: number;
  displayedColumns: string[] = ['examiner', 'date_added'];
  dataSource: any;
  editStatus: boolean = true;
  locationId: number = null;
  examinerId: number;
  user: any;
  examiner_list: any;
  constructor(private subscriberService: SubscriberService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    public _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    public dialog: MatDialog
  ) {
    this.user = JSON.parse(this.cookieService.get('user'));
    this.route.params.subscribe(params_res => {
      // this.locationForm.enable();
      // this.editStatus = true;
      this.pageStatus = params_res.status;
      this.examinerId = params_res.examiner;
      console.log(params_res)
      if (params_res.id) {
        this.editStatus = false;
        this.locationId = params_res.id;
        this.getLocation();
      }
    })
  }
  examinerName: string;
  getLocation() {

    if (this.pageStatus == 2) {
      this.subscriberService.getSingleLocationExaminer(this.locationId, this.examinerId).subscribe(locations => {
        this.locationUpdate(locations.data['0'])
        locations.data['0'].examiner_list.map(data => {
          if (data.id == this.examinerId) {
            this.examinerName = data.last_name + ' ' + data.first_name + (data.suffix ? ', ' + data.suffix : '')
          }
        });
        this.edit();
      })
    } else {
      this.subscriberService.getSingleLocation(this.locationId).subscribe(locations => {
        this.locationUpdate(locations.data['0'])

      })
    }
  }

  locationUpdate(details) {
    let location = details
    let data = {
      id: location.id,
      service_location_name: location.service_location_name,
      street1: location.street1,
      street2: location.street2,
      city: location.city,
      state: location.state,
      zip_code: location.zip_code,
      phone_no: location.phone_no,
      fax_no: location.fax_no,
      email: location.email,
      contact_person: location.contact_person,
      notes: location.notes,
      service_code_id: location.service_code_id,
      national_provider_identifier: location.national_provider_identifier,
      is_active: location.is_active.toString(),
    }

    this.locationForm.patchValue(data);
    this.dataSource = new MatTableDataSource(location.examiner_list ? location.examiner_list : []);
    this.examiner_list = location.examiner_list ? location.examiner_list : [];
    this.locationForm.disable();
  }

  ngOnInit() {
    this.locationForm = this.formBuilder.group({
      id: [null],
      service_location_name: [null],
      street1: [null, Validators.required],
      street2: [null],
      city: [null, Validators.required],
      state: [null, Validators.required],
      zip_code: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      phone_no: [null],
      fax_no: [null],
      email: [null, Validators.compose([Validators.pattern('^[A-z0-9._%+-]+@[A-z0-9.-]+\\.[A-z]{2,4}$')])],
      contact_person: [null],
      notes: [null],
      service_code_id: [null, Validators.required],
      //national_provider_identifier: [null],
      is_active: ['true'],
    })
    this.subscriberService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
    })

    this.subscriberService.seedData('service_code').subscribe(response => {
      this.addressType = response['data'];
    }, error => {
      console.log("error", error)
    })

    if (this.pageStatus == 2) {
      this.locationForm.addControl('national_provider_identifier', new FormControl(null, Validators.compose([Validators.pattern('^[0-9]*$'), Validators.maxLength(15)])));
    }
  }

  locationFromSubmit() {
    Object.keys(this.locationForm.controls).forEach((key) => {
      if (this.locationForm.get(key).value && typeof (this.locationForm.get(key).value) == 'string')
        this.locationForm.get(key).setValue(this.locationForm.get(key).value.trim())
    });
    this.locationSubmit = true;
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched()
      return;
    }

    let examiner = []
    if (this.locationForm.value.is_active == 'false') {
      this.examiner_list.map(ex => {
        if (ex.id != this.user.id) {
          examiner.push(ex)
          this.inActiveStatus = true
        }

      })
      if (this.inActiveStatus) {
        this.opendialog(examiner)
        return;
      }

    }

    if (this.pageStatus == 2) {
      this.subscriberService.updateExaminerLocation(this.examinerId, this.locationForm.value).subscribe(location => {
        //console.log(location)
        if (this.locationForm.value.id) {
          this.alertService.openSnackBar('Location updated successfully', 'success');
        } else {
          this.alertService.openSnackBar('Location created successfully', 'success');
        }
        this.router.navigate(['/subscriber/users/examiner', this.examinerId, 1])
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })

    } else {


      this.subscriberService.updateLocation(this.locationForm.value).subscribe(location => {
        //console.log(location)
        if (this.locationForm.value.id) {
          this.alertService.openSnackBar('Location updated successfully', 'success');
        } else {
          this.alertService.openSnackBar('Location created successfully', 'success');
        }

        this.router.navigate(['/subscriber/location'])
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  cancel() {
    if (this.pageStatus == 2) {
      this.router.navigate(['/subscriber/users/examiner', this.examinerId, 1])
      return;
    }
    if (this.locationId) {
      this.getLocation()
      this.editStatus = false;
    } else {
      this._location.back();
    }

  }

  edit() {
    this.editStatus = true;
    this.locationForm.enable();
  }

  nevigateExaminer(e) {
    // this.router.navigate(['/subscriber/users/examiner/',e.id])
  }
  inActiveStatus: boolean = false;
  locationStatus(e) {
    console.log(e.value, this.user.role_id)

  }

  opendialog(examiner): void {
    const dialogRef = this.dialog.open(InActivedialog, {
      width: '500px',
      data: { examiner: examiner },

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        this.subscriberService.updateLocation(this.locationForm.value).subscribe(location => {
          //console.log(location)
          if (this.locationForm.value.id) {
            this.alertService.openSnackBar('Location updated successfully', 'success');
          } else {
            this.alertService.openSnackBar('Location created successfully', 'success');
          }

          this.router.navigate(['/subscriber/location'])
        }, error => {
          this.alertService.openSnackBar(error.error.message, 'error');
        })

      }
    });
  }

}

@Component({
  selector: 'inactive-dialog',
  templateUrl: 'in-active-dialog.html',
})
export class InActivedialog {
  examiner: any;
  constructor(
    public dialogRef: MatDialogRef<InActivedialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
    this.examiner = data.examiner;
    console.log(data)
  }

  onNoClick(): void {
    this.dialogRef.close({ data: false });
  }

  onYesClick(): void {
    this.dialogRef.close(
      { data: true }
    );
  }

}
