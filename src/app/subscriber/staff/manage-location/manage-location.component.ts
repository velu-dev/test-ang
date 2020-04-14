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
import { Router } from '@angular/router';

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
  constructor(private examinerService: ExaminerService,
    private router: Router,
    private alertService: AlertService) {

  }

  ngOnInit() {
    this.getAddressDetails();

  }

  getAddressDetails() {
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

  deleteAddress(data, index) {
    let details = {
      user_id: data.examiner_id,
      address_id: data.address_id
    }
    this.examinerService.PostDeleteExaminerAddress(details).subscribe(response => {
      console.log(response)
      this.getAddressDetails();
      this.alertService.openSnackBar("Location deleted successfully", 'success');

    }, error => {
      console.log(error)
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  editAddress(data) {
    console.log(data)
    this.router.navigate(['/subscriber/staff/edit-address',data.address_id])
  }


}
