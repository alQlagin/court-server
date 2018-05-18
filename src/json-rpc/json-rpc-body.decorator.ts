import { createParamDecorator } from '@nestjs/common';

export const JsonRpcBody = createParamDecorator((data, req) => {
  return req.body.params;
});
