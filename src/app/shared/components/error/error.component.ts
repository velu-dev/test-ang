import { Component, OnInit, Inject, Input } from '@angular/core';
import { Error } from '../../interfaces/error';
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  @Input() data: Error;

  constructor() { }

  ngOnInit() {
  }
}