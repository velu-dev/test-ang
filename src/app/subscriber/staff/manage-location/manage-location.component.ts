import { Component, OnInit, ViewChild } from '@angular/core';
import * as globals from '../../../globals';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ExaminerService } from '../../service/examiner.service';
import { MatPaginator } from '@angular/material/paginator';
import { AlertService } from 'src/app/shared/services/alert.service';

const ELEMENT_DATA: any[] = [
  {first_name: 1, type: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {first_name: 2, type: 'Helium', weight: 4.0026, symbol: 'He'},
  {first_name: 3, type: 'Lithium', weight: 6.941, symbol: 'Li'},
  {first_name: 4, type: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {first_name: 5, type: 'Boron', weight: 10.811, symbol: 'B'},
  {first_name: 6, type: 'Carbon', weight: 12.0107, symbol: 'C'},
  {first_name: 7, type: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {first_name: 8, type: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {first_name: 9, type: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {first_name: 10, type: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
@Component({
  selector: 'app-manage-location',
  templateUrl: './manage-location.component.html',
  styleUrls: ['./manage-location.component.scss']
})

export class ManageLocationComponent implements OnInit {

  xls = globals.xls
  displayedColumns = ['first_name', 'service_name', 'street1', 'contact_info', 'action'];
  dataSource: any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private examinerService: ExaminerService,private alertService: AlertService) {

  }

  ngOnInit() {
    this.examinerService.getAllExaminerAddress().subscribe(response => {
      this.dataSource = new MatTableDataSource(response['data']);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
      console.log(response['data'])
    }, error => {
      console.log(error)
    })

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteAddress(id) {
    this.examinerService.deleteExaminerAddress(id).subscribe(response => {
      console.log(response)
      this.alertService.openSnackBar("Location deleted successfully", 'success');

    }, error => {
      console.log(error)
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }


}
