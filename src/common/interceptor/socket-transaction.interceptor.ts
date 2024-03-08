import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Observable, catchError, tap } from "rxjs";
import { DataSource } from "typeorm";

@Injectable()
export class SocketTransactionInterceptor implements NestInterceptor {

    constructor(
        private readonly dataSource: DataSource
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {

        const sokcet = context.switchToWs().getClient();

        const qr = this.dataSource.createQueryRunner();

        sokcet.qr = qr;

        await qr.connect();
        await qr.startTransaction();

        return next.handle()
            .pipe(


                catchError(async (e) => {

                    await qr.rollbackTransaction()
                    await qr.release()
                    throw new WsException({
                        status: 100,
                        error: { message: '작업중 에러발생' }
                    });
                }),

                tap(async () => {

                    await qr.commitTransaction()
                    await qr.release()

                }),
            );
    };
};