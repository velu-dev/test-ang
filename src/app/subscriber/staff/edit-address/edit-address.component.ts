import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClaimService } from '../../service/claim.service';
import { ExaminerService } from '../../service/examiner.service';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss']
})
export class EditAddressComponent implements OnInit {
  addressForm: FormGroup;
  states: any;
  addressType: any;
  examinerId: number;
  examinerName: string;
  addressIsSubmitted: boolean = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private claimService: ClaimService,
    private examinerService: ExaminerService,
  ) {
    this.route.params.subscribe(params => this.examinerId = params.id);
  }

  ngOnInit() {
    this.addressForm = this.formBuilder.group({
      id: [""],
      service_code_id: ['', Validators.compose([Validators.required])],
      phone1: [''],
      phone2: [''],
      mobile1: [''],
      mobile2: [''],
      fax1: [''],
      fax2: [''],
      street1: ['', Validators.compose([Validators.required])],
      street2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip_code: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      note: [''],
      email1: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      email2: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      contact_person: ['']
    });

    this.claimService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
    })

    this.claimService.seedData('service_code').subscribe(response => {
      this.addressType = response['data'];
      //this.addressType.splice(this.addressType.findIndex(o => o.address_type_name === 'Primary'), 1)
    }, error => {
      console.log("error", error)
    })
    this.getAddress();
  }

  getAddress() {
    this.examinerService.getsingleExAddress(this.examinerId).subscribe(res => {
      console.log(res)
    }, error => {

    })
  }

  addressformSubmit() {

  }

}
