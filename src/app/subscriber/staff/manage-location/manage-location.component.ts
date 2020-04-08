import { Component, OnInit } from '@angular/core';
import * as globals from '../../../globals';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';


export interface PeriodicElement {
  name: string;
  type: string;
  address: string;
  phone: string;
}
export interface User {
  name: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'SarathExaminer', type: 'Pharmacy', address: '2723  Mandan Road, California, MO, Missouri, 65018', phone: '816-269-6918' },
  { name: 'VenkatesnExaminer', type: 'Telehealth', address: '2723  Mandan Road, California, MO, Missouri, 65018', phone: '816-269-6918' },
  { name: 'RajanExaminer', type: 'Homeless Shelter', address: '2723  Mandan Road, California, MO, Missouri, 65018', phone: '816-269-6918' },
];
@Component({
  selector: 'app-manage-location',
  templateUrl: './manage-location.component.html',
  styleUrls: ['./manage-location.component.scss']
})
export class ManageLocationComponent implements OnInit {

  xls = globals.xls
  displayedColumns =
    ['name', 'type', 'address', 'phone', 'action'];
  dataSource = ELEMENT_DATA;

  myControl = new FormControl();
  options: User[] = [
    { name: 'Mary' },
    { name: 'Shelley' },
    { name: 'Igor' }
  ];
  filteredOptions: Observable<User[]>;

  constructor() { }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );

  }
  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
