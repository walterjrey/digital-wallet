import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { WalletController } from './controllers/wallet.controller';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtModule } from '@nestjs/jwt';
import { secret } from './utils/constants';
import { join } from 'path/posix';
import { Wallet, WalletSchema } from './model/wallet.schema';
import { User, UserSchema } from './model/user.schema';
import { Rates, RatesSchema } from './model/rates.schema';
import { AppService } from './app.service';
import { WalletService } from './services/wallet.service';
import { UserService } from './services/user.service';
import { NetherscanService } from './services/netherscan.service';
import { isAuthenticated } from './app.middleware';
import { HttpModule } from "@nestjs/axios";
import { MONGO_DB } from './app.constants';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_DB),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    MongooseModule.forFeature([{ name: Rates.name, schema: RatesSchema }]),
    JwtModule.register({
      secret,
      signOptions: { expiresIn: '2h' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    HttpModule,
  ],
  controllers: [AppController, UserController, WalletController],
  providers: [AppService, WalletService, UserService, NetherscanService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(isAuthenticated)
      .exclude(
        { path: 'api/v1/wallet/:id', method: RequestMethod.GET }
      )
      .forRoutes(WalletController);
  }
}
