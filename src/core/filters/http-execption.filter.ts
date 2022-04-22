import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse(); // 获取请求上下文中的response对象
    const status = exception.getStatus(); // 获取异常状态码

    // 设置错误信息
    const message = exception.message;
    const exceptionResponse: any = exception.getResponse()
    let validatorMessage = exceptionResponse
    if (typeof validatorMessage === 'object') {
      validatorMessage = exceptionResponse.message
    }

    response
      .status(status)
      .json({
        code: status,
        message: validatorMessage || message,
      });

  }
}