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
import { startWith, map, debounceTime } from 'rxjs/operators';
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
import { saveAs } from 'file-saver';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { EMAIL_REGEXP } from '../../globals';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { OnDemandService } from '../service/on-demand.service';

/*Treeview*/
interface PaymentHistroy {
  id?: number;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  suffix?: string;
  name?: string;
  pages: any;
  charges: any;
  claimant_id: "",
  claim_id: "",
  billable_item_id: "",
  request_reference_id?: number;
  lines?: any;
  extra_units_charged?: any;
  no_of_units_charged?: any;
  examiner_id: any;
  bill_id: any;
  children?: PaymentHistroy[];
}
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
  role = this.cookieService.get('role_id')
  /* Tree view */
  private _transformer = (node: PaymentHistroy, level: number) => {
    let name = node.name ? node.name : node.first_name
    return {
      expandable: !!node.children && node.children.length > 0,
      name: name,
      pages: node.pages,
      charges: node.charges,
      claimant_id: node.claimant_id,
      claim_id: node.claim_id,
      examiner_id: node.examiner_id,
      billable_item_id: node.billable_item_id,
      bill_id: node.bill_id,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSourceList = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  /* Tree view end */
  @ViewChild('tree', { static: false }) tree;
  subscriptionCharges = [];
  currentMonth = new Date().getMonth();
  selectedMonth: any;
  roleId: any;
  selectedDate = "";
  month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];



  isDropZoneActive = false;
  imageSource = "";
  textVisible = true;
  progressVisible = false;
  progressValue = 0;
  isMultiline: boolean = true;


  value: any[] = [];


  streetAddressList = [];
  isAddressError = false;
  isAddressSearched = false;
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
    private cd: ChangeDetectorRef,
    private onDemandService: OnDemandService
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
    this.claimService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
    })
    this.listCard();
    this.userService.getProfile().subscribe(res => {
      this.user = res.data;
      if (res.data.organization_type == 'INDV') {
        res.data.company_name = '';
      }
      let userDetails;
      this.first_name = res.data.first_name;
      this.roleId = res.data.role_id
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
    // this.dataSourceList.data = TREE_DATA

    this.onDropZoneEnter = this.onDropZoneEnter.bind(this);
    this.onDropZoneLeave = this.onDropZoneLeave.bind(this);
    this.onUploaded = this.onUploaded.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onUploadStarted = this.onUploadStarted.bind(this);


  }
  onDropZoneEnter(e) {
    if (e.dropZoneElement.id === "dropzone-external")
      this.isDropZoneActive = true;
  }

  onDropZoneLeave(e) {
    if (e.dropZoneElement.id === "dropzone-external")
      this.isDropZoneActive = false;
  }

  onUploaded(e) {
    const file = e.file;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.isDropZoneActive = false;
      this.imageSource = fileReader.result as string;
    }
    fileReader.readAsDataURL(file);
    this.textVisible = false;
    this.progressVisible = false;
    this.progressValue = 0;
  }

  onProgress(e) {
    this.progressValue = e.bytesLoaded / e.bytesTotal * 100;
  }

  onUploadStarted(e) {
    this.imageSource = "";
    this.progressVisible = true;
  }
  submit() {
    console.log(this.value)
    this.claimService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
    })
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
  isDataAvailable = false;
  paymentData: any;
  getHistory(date) {
    this.selectedMonth = new Date(date).getMonth();
    this.userService.getPaymentHistory(date).subscribe(res => {
      this.isDataAvailable = true;
      this.paymentData = res.data;
      this.isExpanded = false;
      //this.alertService.openSnackBar(res.message, 'success');
      this.dataSourceList.data = res.data.data;/* Tree view */
    }, error => {
      this.isDataAvailable = false;
      // this.alertService.openSnackBar(error.error.message, 'error');
      this.dataSourceList.data = [];/* Tree view */
      this.paymentData = {};
    })
  }
  downloadCSV() {
    this.userService.downloadCSV(this.selectedDate).subscribe(res => {
      saveAs(res.data.file_url, res.data.file_name, '_self');
    }, error => {
      this.alertService.openSnackBar(error.error.error, "error")
    })
  }
  isExpanded = false;
  expandAll() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.treeControl.expandAll();
    } else {
      this.isExpanded = false;
      this.treeControl.collapseAll();
    }
  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  billings: FormGroup;
  subscriberAddress: FormGroup;
  ngOnInit() {
    this.billings = this.formBuilder.group({
      name: ["", Validators.compose([Validators.required, Validators.pattern("^(?=.*?[A-z])[a-zA-Z\-,. ]+")])],
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
    this.subscriberAddress = this.formBuilder.group({
      id: [null],
      street1: [null],
      street2: [null],
      city: [null],
      state_id: [null],
      zip_code: [null, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      phone_no1: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      phone_ext1: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
      phone_no2: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      phone_ext2: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
      fax_no: null,
      email: [null, Validators.compose([Validators.email, Validators.pattern(EMAIL_REGEXP)])],
      contact_person: [null],
      notes: [null]
    })
    this.getAddress();
    this.subscriberAddress.get("phone_no1").valueChanges.subscribe(res => {
      if (this.subscriberAddress.get("phone_no1").value && this.subscriberAddress.get("phone_no1").valid) {
        this.subscriberAddress.get("phone_ext1").enable();
      } else {
        this.subscriberAddress.get("phone_ext1").reset();
        this.subscriberAddress.get("phone_ext1").disable();
      }
    })
    this.subscriberAddress.get("phone_no2").valueChanges.subscribe(res => {
      if (this.subscriberAddress.get("phone_no2").value && this.subscriberAddress.get("phone_no2").valid) {
        this.subscriberAddress.get("phone_ext2").enable();
      } else {
        this.subscriberAddress.get("phone_ext2").reset();
        this.subscriberAddress.get("phone_ext2").disable();
      }
    })
    this.subscriberAddress.get("street1").valueChanges
      .pipe(
        debounceTime(500),
      ).subscribe(key => {
        if (key && typeof (key) == 'string')
          key = key.trim();
        this.isAddressSearched = true;
        if (key)
          this.claimService.searchAddress(key).subscribe(address => {
            this.streetAddressList = address.suggestions;
            this.isAddressError = false;
          }, error => {
            if (error.status == 0)
              this.isAddressError = true;
            this.streetAddressList = [];
          })
        else
          this.streetAddressList = []
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



  }
  getAddress() {
    this.userService.getSubscriberAddress().subscribe(res => {
      if (res.status) {
        console.log(res.data.state_id)
        this.changeState(res.data.state_id, 'subscriber')
        this.subscriberAddress.patchValue(res.data)
      }
    })
  }
  selectAddress(street) {
    let state_id: any;
    this.states.map(state => {
      if (state.state_code == street.state) {
        state_id = state.id;
      }
    })
    this.subscriberAddress.patchValue({
      street1: street.street_line,
      street2: "",
      city: street.city,
      state_id: state_id,
      zip_code: street.zipcode
    })
    console.log(street, state_id)
    this.changeState(street.state, "subscriber")
  }
  isSubFormSubmitted = false;
  submitSubscriberAddress() {
    this.isSubFormSubmitted = true;
    if (this.subscriberAddress.invalid) {
      return
    }
    this.userService.subscriberaddress(this.subscriberAddress.value).subscribe(res => {
      this.alertService.openSnackBar(res.message, 'success');
      this.getAddress();
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
  selectedTabChange(event) {
    if (event.index == 3) {
      this.userService.subscriptionCharges().subscribe(res => {
        this.subscriptionCharges = res.data;
        if (res && res.data && res.data.length > 0) {
          this.getHistory(this.subscriptionCharges[res.data.length - 1].date);
          this.selectedDate = this.subscriptionCharges[res.data.length - 1].date;
        }
      }, error => {
        console.log("error", error.error)
      })
    }
  }
  isAddingCard = false;
  publicKey: any;
  addCard() {
    this.billings.controls['address_zip'].setValidators(null);
    this.billings.controls['address_zip'].updateValueAndValidity();
    this.billings.get('default').enable();
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
      this.billings.get('default').enable();
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
    this.isCardSubmit = true;
    if (!this.billings.valid) {
      this.alertService.openSnackBar("Please fill all required fields", "error");
      return
    }
    if (this.isUpdate) {
      this.updateCard();
      return
    }
    this.isAddingCard = true;
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
          this.isCardSubmit = false;
        }, error => {
          this.isAddingCard = false;
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
  subscriberState: any;
  changeState(state_code?, type?) {
    if (type == 'subscriber') {
      if (this.states)
        this.states.map(res => {
          if (res.state_code == state_code || res.id == state_code) {
            this.subscriberState = res.state_code;
          }
        })
    }
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
      this.isCardSubmit = false;
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
      data: { name: 'make this card the default card', address: true, title: (card.brand + " card ending in " + card.last4) }
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

  openData(node) {
    let nodeType = this.getParent(node).name;
    let tail_name = "";
    if (nodeType == "Record Review") {
      tail_name = "records";
    } else if (nodeType == "Transcription and Compilation") {
      tail_name = "reports";
    } else if (nodeType == "Correspondence") {
      tail_name = node.examiner_id ? "correspondence/" + node.examiner_id : "correspondence";
    } else if (nodeType == "Billing") {
      tail_name = node.bill_id ? "billing/" + node.bill_id : "billing";
    } else if (nodeType == "History") {
      tail_name = "history";
      tail_name = node.examiner_id ? "history/" + node.examiner_id : "history";
    }
    if (node.level == 3) {
      this.router.navigate(['subscriber/claimants/claimant/' + node.claimant_id + '/claim/' + node.claim_id + '/billable-item/' + node.billable_item_id + "/" + tail_name])
    }
  }
  getParent(node) {
    const { treeControl } = this;
    const currentLevel = treeControl.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = treeControl.dataNodes[i];

      if (treeControl.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
  }
  progress = 0;
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
    this.userService.updateSubsciberSetting(this.userForm.value).subscribe((event: HttpEvent<any>) => {
      let progress = this.onDemandService.getProgress(event);
      if (progress == 0) {
        if (event['body']) {
          this.intercom.setLoaderPercentage(this.progress)
          this.alertService.openSnackBar("Profile updated successfully", 'success');
          this.signData = event['body'].data.signature ? 'data:image/png;base64,' + event['body'].data.signature : null;
          this.isSubmit = false;
          this.intercom.setUser(true);
        }
      }
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

  fileChangeEvent(event: any, files?): void {
    let file = files ? files : event.target.files
    let fileName = event.target.files[0].name;
    fileName = event.target.files ? event.target.files[0].name : null;
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
  openSignature() {
    const dialogRef = this.dialog.open(FileUploadComponent, {
      width: '800px',
      data: { name: 'make this card the default card', address: true, isMultiple: false, fileType: ['.png', '.jpg', '.jpeg'], fileSize: 3, splMsg: "Supported File Formats are JPEG/JPG/PNG with 4:1 Aspect Ratio, 600*150 pixels<br/>Maximum File Size: 3 MB" },
      panelClass: 'custom-drag-and-drop',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        console.log(result)
        this.openSign(result.files[0])
      }
    })
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
      // this.fileUpload.nativeElement.value = "";
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
