import { Component, OnInit } from '@angular/core';
import { SubscriberService } from '../../service/subscriber.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

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
  examinerId:number;
  constructor(private subscriberService: SubscriberService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    public _location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(params_res => {
      console.log(params_res)
      this.pageStatus = params_res.status;
      this.examinerId = params_res.examiner;
      if (params_res.id) {
        this.editStatus = false;
        this.locationId = params_res.id;
        this.getLocation()
      }
    })
  }

  getLocation() {
    this.subscriberService.getSingleLocation(this.locationId).subscribe(locations => {
      console.log(locations.data['0'])
      let location = locations.data['0']
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
      this.locationForm.disable();
    })
  }

  ngOnInit() {
    this.locationForm = this.formBuilder.group({
      id: [null],
      service_location_name: [null],
      street1: [null,Validators.required],
      street2: [null],
      city: [null,Validators.required],
      state: [null,Validators.required],
      zip_code: [null, Validators.compose([Validators.required,Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      phone_no: [null],
      fax_no: [null],
      email: [null, Validators.compose([Validators.pattern('^[A-z0-9._%+-]+@[A-z0-9.-]+\\.[A-z]{2,4}$')])],
      contact_person: [null],
      notes: [null],
      service_code_id: [null,Validators.required],
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
      this.locationForm.addControl('national_provider_identifier', new FormControl(null));
    }
  }

  locationFromSubmit() {
    Object.keys(this.locationForm.controls).forEach((key) => {
      if (this.locationForm.get(key).value && typeof (this.locationForm.get(key).value) == 'string')
        this.locationForm.get(key).setValue(this.locationForm.get(key).value.trim())
    });
    this.locationSubmit = true;
    if (this.locationForm.invalid) {
      return;
    }

    if (this.pageStatus == 2) {
      this.subscriberService.updateExaminerLocation(this.examinerId,this.locationForm.value).subscribe(location => {
        //console.log(location)
        if(this.locationForm.value.id){
          this.alertService.openSnackBar('Location updated successfully', 'success');
        }else{
          this.alertService.openSnackBar('Location created successfully', 'success');
        }
        this.router.navigate(['/subscriber/users/examiner',this.examinerId])
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })
     
    }else{ 

    this.subscriberService.updateLocation(this.locationForm.value).subscribe(location => {
      //console.log(location)
      if(this.locationForm.value.id){
        this.alertService.openSnackBar('Location updated successfully', 'success');
      }else{
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
      this.router.navigate(['/subscriber/users/examiner',this.examinerId])
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

  nevigateExaminer(e){
    this.router.navigate(['/subscriber/users/examiner/',e.id])
  }

}
