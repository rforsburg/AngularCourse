import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback'
import { Observable, of } from 'rxjs'
import { delay } from 'rxjs/operators'
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { baseURL } from '../shared/baseurl'
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service'
import { map, catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})

export class FeedbackService {

  // let httpHeaders = new HttpHeaders({
  //   'Content-Type': 'application/json'
  //  })

  constructor(
    private http: HttpClient, 
    private processHTTPMsgService: ProcessHTTPMsgService ) { }


    // httpHeader = {
    //   headers: new HttpHeaders({'Content-Type': 'application/json'})
    // }

    httpHeader = new HttpHeaders({'Content-Type': 'application/json'})
    
    postFeedback(feedback): Observable<HttpResponse<Feedback>> {
      return this.http.post<Feedback>(baseURL + 'feedback', JSON.stringify(feedback), {
        headers: this.httpHeader,
        observe: 'response'}
      )
      .pipe(catchError(this.processHTTPMsgService.handleError))
    }












}
