import { HttpService, Injectable } from '@nestjs/common';
import { catchError, filter, map, mapTo, switchMap } from 'rxjs/operators';
import { Observable, of, race, Subject, timer } from 'rxjs';
import { AxiosResponse } from '@nestjs/common/http/interfaces/axios.interfaces';
import moment = require('moment');

@Injectable()
export class VisitRequestService {

  readonly request$ = new Subject<Visit>();
  readonly response$ = new Subject();

  get backUrl() {
    return process.env.BACK_URL || 'http://cli.uz:8080/back';
  }

  constructor(private readonly http: HttpService) {
  }

  request(visit: Visit): Observable<Visit> {
    this.request$.next(visit);
    return race(
      this.response$.pipe(filter((v: any) => v.id === visit.id)),
      timer(15000).pipe(mapTo({ decision: true })),
    ).pipe(
      switchMap(({ decision, extra }) => this.sendRequest(visit, decision, extra)),
      catchError((err) => {
        visit.accepted_at = +moment();
        return of(visit);
      }),
    );
  }

  response(data: { decision: boolean, visit: Visit, extra: string }) {
    const { decision, extra, visit } = data;
    this.response$.next({ decision, id: visit.id, extra });
  }

  private sendRequest(visit, decision, { accept_at, reject_reason }: any = {}) {
    const extra = {
      accept_at: accept_at ? moment().add(accept_at, 'minutes').format('HH:mm') : '',
      reject_reason,
    };

    return this.http
      .request({
        url: `${this.backUrl}/visit/${visit.id}/${decision ? 'accept' : 'reject'}`,
        data: { params: extra },
        method: 'PUT',
      })
      .pipe(
        map((r: AxiosResponse<Visit>) => {
          return (r.data as any).result;
        }),
      );
    /*
        return of({
          id: 78,
          series: '1111111!',
          gender: null,
          department: {
            id: 1,
            name: 'First Department',
          },
          first_name: 'Mansur',
          last_name: 'Muzaffarov',
          birth_date: null,
          expire_date: null,
          issue_date: null,
          place_of_birth: null,
          queue_number: 3,
          time_interval: '11:00-12:00',
          department_id: 1,
          employee_id: 0,
          accepted_at: decision ? 1526539710000 : null,
          rejected_at: !decision ? 1526539710000 : null,
          ...extra,
        });
        */
  }
}