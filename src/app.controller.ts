import { Controller, Get, Post } from '@nestjs/common';
import { TerminalPrintData } from './dto/terminal-print.dto';
import { timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { JsonRpcBody } from './json-rpc/json-rpc-body.decorator';

@Controller()
export class AppController {
  @Get('/ping')
  ping() {
    return { ping: 'pong' };
  }

  @Post('/visit/print')
  print(@JsonRpcBody() data: TerminalPrintData) {
    return timer(1500).pipe(mapTo({ code: 200, result: data }));
  }
}
