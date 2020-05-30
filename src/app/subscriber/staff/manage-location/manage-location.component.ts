import { Component, OnInit, ViewChild } from '@angular/core';
import * as globals from '../../../globals';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, shareReplay } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ExaminerService } from '../../service/examiner.service';
import { MatPaginator } from '@angular/material/paginator';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Router } from '@angular/router';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { trigger, style, state, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-manage-location',
  templateUrl: './manage-location.component.html',
  styleUrls: ['./manage-location.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class ManageLocationComponent implements OnInit {

  xls = globals.xls
  // displayedColumns = ['first_name', 'service_name', 'street1', 'contact', 'action'];
  dataSource: any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );
  columnName = []
  columnsToDisplay = [];
  isMobile = false;
  expandedElement:any;
  constructor(private examinerService: ExaminerService,
    private router: Router,
    public dialog: MatDialog,
    private alertService: AlertService,
    private breakpointObserver: BreakpointObserver) {

    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Examiner Name", "Action"]
        this.columnsToDisplay = ['is_expand', 'first_name', "disabled"]
      } else {
        this.columnName = ["Examiner Name", "Location Type", "Address", "Phone", "Action"]
        this.columnsToDisplay = ['first_name', 'address_type_name', 'street1', 'contact',"disabled"]
      }
    })

  }

  ngOnInit() {
    this.getAddressDetails();

  }

  getAddressDetails() {
    this.examinerService.getAllExaminerAddress().subscribe(response => {
      this.dataSource = new MatTableDataSource(response['data']);
      response['data'].map(details => {
        details.contacts.reverse().map((data, i) => {
          if (data.contact_type != 'E1' && data.contact_type != 'E2' && data.contact_type != 'F1' && data.contact_type != 'F2' && data.contact_info != '') {
            details.contact = data.contact_info;
          }
        })
      })
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
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
  editClaim(e){
    
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

  expandId: any;
  openElement(element) {
    //this.router.navigate(['/subscriber/claims/', element.id])
    if (this.isMobile) {
      this.expandId = element.address_id;
    }
  }

}
