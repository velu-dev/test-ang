import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-billing-timeline',
  templateUrl: './billing-timeline.component.html',
  styleUrls: ['./billing-timeline.component.scss']
})
export class BillingTimelineComponent implements OnInit {

  mode = 'determinate';
  bufferValue = 75;
  checked1 = true;
  color1 = 'primary';
  value1 = 100;
  checked2 = true;
  color2 = 'primary';
  value2 = 100;
  checked3 = true;
  color3 = 'primary';
  value3 = 100;
  checked4 = false;
  color4 = '';
  value4 = 0;
  checked5 = false;
  color5 = '';
  value5 = 0;
  selectedEventColor = "#1991B9";

  constructor() { }

  ngOnInit() { }
}