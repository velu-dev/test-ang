import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, switchMap } from 'rxjs/operators';
import { ClaimService } from '../../service/claim.service';

@Component({
  selector: 'app-new-billing',
  templateUrl: './new-billing.component.html',
  styleUrls: ['./new-billing.component.scss']
})
export class NewBillingComponent implements OnInit {
  myControl = new FormControl();
  options: string[] = ['123456', 'M Venkat', 'M Rajan'];
  filteredOptions: Observable<string[]>;
  filteredICD: Observable<[]>;
  icdCtrl = new FormControl();
  constructor(private claimService: ClaimService) {
    this.filteredICD = this.icdCtrl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.claimService.getICD10(value)));
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

}
