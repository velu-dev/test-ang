import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
// am4core.useTheme();

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  chart: any;
  constructor(private title: Title) {
    this.title.setTitle("APP | Admin Dashboard")
  }

  ngOnInit() {
    this.title.setTitle("Admin Dashboard")
    this.chart = am4core.create("chartdiv", am4charts.XYChart);
    this.chart.data = [{
      "date": "2012-03-01",
      "price": 20
    }, {
      "date": "2012-03-02",
      "price": 75
    }, {
      "date": "2012-03-03",
      "price": 15
    }, {
      "date": "2012-03-04",
      "price": 75
    }, {
      "date": "2012-03-05",
      "price": 158
    }, {
      "date": "2012-03-06",
      "price": 57
    }, {
      "date": "2012-03-07",
      "price": 107
    }, {
      "date": "2012-03-08",
      "price": 89
    }, {
      "date": "2012-03-09",
      "price": 75
    }, {
      "date": "2012-03-10",
      "price": 132
    }, {
      "date": "2012-03-11",
      "price": 380
    }, {
      "date": "2012-03-12",
      "price": 56
    }, {
      "date": "2012-03-13",
      "price": 169
    }, {
      "date": "2012-03-14",
      "price": 24
    }, {
      "date": "2012-03-15",
      "price": 147
    }];
    // Create axes
    this.chart.hideCredits = true;
    let dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 50;

    let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.logarithmic = true;
    valueAxis.renderer.minGridDistance = 20;

    this.chart.logo.visibility = false;


    // Create series
    let series = this.chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "price";
    series.dataFields.dateX = "date";
    series.tensionX = 0.8;
    series.strokeWidth = 3;

  }

}
