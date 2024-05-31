import { Catch } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

interface RpcError {
  status: number | string;
  message: string;
}

@Catch(RpcException)
export class ExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException) {
    const rcpError = exception.getError() as RpcError;

    const response = {
      status: 400,
      message: rcpError.message,
    };

    if (
      typeof rcpError === 'object' &&
      'status' in rcpError &&
      'message' in rcpError
    ) {
      response.status = isNaN(+rcpError.status) ? 400 : +rcpError.status;
      response.message = rcpError.message;
    }

    return response;
  }
}
