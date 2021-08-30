import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { FeedbackService } from '../services/feedback.service'
import { expand } from '../animations/app.animation'
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  animations:[
    expand()
  ]
})

export class ContactComponent implements OnInit {

  feedbackForm: FormGroup
  feedback: Feedback
  contactType = ContactType
  feedbackErrMsg: string
  feedbackResponse: Feedback
  @ViewChild('fform') feedbackFormDirective
  hideForm = false
  hideSubmitting = true
  hideResponse = true

  firstname: string
  lastname: string
  telnum: number   
  email: string
  agree: boolean
  contacttype: string
  message: string

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };


  constructor(private fb: FormBuilder,
    private feedbackService: FeedbackService) { 
    this.createForm()
  }

  ngOnInit() {
  }

  createForm(): void {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: ['', [Validators.required, Validators.pattern] ],      
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    })
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    //this.onValueChanged(); // (re)set validation messages now
  }

  onSubmit() {
    this.hideForm = true
    this.hideSubmitting = false
    this.feedback = this.feedbackForm.value

    this.feedbackService.postFeedback(this.feedback)
    .subscribe(
      res => {
        let returnData: Feedback = res.body
        this.hideSubmitting=true
        this.hideResponse=false
        this.firstname = returnData.firstname
        this.lastname = returnData.lastname
        this.telnum = returnData.telnum   
        this.email = returnData.email
        this.agree = returnData.agree
        this.contacttype = returnData.contacttype
        this.message = returnData.message

        setTimeout(() => {  this.feedbackFormDirective.resetForm()
                            this.hideResponse=true
                            this.hideForm=false}, 5000);
      }
    )
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);

        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }


}
