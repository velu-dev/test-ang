import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


export interface PeriodicElement {
  name: string;
  uploaded_on: string;
  action: string;
}
@Component({
  selector: 'app-correspondance',
  templateUrl: './correspondance.component.html',
  styleUrls: ['./correspondance.component.scss']
})
export class CorrespondanceComponent implements OnInit {
  displayedColumns: string[] = ['name', 'uploaded_on', 'action'];
  dataSource = ELEMENT_DATA;
  correspondance: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.correspondance = this.formBuilder.group({
      file: ['', Validators.compose([Validators.required])],
      note: ['']
    });
  }

}
const ELEMENT_DATA: PeriodicElement[] = [
  // { name: '148 - Face - multiple parts any combination of above parts', uploaded_on: '05-04-2020 ', action: ' ' }
];