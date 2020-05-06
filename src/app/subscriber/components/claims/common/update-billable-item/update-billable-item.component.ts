import { Component, OnInit, Input } from '@angular/core';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-update-billable-item',
  templateUrl: './update-billable-item.component.html',
  styleUrls: ['./update-billable-item.component.scss']
})
export class UpdateBillableItemComponent implements OnInit {
  displayedColumns: string[] = ['billable_item', 'examiner', 'd_o_s', 'status'];
  dataSource:any ;
  @Input('state') states;
  @Input('claim_id') cliamId;
  constructor(private claimService: ClaimService) { }

  ngOnInit() {
    this.claimService.getbillableItem(this.cliamId).subscribe(billRes => {
      console.log(billRes)
      this.dataSource = new MatTableDataSource(billRes['data'])
    }, error => {
      this.dataSource = new MatTableDataSource([])
    })
  }

}