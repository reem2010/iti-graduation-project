import { forwardRef, Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { ZoomService } from '../zoom/zoom.service';
import { PrismaService } from 'prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionModule } from 'src/transaction/transaction.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
 imports: [
  forwardRef(() => TransactionModule), // Add this
  WalletModule
],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, ZoomService, PrismaService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}