import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ExportService } from './../../../shared/services/export.service';
import * as globals from '../../../globals';
import { Role } from '../../models/role.model';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { AlertService } from 'src/app/shared/services/alert.service';
import * as  success from '../../../shared/messages/success'
@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class VendorsComponent implements OnInit {
  screenWidth: number;
  xls = globals.xls;
  roles: Role[];
  selectedRole: any = [];
  dataSource: any;
  columnName = ["First Name", "Last Name", "Email", "Role", "Action"]
  columnsToDisplay = ['first_name', 'last_name', 'sign_in_email_id', 'role_name', "action"];
  expandedElement: User | null;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isMobile: boolean = false;
  checked = true;
  filterAll = false;
  selectedFile: File = null;
  allUser: any;
  filterValue : string;
  @ViewChild('uploader', { static: true }) fileUpload: ElementRef;
  constructor(
    private userService: UserService,
    private router: Router,
    private title: Title,
    private exportService: ExportService,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private alertService: AlertService,
  ) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "First Name", "Disable", "Action"]
        this.columnsToDisplay = ['is_expand', 'first_name', "disabled", "action"]
      } else {
        this.expandId = "";
        this.columnName = ["First Name", "Last Name", "Email", "Role", "Disabled", "Action"]
        this.columnsToDisplay = ['first_name', 'last_name', 'sign_in_email_id', 'role_name', "disabled", "action"]
      }
    });
    this.screenWidth = window.innerWidth;
    this.title.setTitle("APP | Manage User");
    this.roles = [];
    this.userService.getVendorRole().subscribe(response => {
      response.data.map(role => {
        if (!(role.role_name == "Admin")) {
          this.roles.push(role)
          this.selectedRoleId.push(role.id)
        }
      })
      this.tabName = 'activeUsers'
      this.getUser(this.selectedRoleId, this.tabName);
      this.roles.map(function (el) {
        var o = Object.assign({}, el);
        o['checked'] = false;
        return o;
      });
      // console.log()
    })
    window.onresize = () => {
      this.screenWidth = window.innerWidth;
    };
  }

  ngOnInit() {
  }
  users = [];
  getUser(roles, status) {
    this.users = [];
    this.allUser = [];
    this.userService.getVendors(roles, status).subscribe(response => {
      this.allUser = response;
      if (status == 'invitedUsers') {
        this.tabchange(1)
      } else if (status == 'disabledUsers') {
        this.tabchange(2)
      } else {
        this.tabchange(0)
      }

    }, error => {
    })
  }
  tabName: string;
  tabchange(event) {
    this.filterValue = '';
    this.selectedRoleId = [];
    this.dataSource = [];
    this.users = [];
    this.tabName = ''
    if (event == 0) {
      this.tabName = 'activeUsers'
    } else if (event == 1) {
      this.tabName = 'invitedUsers'
    } else if (event == 2) {
      this.tabName = 'disabledUsers'
    }
    this.users = this.allUser[this.tabName];
    this.dataSource = new MatTableDataSource(this.users)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  gotoEdit(data) {
    this.router.navigate(["/admin/users/" + data.id])

  }
  gotoDelete(data) {
    // this.router.navigate(["/admin/admin-users/" + data.id])
    this.openDialog('delete', data);
  }
  selectedRoleId = []
  filterByRole(value?: string) {
    this.selectedRoleId = [];
    this.roles.map(res => {
      if (value) {
        this.filterAll ? res['checked'] = true : res['checked'] = false
        this.selectedRoleId.push(res.id)
      } else {
        this.filterAll = false;
        if (res['checked']) {
          this.selectedRoleId.push(res.id);
        }
      }
    })
    this.getUser(this.selectedRoleId, this.tabName)
  }
  navigate() {
    this.router.navigate(['/admin/vendor/new'])
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  exportData() {
    let data = [];
    this.users.map(res => {
      data.push({
        "First Name": res.first_name,
        "Last Name": res.last_name,
        "Email ID": res.sign_in_email_id,
        "Role ID": res.role_name
      })
    })
    this.exportService.exportExcel(data, "Non-Admin-Users")
  }
  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
    }
  }
  onDisable(data, id) {
    if (data.checked) {
      this.openDialog('enable', id);
    } else {
      this.openDialog('disable', id);
    }
  }
  openDialog(dialogue, data) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '350px',
      data: { name: dialogue }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        alert("Deleted")
      } else {
        alert("Cancled")
      }
    });
  }


  uploadFile(event) {
    this.selectedFile = event.target.files[0];
    let formData = new FormData()
    formData.append('file', this.selectedFile)
    console.log("formData", formData)
    this.userService.uploadUserCsv(formData).subscribe(CSVRes => {
      this.alertService.openSnackBar(success.fileupload, 'success');
      this.fileUpload.nativeElement.value = "";
      this.getUser(this.selectedRoleId, this.tabName);
    }, error => {
      console.log('error', error)
      this.fileUpload.nativeElement.value = "";
      this.alertService.openSnackBar(error.error.error, 'error');
    })

  }
}
