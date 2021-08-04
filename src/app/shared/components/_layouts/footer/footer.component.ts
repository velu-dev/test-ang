import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input('footerFrom') footerFrom;
  date: Date = new Date();
  termsOfService = 'https://simplexam.com/terms-of-service/';

  constructor() {
  }

  ngOnInit() {
  }

}
