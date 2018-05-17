import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { VisitRequestGateway } from './gateways/visit-request.gateway';
import { VisitRequestService } from './services/visit-request.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [VisitRequestGateway, VisitRequestService],
})
export class AppModule {
}
