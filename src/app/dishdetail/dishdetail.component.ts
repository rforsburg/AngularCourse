import { Component, OnInit, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'
import { Dish } from '../shared/dish'
import { DishService } from '../services/dish.service'
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { CommentFeedback } from '../shared/commentFeedback';

import { flyInOut, expand } from '../animations/app.animation';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
        state('shown', style({
            transform: 'scale(1.0)',
            opacity: 1
        })),
        state('hidden', style({
            transform: 'scale(0.5)',
            opacity: 0
        })),
        transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})

export class DishdetailComponent implements OnInit {
  feedbackForm: FormGroup
  feedback: CommentFeedback
  @ViewChild('fform2') feedbackFormDirective
  submitted: boolean = false
  dishcopy: Dish;

  visibility = 'shown';


  formErrors = {
    'name': '',
    'message': ''
  };

  validationMessages = {
    'name': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    },
    'message': {
      'required':      'Comment is required.',
      'minlength':     'Comment must be at least 3 characters long.'
    }
  };


  rating: string  = '5'
  name: string
  message:string 
  errMess: string

  dish: Dish
  dishIds: string[]
  prev: string
  next: string

  constructor(
    private dishservice: DishService, 
    private location: Location, 
    private route: ActivatedRoute,
    private fb2: FormBuilder,
    @Inject('BaseURL') private BaseURL) {this.createForm()}

  ngOnInit() {     
    this.dishservice.getDishIds()
      .subscribe((dishIds) => this.dishIds = dishIds,
      errmess => this.errMess = <any>errmess)

    // this.route.params
    //   .pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))   
    //   .subscribe (dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); },
    //   errmess => this.errMess = <any>errmess)

    this.route.params
        .pipe(switchMap((params: Params) =>  { 
          this.visibility = 'hidden'
          return this.dishservice.getDish(params['id'])}))
        .subscribe(dish => { 
          this.dish = dish; 
          this.dishcopy = dish; 
          this.setPrevNext(dish.id);
          this.visibility = 'shown';
         },
        errmess => this.errMess = <any>errmess);
    }

  setPrevNext(dishId :string){
    const index = this.dishIds.indexOf(dishId)
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack() :void{
    this.location.back()
  }

  createForm() {
    this.feedbackForm = this.fb2.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],  
      rating: '',    
      message: ['', [Validators.required, Validators.minLength(3)]]
    })
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    //this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    // if (!this.feedbackForm) { return }
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

  onSubmit() {
    this.feedback = this.feedbackForm.value
    // this.dish.comments.push({comment: this.feedback.message, author: this.feedback.name, rating: this.feedback.rating.toString(), date: new Date().toString()})
    this.dish.comments.push({comment: this.feedback.message, author: this.feedback.name, rating: 0, date: new Date().toString()})


    this.feedbackFormDirective.resetForm()    
    this.feedbackForm.reset({
      name: '',
      rating: 5,
      message: ''
    })
    this.submitted = false
  }

  nameChanged(name) {
    this.name = name
  }

  messageChanged(message) {
    this.message = message
  }
  ratingChanged(rating) {
    this.rating = rating
  }

}     // Final div
