import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { SubscriberUserService } from '../service/subscriber-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as globals from '../../globals'
import * as  errors from '../../shared/messages/errors'
import { CookieService } from 'src/app/shared/services/cookie.service';
import { ClaimService } from '../service/claim.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { IntercomService } from 'src/app/services/intercom.service';
import { ImageCroppedEvent, base64ToFile, Dimensions } from 'ngx-image-cropper';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { StripeService } from '../service/stripe.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';


/*Treeview*/
interface PaymentHistroy {
  name: string;
  pages: string;
  charges: string;
  children?: PaymentHistroy[];
}
const TREE_DATA: PaymentHistroy[] = [
  // {
  //   name: 'Venkatesan Mariyappan',
  //   pages: '',
  //   charges: '',
  //   children: [
  //     { name: 'Report Generated',pages:'55', charges:'$34578.00' },
  //     { name: 'Report Generated',pages:'55', charges:'$34578.00' },
  //     { name: 'Report Generated',pages:'55', charges:'$34578.00' },
  //     { name: 'Report Generated',pages:'55', charges:'$34578.00' }
  //   ]
  // },
  {
    name: 'Examiner : Rajan Mariappan',
    pages: '',
    charges: '$795.60',
    children: [
      {
        name: 'Subscription Charges',
        pages: '',
        charges: '$525',
        children: [
          { name: '$2.50 postage per packet per recipient', pages: '', charges: '$250.0' },
          { name: '$0.10 per extra page in packet greater than 10 pages', pages: '', charges: '$250.0' }
        ]
      }, {
        name: 'SimpleService™ Charges',
        pages: '',
        charges: '$423',
        children: [
          {
            name: 'Correspondence', pages: '', charges: '$250.0',
            children: [
              { name: '$2.50 postage per packet per recipient', pages: '4 items', charges: '$250.0' },
              { name: '$0.10 per extra page in packet greater than 10 pages', pages: '8 items', charges: '$250.0' }

            ]
          },
          {
            name: 'History', pages: '', charges: '$250.0',
            children: [
              { name: '$2.50 postage per packet per recipient', pages: '4 items', charges: '$250.0' },
              { name: '$0.10 per extra page in packet greater than 10 pages', pages: '8 items', charges: '$250.0' }

            ]
          },
        ]
      },
    ]
  },
  {
    name: 'Examiner : Venkatesan Mariyappan',
    pages: '',
    charges: '$795.60',
    children: [
      {
        name: 'Subscription Charges',
        pages: '',
        charges: '$525',
        children: [
          { name: '$2.50 postage per packet per recipient', pages: '', charges: '$250.0' },
          { name: '$0.10 per extra page in packet greater than 10 pages', pages: '', charges: '$250.0' }
        ]
      }, {
        name: 'SimpleService™ Charges',
        pages: '',
        charges: '$423',
        children: [
          {
            name: 'Correspondence', pages: '', charges: '$250.0',
            children: [
              { name: '$2.50 postage per packet per recipient', pages: '4 items', charges: '$250.0' },
              { name: '$0.10 per extra page in packet greater than 10 pages', pages: '8 items', charges: '$250.0' }

            ]
          },
          {
            name: 'History', pages: '', charges: '$250.0',
            children: [
              { name: '$2.50 postage per packet per recipient', pages: '4 items', charges: '$250.0' },
              { name: '$0.10 per extra page in packet greater than 10 pages', pages: '8 items', charges: '$250.0' }

            ]
          },
        ]
      },
    ]
  },
];
/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
export interface PeriodicElement {
  credit_card: string;
}
declare var Stripe: any;
const ELEMENT_DATA: PeriodicElement[] = [
  { credit_card: 'AmericanExpress card ending in 1234' },
  { credit_card: 'Visa card ending in 1234' },
];
@Component({
  selector: 'app-subscribersettings',
  templateUrl: './subscriber-settings.component.html',
  styleUrls: ['./subscriber-settings.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SubscriberSettingsComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  dataSource: any = new MatTableDataSource([]);
  columnsToDisplay = [];
  expandedElement;
  isMobile = false;
  columnName = [];
  card: any;
  cardHandler = this.onChange.bind(this);
  cardError: string;
  stripe: any;
  elements: any;
  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;
  profile_bg = globals.profile_bg;
  user: any;
  currentUser: any;
  userForm: FormGroup;
  userPasswrdForm: FormGroup;
  errorMessages = errors
  disableCompany: boolean = true;
  taxonomyList: any;
  billing_address: boolean = false;
  addressForm: FormGroup;
  billingForm: FormGroup;
  states: any;
  filteredTexonamy: Observable<any[]>;
  texoCtrl = new FormControl();
  texoDetails = [];
  first_name: string;
  signData: any;
  selectedFile: any = null;
  isSubmitted = false;
  myControl = new FormControl();
  options: string[] = ['AmericanExpress card ending in 1234', 'Visa card ending in 1234'];
  displayedColumns: string[] = ['card_img', 'credit_card', 'default_card', 'action'];
  cardDataSource: any;
  isAddCreditCard: boolean = false;
  editingCard: any;
  @ViewChild('cardInfo', { static: false }) cardInfo: ElementRef;
  months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  years = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040]
  /* Tree view */
  private _transformer = (node: PaymentHistroy, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      pages: node.pages,
      charges: node.charges,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSourceList = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  /* Tree view end */

  constructor(
    private spinnerService: NgxSpinnerService,
    private userService: SubscriberUserService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private cognitoService: CognitoService,
    private cookieService: CookieService,
    //private store: Store<{ count: number }>,
    private claimService: ClaimService,
    public _location: Location,
    private intercom: IntercomService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private stripeService: StripeService,
    private cd: ChangeDetectorRef
  ) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Invoice Number", "Action"]
        this.columnsToDisplay = ['is_expand', 'invoice_number', "disabled"]
      } else {
        this.columnName = ["Invoice Number", "Amount", "Status", "Date", "Action"]
        this.columnsToDisplay = ['invoice_number', 'amount', "status", "date", "action",]
      }
    })
    this.listCard();
    this.userService.getProfile().subscribe(res => {
      console.log("res obj", res)
      this.user = res.data;
      if (res.data.organization_type == 'INDV') {
        res.data.company_name = '';
      }
      let userDetails;
      this.first_name = res.data.first_name;
      if (res.data.role_id == 2) {
        this.disableCompany = false;
        userDetails = {
          id: res.data.id,
          role_id: res.data.role_id,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          middle_name: res.data.middle_name,
          suffix: res.data.suffix,
          company_name: res.data.company_name,
          sign_in_email_id: res.data.sign_in_email_id,
          county: res.data.county,
        }
      } else {
        userDetails = {
          id: res.data.id,
          role_id: res.data.role_id,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          middle_name: res.data.middle_name,
          suffix: res.data.suffix,
          company_name: res.data.company_name,
          sign_in_email_id: res.data.sign_in_email_id,
          county: res.data.county,
        }
      }
      this.signData = res.data.signature ? 'data:image/png;base64,' + res.data.signature : null
      this.userForm.patchValue(userDetails)
    })
    this.dataSourceList.data = TREE_DATA;/* Tree view */
  }
  cardCount = 0;
  listCard() {
    this.stripeService.listCard().subscribe(res => {
      this.cardDataSource = new MatTableDataSource(res.data)
      this.cardCount = res.data.length;
    }, error => {
      // this.alertService.openSnackBar(error.error.message, 'error');
      if (!error.error.status) {
        this.cardDataSource = new MatTableDataSource([])
        this.cardCount = [].length;
      }
    })
  }
  isViewInit: boolean = false;
  ngAfterViewInit() {
    this.isViewInit = true;
  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  billings: FormGroup;
  ngOnInit() {
    this.billings = this.formBuilder.group({
      // address: { city: "", country: "US", line1: "", line2: "", state: null, postal_code: "" },
      name: ["", Validators.compose([Validators.required])],
      email: ["", Validators.compose([Validators.email])],
      phone: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      exp_month: [""],
      exp_year: [""],
      default: [false],
      // address: this.formBuilder.group({
      address_city: [""],
      address_line1: [""],
      address_line2: [""],
      address_state: [""],
      address_zip: [""],
      address_country: ["US"]
      // })
    })
    let user = JSON.parse(this.cookieService.get('user'));
    this.currentUser = user;
    this.userPasswrdForm = this.formBuilder.group({
      current_password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$*.{}?"!@#%&/,><\':;|_~`^\\]\\[\\)\\(]).{8,}'), Validators.minLength(8)])],
      new_password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$*.{}?"!@#%&/,><\':;|_~`^\\]\\[\\)\\(]).{8,}'), Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$*.{}?"!@#%&/,><\':;|_~`^\\]\\[\\)\\(]).{8,}'), Validators.minLength(8)])]
    })

    if (user.role_id == 2) {
      this.userForm = this.formBuilder.group({
        id: [''],
        first_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
        last_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
        middle_name: ['', Validators.compose([Validators.maxLength(50)])],
        suffix: ['', Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z.,/ ]{0,15}$')])],
        company_name: [''],
        sign_in_email_id: [{ value: "", disabled: true }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
        signature: [''],
        county: [''],
        is_new_signature: [false]
      });

    } else {
      this.userForm = this.formBuilder.group({
        id: [''],
        first_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
        last_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
        middle_name: ['', Validators.compose([Validators.maxLength(50)])],
        suffix: ['', Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z.,/ ]{0,15}$')])],
        sign_in_email_id: [{ value: "", disabled: true }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
        signature: [''],
        county: [''],
        is_new_signature: [false]
      });
    }

    this.claimService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
    })

  }

  selectedTabChange(event) {
  }
  isAddingCard = false;
  publicKey: any;
  addCard() {
    this.billings.controls['address_zip'].setValidators(null);
    this.billings.controls['address_zip'].updateValueAndValidity();
    if (this.cardCount >= 5) {
      this.alertService.openSnackBar("Maximum number of cards per Subscriber is 5 only", "error")
      return
    }
    this.isUpdate = false;
    this.hideCard = false;
    this.stripeService.getPK().subscribe(res => {
      this.isAddCreditCard = true;
      this.publicKey = res.token;
      this.initiateCardElement(res.token);
    })
  }
  isUpdate: boolean = false;
  editCard(card, index) {
    this.isUpdate = true;
    this.editingCard = card;
    this.isAddCreditCard = true;
    this.changeState(card.address_state)
    this.billings.controls['address_zip'].setValidators([Validators.compose([Validators.required, Validators.pattern('^[0-9]{5}?$')])]);
    this.billings.patchValue(card);
    if (index == 0) {
      this.billings.get('default').disable();
      this.billings.patchValue({ default: true })
    } else {
      this.billings.patchValue({ default: false })
    }
  }
  onChange({ error }) {
    if (error) {
      this.cardError = error.message;
    } else {
      this.cardError = null;
    }
    this.cd.detectChanges();
  }
  initiateCardElement(token) {
    this.stripe = Stripe(token); // use your test publishable key
    this.elements = this.stripe.elements();
    // Giving a base style here, but most of the style is in scss file
    const cardStyle = {
      base: {
        color: '#32325d',
        fontFamily: 'lato',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };
    this.card = this.elements.create('card', { style: cardStyle });
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
    // this.card.blur();
    // document.getElementsByName("cvc")[0].type = 'password';
  }
  showImage(type) {
    if (type == 'Visa') {
      return globals.visa_card
    }
    if (type == "MasterCard") {
      return globals.mastercard_card;
    }
    if (type == "American Express") {
      return globals.amex_card;
    }
    if (type == "Discover") {
      return globals.discover_card;
    }
    if (type == "UnionPay") {
      return globals.unionpay_card;
    }
    if (type == "JCB") {
      return globals.jcb_card;
    }
    if (type == "Diners Club") {
      return globals.diners_club_card;
    }
  }
  isCardSubmit = false;
  async createStripeToken() {
    Object.keys(this.billings.controls).forEach((key) => {
      if (this.billings.get(key).value && typeof (this.billings.get(key).value) == 'string')
        this.billings.get(key).setValue(this.billings.get(key).value.trim());
    });
    if (!this.billings.valid) {
      this.alertService.openSnackBar("Please fill all required fields", "error");
      return
    }
    if (this.isUpdate) {
      this.updateCard();
      return
    }
    this.isAddingCard = true;
    this.isCardSubmit = true;
    let billingData = this.billings.value;
    for (var propName in billingData) {
      if (billingData[propName] === null || billingData[propName] === "") {
        delete billingData[propName];
      }
    }
    let data = {
      type: 'card',
      card: this.card,
      billing_details: billingData,
    }
    this.stripe.createToken(this.card, {
      name: this.billings.value.name,
      address_line1: this.billings.value.address_line1,
      address_line2: this.billings.value.address_line2,
      address_city: this.billings.value.address_city,
      address_state: this.billings.value.address_state,
      address_zip: this.billings.value.address_zip,
      address_country: this.billings.value.address_country
    }).then(res => {
      if (res.token) {
        this.stripeService.createCard({ card_token: res.token.id, default: this.billings.value.default }).subscribe(card => {
          this.listCard();
          this.hideCard = true;
          this.billings.reset();
          this.isAddCreditCard = false;
          this.isAddingCard = false;
        }, error => {
          this.alertService.openSnackBar(error.error.message, "error")
        })
      } else {
        this.isAddingCard = false;
        this.alertService.openSnackBar(res.error.message, "error")
      }
    }).catch(error => {
      this.isAddingCard = false;
      this.alertService.openSnackBar(error.message, "error")
    })
    // this.stripe.createPaymentMethod(data).then(res => {
    //   if (res.paymentMethod) {
    //     this.isCardSubmit = false;
    //     this.onSuccess(res);
    //   }
    //   if (res.error) {
    //     this.onError(res);
    //   }
    // });
  }
  cardState: any;
  changeState(state_code?) {
    if (state_code) {
      this.cardState = state_code;
      return
    }
  }
  hideCard = false;
  cancleAddCard() {
    this.hideCard = true;
    this.billings.reset();
    this.isAddCreditCard = false;
  }
  updateCard() {
    let card = {
      id: this.editingCard.id,
      name: this.billings.value.name,
      address_line1: this.billings.value.address_line1,
      address_line2: this.billings.value.address_line2,
      address_city: this.billings.value.address_city,
      address_state: this.billings.value.address_state,
      address_zip: this.billings.value.address_zip,
      address_country: this.billings.value.address_country,
      default: this.billings.value.default,
      "customer": this.editingCard.customer,
      "exp_month": this.billings.value.exp_month,
      "exp_year": this.billings.value.exp_year,
    }
    this.stripeService.updateCard(card).subscribe(res => {
      this.alertService.openSnackBar(res.message, "success");
      this.listCard();
      this.isAddCreditCard = false;
      this.billings.reset();
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error");
    })
  }
  deleteCard(card) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: 'remove this card', address: true, title: (card.brand + " card ending in " + card.last4) }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.stripeService.deleteCard(card).subscribe(res => {
          this.alertService.openSnackBar(res.message, "success");
          this.listCard()
        }, error => {
          this.alertService.openSnackBar(error.error.message, "error")
        })
      }
    })
  }
  updateCustomer(card) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: 'make default', address: true, title: (card.brand + " card ending in " + card.last4) }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.stripeService.updateCustomer({ customer_id: card.customer, default_source: card.id }).subscribe(res => {
          this.alertService.openSnackBar(res.message, "success");
          this.listCard()
        }, error => {
          this.alertService.openSnackBar(error.error.message, "error")
        })
      }
    })
  }
  onSuccess(token) {
    this.stripeService.createPaymentIntent(token.paymentMethod.id).subscribe(res => {
      if (res.data.status == "succeeded") {
        // alert("Success");
        this.alertService.openSnackBar("Card added", 'success');
        this.isAddCreditCard = false;
      } else {
        this.stripe.confirmCardPayment(res.data.client_secret, {
          // type: 'card',
          payment_method: {
            card: this.card,
            billing_details: this.billings.value
          }
        }).then(res => {
          console.log(res)
          // if (res.paymentMethod) {
          //   // this.onSuccess(res);
          // }
          // if (res.error) {
          //   this.onError(res);
          // }
        })
      }
    })
    // this.dialogRef.close({token});
  }
  onError(error) {
    console.log(error)
    if (error.message) {
      this.cardError = error.message;
    }
  }
  ngOnDestroy() {
    if (this.card) {
      this.card.removeEventListener('change', this.cardHandler);
      this.card.destroy();
    }

  }
  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      if (this.expandId && this.expandId == element.id) {
        this.expandId = null;
      } else {
        this.expandId = element.id;
      }
    }
  }


  userformSubmit() {
    if (this.user.role_id == 2) {
      console.log(this.user)
      if (this.user.organization_type == 'INDV') {
        this.userForm.get('company_name').setValidators([Validators.maxLength(100)]);
      } else {
        this.userForm.get('company_name').setValidators([Validators.compose([Validators.required, Validators.maxLength(100)])]);
      }
      this.userForm.get('company_name').updateValueAndValidity();
    }
    Object.keys(this.userForm.controls).forEach((key) => {
      if (this.userForm.get(key).value && typeof (this.userForm.get(key).value) == 'string')
        this.userForm.get(key).setValue(this.userForm.get(key).value.trim())
    });
    this.isSubmit = true;
    if (this.userForm.invalid) {
      window.scrollTo(0, 0);
      return;
    }
    let sign = this.signData ? this.signData.replace('data:image/png;base64,', '') : '';
    this.userForm.value.signature = sign;
    this.userService.updateSubsciberSetting(this.userForm.value).subscribe(res => {
      this.alertService.openSnackBar("Profile updated successfully", 'success');
      this.signData = res.data.signature ? 'data:image/png;base64,' + res.data.signature : null;
      this.isSubmit = false;
      this.intercom.setUser(true);
    }, error => {
      this.isSubmit = false;
      console.log(error.error.message)
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }
  isTypePassword = true;
  changeInputType() {
    this.isTypePassword = !this.isTypePassword
  }
  isSubmit = false;
  changePassword() {
    this.isSubmit = true;
    if (this.userPasswrdForm.invalid) {
      return;
    }
    if (!(this.userPasswrdForm.value.new_password == this.userPasswrdForm.value.confirmPassword)) {
      this.alertService.openSnackBar(this.errorMessages.passworddidnotMatch, "error");
      return
    }
    this.spinnerService.show();
    this.cognitoService.getCurrentUser().subscribe(user => {
      console.log(user)
      this.cognitoService.changePassword(user, this.userPasswrdForm.value.current_password, this.userPasswrdForm.value.new_password).subscribe(res => {
        this.alertService.openSnackBar("Password successfully changed", "success");
        this.cognitoService.logOut().subscribe(res => {
          this.spinnerService.hide();
          this.isSubmit = false;
          this.router.navigate(['/'])
        })
      }, error => {
        this.spinnerService.hide();
        if (error.code == 'NotAuthorizedException') {
          error.message = this.errorMessages.oldpasswordworng;
        }
        this.alertService.openSnackBar(error.message, "error");
      })
    })
  }

  cancel() {
    this.router.navigate(["/"])
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  fileChangeEvent(event: any): void {
    let fileName = event.target.files[0].name;
    let fileTypes = ['png', 'jpg', 'jpeg']
    if (fileTypes.includes(event.target.files[0].name.split('.').pop().toLowerCase())) {
      var FileSize = event.target.files[0].size / 1024 / 1024; // in MB
      if (FileSize >= 3.5) {
        this.fileUpload.nativeElement.value = "";
        //this.alertService.openSnackBar("File size is too large", 'error');
        let title = 'Selected Signature File : "' + fileName + '" file size is ' + FileSize + 'MB is too large.'
        this.openDialog(title, 'File size should be upto 3MB !')
        return;
      }
      this.selectedFile = event.target.files[0].name;
      this.openSign(event);
    } else {
      this.selectedFile = null;
      this.fileUpload.nativeElement.value = "";
      //this.alertService.openSnackBar("This file type is not accepted", 'error');
      this.openDialog('This file type is not accepted', 'Supported File Formats are JPEG/JPG/PNG !')
    }
  }

  openSign(e): void {
    const dialogRef = this.dialog.open(SignPopupComponent, {
      width: '800px',
      data: e,

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == null) {
        this.selectedFile = null
        this.signData = this.user['signature'] ? 'data:image/png;base64,' + this.user['signature'] : result;

      } else {
        this.userForm.patchValue({ is_new_signature: true })
        this.signData = result;
      }
      console.log(this.signData)
      this.fileUpload.nativeElement.value = "";
    });
  }

  removeSign() {
    this.signData = null;
    this.selectedFile = null;
  }

  openDialog(title, subTitle) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '450px',
      data: { title: title, subTitle: subTitle }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result['data']) {
    //   }
    // });
  }

}

@Component({
  selector: 'sign-dialog',
  templateUrl: '../sign-dialog.html',
})
export class SignPopupComponent {
  imageChangedEvent: any = '';
  showCropper = false;
  croppedImage: any = '';
  finalImage: any;
  constructor(
    public dialogRef: MatDialogRef<SignPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private alertService: AlertService,) {
    this.imageChangedEvent = data;
    dialogRef.disableClose = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  save() {
    this.finalImage = this.croppedImage;
    this.dialogRef.close(this.finalImage);
  }

  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }

  cancel() {
    this.finalImage = null;
    this.dialogRef.close(this.finalImage);
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    console.log('Load failed');
    this.alertService.openSnackBar("This file load failed, Please try again", 'error');
  }

  cancelClick(): void {
    this.dialogRef.close();
  }

}
