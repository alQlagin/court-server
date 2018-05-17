import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { map } from 'rxjs/operators';
import { VisitRequestService } from '../services/visit-request.service';
import { Observable } from 'rxjs';

@WebSocketGateway()
export class VisitRequestGateway {
  @WebSocketServer() server;

  constructor(private visitRequest: VisitRequestService) {
  }

  handleConnection(client) {
    this.visitRequest.request$.subscribe((visit) => {
      client.emit('request', visit);
    });
  }

  @SubscribeMessage('response')
  onResponse(client, data) {
    this.visitRequest.response(data);
  }

  @SubscribeMessage('request')
  onRequest(client, data): Observable<WsResponse<any>> {
    return this.visitRequest.request(data)
      .pipe(
        map(response => ({ event: 'response', data: response })),
      );
  }
}
