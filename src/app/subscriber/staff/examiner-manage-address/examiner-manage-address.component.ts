import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
export interface Section {
  type: string;
  name: string;
  address: string;

}export interface User {
  name: string;
}
export interface Section_1 {
  name: string;
  address: string;
}
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
@Component({
  selector: 'app-examiner-manage-address',
  templateUrl: './examiner-manage-address.component.html',
  styleUrls: ['./examiner-manage-address.component.scss']
})
export class ExaminerManageAddressComponent implements OnInit {

  addresss: Section[] = [
    {
      type: 'primary',
      name: 'Venkatesan',
      address: '30A, Auriss Technologies, Thirumurthi Layout Road, Lawley Road Area, Coimbatore, Tamil Nadu - 641002',
    }
  ];
  myControl = new FormControl();
  options: User[] = [
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

  folders: Section_1[] = [
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
  dataSource = ELEMENT_DATA;
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

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];