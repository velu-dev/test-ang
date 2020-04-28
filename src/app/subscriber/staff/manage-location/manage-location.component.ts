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
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-location',
  templateUrl: './manage-location.component.html',
  styleUrls: ['./manage-location.component.scss']
})

export class ManageLocationComponent implements OnInit {

  xls = globals.xls
  displayedColumns = ['first_name', 'service_name', 'street1', 'contact', 'action'];
  dataSource: any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private examinerService: ExaminerService,
    private router: Router,
    public dialog: MatDialog,
    private alertService: AlertService) {

  }

  ngOnInit() {
    this.getAddressDetails();

  }

  getAddressDetails() {
    this.examinerService.getAllExaminerAddress().subscribe(response => {
      this.dataSource = new MatTableDataSource(response['data']);
      response['data'].map(details=>{
        details.contacts.reverse().map((data,i)=>{
        if(data.contact_type != 'E1' && data.contact_type != 'E2' && data.contact_type != 'F1' && data.contact_type != 'F2' && data.contact_info != ''){
          details.contact = data.contact_info;
          console.log( details.contact)
        }
      })
    })
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
    this.openDialog('delete', data);
  }

  editAddress(data) {
    console.log(data)
    this.router.navigate(['/subscriber/staff/edit-address', data.examiner_id, data.address_id])
  }

  openDialog(dialogue, data) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '350px',
      data: { name: dialogue, address: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
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
    })


  }

}
