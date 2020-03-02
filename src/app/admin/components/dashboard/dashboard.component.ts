import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Title } from '@angular/platform-browser';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { UserService } from './../../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import * as globals from '../../../globals';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from 'src/app/shared/model/user.model';

// am4core.useTheme();

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class DashboardComponent implements OnInit {
  xls = globals.xls;
  chart: any;
  roles = [];
  selectedRoleId = [];
  dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isMobile: boolean = false;
  columnName = [];
  columnsToDisplay = [];
  expandedElement: User | null;
  constructor(private breakpointObserver: BreakpointObserver, private title: Title, private userService: UserService) {

    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "First Name"]
        this.columnsToDisplay = ['is_expand', 'first_name']
      } else {
        this.columnName = ["First Name", "Last Name", "Email", "Role"]
        this.columnsToDisplay = ['first_name', 'last_name', 'sign_in_email_id', 'role_name']
      }
    })
    this.title.setTitle("APP | Admin Dashboard")
    this.roles = [];
    this.userService.getRoles().subscribe(response => {
      response.data.map(role => {
        if (!(role.role_name == "Admin")) {
          this.roles.push(role)
          this.selectedRoleId.push(role.id)
        }
      })
      this.getUser(this.selectedRoleId);
      this.roles.map(function (el) {
        var o = Object.assign({}, el);
        o['checked'] = false;
        return o;
      });
      // console.log()
    })
  }
  users = [];
  getUser(roles) {
    this.users = [];
    this.userService.getUsers(roles).subscribe(response => {
      response.data.map(user => {
        user['isExpand'] = false;
        this.users.push(user);
      })
      this.dataSource = new MatTableDataSource(this.users)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
    })
  }

  ngOnInit() {
    this.title.setTitle("Admin Dashboard")
    this.chart = am4core.create("chartdiv", am4charts.XYChart);
         this.chart.paddingRight = 20;
      let data = [];
      let visits = 10;
      for (let i = 1; i < 366; i++) {
        visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
        data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
      }
      this.chart.data = data;
      let dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;
      let series = this.chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";
      series.tooltipText = "{valueY.value}";
      this.chart.cursor = new am4charts.XYCursor();
      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      this.chart.scrollbarX = scrollbarX;
      this.chart = this.chart;
    };
    
    
  openElement(element) {
    if (this.isMobile) {
      element.isExpand = !element.isExpand;
    }
  }
  

}
