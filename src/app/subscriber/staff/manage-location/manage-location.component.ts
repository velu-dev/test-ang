import { Component, OnInit } from '@angular/core';
import * as globals from '../../../globals';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';


const ELEMENT_DATA: any[] = [
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
  dataSource:any = ELEMENT_DATA;

 
  constructor() {
    this.dataSource.sortingDataAccessor = (data, sortHeaderId) =>(typeof(data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
   }

  ngOnInit() {
  
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
