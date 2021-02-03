import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { IntercomService } from 'src/app/services/intercom.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { ClaimService } from '../../service/claim.service';

@Component({
  selector: 'app-search-claim',
  templateUrl: './search-claim.component.html',
  styleUrls: ['./search-claim.component.scss']
})
export class SearchClaimComponent implements OnInit {
  claimCtrl = new FormControl();
  filteredClaimants: any;
  constructor(private claimService: ClaimService, private cookieService: CookieService, private router: Router,
    private intercom: IntercomService) {
    this.claimCtrl.valueChanges
      .pipe(
        debounceTime(300),
      ).subscribe(res => {
        if (!res || (res && res.length < 2 && res != '*')) {
          this.filteredClaimants = []
          return;
        }
        if (res.trim()) {
          this.claimService.searchClaim({ "claimant_search_text": res.trim() }).subscribe(search => {
            this.filteredClaimants = search.data ? search.data : [];
          }, error => {
            console.log(error);
            this.filteredClaimants = []
          })

        }
      });
  }

  ngOnInit() {
  }

  searchClick(source) {
    this.claimCtrl.reset();
    let data = source._source;
    let baseUrl = "";
    let role = this.cookieService.get('role_id')
    switch (role) {
      case '1':
        baseUrl = "/admin";
        break;
      case '2':
        baseUrl = "/subscriber/";
        break;
      case '3':
        baseUrl = "/subscriber/manager/";
        break;
      case '4':
        baseUrl = "/subscriber/staff/";
        break;
      case '11':
        baseUrl = "/subscriber/examiner/";
        break;
      case '12':
        baseUrl = "/subscriber/staff/";
        break;
      default:
        baseUrl = "/";
        break;
    }

    this.intercom.setClaimant(data.clmd_fname + ' ' + data.clmd_lname);
    this.cookieService.set('claimDetails', data.clmd_fname + ' ' + data.clmd_lname)
    this.intercom.setClaimNumber(data.claim_number);
    this.cookieService.set('claimNumber', data.claim_number)

    if (data.claim_id) {
      this.router.navigate([baseUrl + "claimants/claimant/" + data.claimant_id + "/claim/" + data.claim_id + '/new-billable-item/' + true]);
      return;
    }

    // if (data.claimant_id) {
    //   this.router.navigate([baseUrl + "claimants/claimant/" + data.claimant_id]);
    //   return;
    // }

  }



}
