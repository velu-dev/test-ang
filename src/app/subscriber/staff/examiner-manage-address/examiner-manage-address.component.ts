import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ClaimService } from '../../service/claim.service';
import { ExaminerService } from '../../service/examiner.service';

@Component({
  selector: 'app-examiner-manage-address',
  templateUrl: './examiner-manage-address.component.html',
  styleUrls: ['./examiner-manage-address.component.scss']
})
export class ExaminerManageAddressComponent implements OnInit {

  addresss: any[] = [
    {
      type: 'primary',
      name: 'Venkatesan',
      address: '30A, Auriss Technologies, Thirumurthi Layout Road, Lawley Road Area, Coimbatore, Tamil Nadu - 641002',
    }
  ];
  myControl = new FormControl();
  options: any[] = [
    { name: 'Mary' },
    { name: 'Shelley' },
    { name: 'Igor' },
    { name: 'Mary' },
    { name: 'Shelley' },
    { name: 'Igor' },
    { name: 'Mary' },
    { name: 'Shelley' },
    { name: 'Igor' },
    { name: 'Mary' },
  ];

  folders: any[] = [
    {
      name: 'Venkatesan Mariyappan',
      address: '30A, Auriss Technologies,  Lawley Road Area, Coimbatore, Tamil Nadu - 641002',
    },
    {
      name: 'Rajan',
      address: '30A,hirumurthi Layout Road, Lawley Road Area, Coimbatore, Tamil Nadu - 641002',
    },
    {
      name: 'Sarat',
      address: '30A, Auriss Technologies, Thirumurthi Layout Road, Lawley Road Area, Tamil Nadu - 641002',
    },
    {
      name: 'Velusamy',
      address: '30A, Auriss Technologies, Thirumurthi Layout Road, Lawley Road Area, Coimbatore, Tamil Nadu - 641002',
    }
  ];
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  filteredOptions: Observable<any[]>;
  addressForm: FormGroup;
  states: any;
  addressList: any;
  constructor(private claimService: ClaimService, private formBuilder: FormBuilder,
    private examinerService: ExaminerService
  ) { }

  ngOnInit() {
    this.addressForm = this.formBuilder.group({
      id: [""],
      location_type: ['', Validators.compose([Validators.required])],
      phone_number: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])],
      address1: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])]
    });
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );

    this.claimService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
    })

    this.examinerService.getExaminerAddress().subscribe(response => {
      console.log(response)
    }, error => {
      console.log(error)
    })


  }

  displayFn(user): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
  addressIsSubmitted: boolean = false;
  addressformSubmit() {
    this.addressIsSubmitted = true;
    console.log(this.addressForm.value)
    if (this.addressForm.invalid) {
      console.log(this.addressForm.value)
      return;
    }
  }
}
