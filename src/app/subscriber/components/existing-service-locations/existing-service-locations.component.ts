import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ExaminerService } from '../../service/examiner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-existing-service-locations',
  templateUrl: './existing-service-locations.component.html',
  styleUrls: ['./existing-service-locations.component.scss']
})
export class ExistingServiceLocationsComponent implements OnInit {
  addresssearch = new FormControl();
  filteredOptions: any;
  locationData: any = null;
  national_provider_identifier: any = null;
  examinerId: number;
  constructor(private examinerService: ExaminerService,
    private route: ActivatedRoute,
    private router: Router,
    public _location: Location,
    private alertService: AlertService) {

    this.route.params.subscribe(params => this.examinerId = params.id)

    this.addresssearch.valueChanges.subscribe(res => {
      this.examinerService.searchAddress({ basic_search: res, isadvanced: false },1).subscribe(value => {
        this.filteredOptions = value;
      })
    })
  }

  ngOnInit() {
  }

  addressOnChange(data) {
    this.locationData = null;
    this.locationData = data;
  }

  locationSubmit() {
    if (this.locationData == null || this.national_provider_identifier == null) {
      return;
    }
    console.log(this.locationData);
    console.log(this.national_provider_identifier);

    let existing = {
      user_id: this.examinerId,
      service_location_id: this.locationData.id,
      national_provider_identifier: this.national_provider_identifier
    }

    this.examinerService.updateExistingLocation(existing).subscribe(location => {
      console.log(location)
      this.router.navigate(['/subscriber/users/examiner',this.examinerId])
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })

  }

  cancel() {
    this._location.back();
  }

  locationRoute(){
    this.router.navigate(['/subscriber/location/add-location/2'])
  }

}
