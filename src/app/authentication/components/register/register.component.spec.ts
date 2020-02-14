import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerService } from "ngx-spinner";
import { RouterTestingModule } from '@angular/router/testing'


describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, SharedModule, HttpClientTestingModule, BrowserAnimationsModule, RouterTestingModule],
      declarations: [RegisterComponent],
      providers: [NgxSpinnerService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });


  it('firstname field validity', () => {
    let errors = {};
    let email = component.registerForm.controls['firstName'];
    expect(email.valid).toBeFalsy();

    // Email field is required
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set email to something
    email.setValue("test");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();

    // Set email to something correct
    email.setValue("test");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('lastname field validity', () => {
    let errors = {};
    let email = component.registerForm.controls['lastName'];
    expect(email.valid).toBeFalsy();

    // Email field is required
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set email to something
    email.setValue("test");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();

    // Set email to something correct
    email.setValue("test");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('middleInitial field validity', () => {
    let errors = {};
    let email = component.registerForm.controls['middleInitial'];
    expect(email.valid).toBeFalsy();

    // Email field is required
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set email to something
    email.setValue("t");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();

    // Set email to something correct
    email.setValue("t");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('email field validity', () => {
    let errors = {};
    let email = component.registerForm.controls['email'];
    expect(email.valid).toBeFalsy();

    // Email field is required
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set email to something
    email.setValue("test");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    // Set email to something correct
    email.setValue("test@example.com");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();
  });

  it('password field validity', () => {
    let errors = {};
        let password = component.registerForm.controls['password'];

        // Email field is required
        errors = password.errors || {};
        expect(errors['required']).toBeTruthy();

        // Set email to something
        password.setValue("123456");
        errors = password.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['minlength']).toBeTruthy();

        // Set email to something correct
        password.setValue("123456789");
        errors = password.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['minlength']).toBeFalsy();
  });

  it('confirmPassword field validity', () => {
    let errors = {};
        let password = component.registerForm.controls['confirmPassword'];

        // Email field is required
        errors = password.errors || {};
        expect(errors['required']).toBeTruthy();

        // Set email to something
        password.setValue("123456");
        errors = password.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['minlength']).toBeTruthy();

        // Set email to something correct
        password.setValue("123456789");
        errors = password.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['minlength']).toBeFalsy();
  });

});
