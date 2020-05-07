import { Component, OnInit, Input } from '@angular/core';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-billable-item',
  templateUrl: './update-billable-item.component.html',
  styleUrls: ['./update-billable-item.component.scss']
})
export class UpdateBillableItemComponent implements OnInit {
  displayedColumns: string[] = ['billable_item', 'examiner', 'd_o_s', 'status'];
  dataSource:any ;
  @Input('state') states;
  @Input('claim_id') claimId;
  @Input('claimant_id') claimantId;

  
  constructor(private claimService: ClaimService,private router:Router) { }

  ngOnInit() {
    this.claimService.getbillableItem(this.claimId).subscribe(billRes => {
      console.log(billRes)
      this.dataSource = new MatTableDataSource(billRes['data'])
    }, error => {
      this.dataSource = new MatTableDataSource([])
    })
  }


  navigateBillableEdit(){
    this.router.navigate(['/subscriber/new-billable-item',this.claimId,this.claimantId,''])
  }


}