import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback'
import { Observable, of } from 'rxjs'
import { delay } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl'
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service'
import { map, catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})

export class FeedbackService {

  constructor(private http: HttpClient, 
    private processHTTPMsgService: ProcessHTTPMsgService ) { }

    postFeedback(Feedback: Feedback): Observable <Feedback> {
      return this.http.post<Feedback[]>(baseURL + 'feedback/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError))
    }









}
