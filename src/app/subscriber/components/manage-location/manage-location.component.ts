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
import { SubscriberService } from '../../service/subscriber.service';
import { RegulationDialogueComponent } from 'src/app/shared/components/regulation-dialogue/regulation-dialogue.component';
import { UserService } from 'src/app/shared/services/user.service';

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
  expandedElement: any;
  constructor(private examinerService: ExaminerService,
    public router: Router,
    public dialog: MatDialog,
    private alertService: AlertService,
    private subscriberService: SubscriberService,
    private breakpointObserver: BreakpointObserver,
    private userService: UserService) {

    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Examiner", "Status"]
        this.columnsToDisplay = ['is_expand', 'examiner_name', "status"]
      } else {
        this.columnName = ["Location Name", "Address", "Service Type", "Phone", "Examiner", "Status"]
        this.columnsToDisplay = ['service_name', 'street1', 'service', 'phone_no', 'examiner_name', "status"]
      }
    })
  }

  ngOnInit() {
    this.getAddressDetails();

  }

  getAddressDetails() {
    this.subscriberService.getLocationDetails().subscribe(response => {
      this.dataSource = new MatTableDataSource(response['data']);
      response['data'].map(data => {
        data.status = data.is_active == true ? 'Active' : 'Inactive';
        data.examiner_name = data.examiner != null ? data.examiner[0].last_name + ' ' + data.examiner[0].first_name + '' + (data.examiner[0].suffix ? ', ' + data.examiner[0].suffix : '') : null;
        data.service = data.service_name ? data.service_code + ' - ' + data.service_name : '';
        data.service_name = data.service_location_name;
      })
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
      this.dataSource.filterPredicate = function (data, filter: string): boolean {
        return (data.service_name && data.service_name.toLowerCase().includes(filter)) || (data.service && data.service.toLowerCase().includes(filter)) || (data.phone_no && data.phone_no.includes(filter)) || (data.street1 && data.street1.toLowerCase().includes(filter)) || (data.street2 && data.street2.toLowerCase().includes(filter)) || (data.city && data.city.toLowerCase().includes(filter)) || (data.state_name && data.state_name.toLowerCase().includes(filter)) || (data.zip_code && data.zip_code.includes(filter)) || (data.examiner_name && data.examiner_name.toLowerCase().includes(filter)) || (data.service_code && data.service_code.toString().toLowerCase().includes(filter)) || (data.status && data.status.toLowerCase().includes(filter));
      };
    }, error => {
      console.log(error)
      this.dataSource = new MatTableDataSource([]);
    })

    // this.examinerService.getAllExaminerAddress().subscribe(location => {
    //   console.log(location)
    // })
  }

  applyFilter(filterValue) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteAddress(data, index) {
    this.openDialog('delete', data);
  }

  editAddress(data) {
    console.log(data)
    //this.router.navigate(['/subscriber/location/edit-location', data.examiner_id, data.address_id])
    this.router.navigate([this.router.url + '/edit-location', data.id])
  }
  editClaim(e) {

  }

  openPopup() {
    let data = this.userService.getRegulation(["5", "6", "8", "9", "10"])
    const dialogRef = this.dialog.open(RegulationDialogueComponent, {
      width: '1000px',
      data: { title: "Regulations for service locations", regulations: data },
      panelClass: 'info-regulation-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
    })
  }
  openDialog(dialogue, data) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
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
    if (this.isMobile)
      if (this.expandId && this.expandId == element.id) {
        this.expandId = null;
      } else {
        this.expandId = element.id;
      }
  }

}
