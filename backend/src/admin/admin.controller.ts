import {
  Controller,
  Get,
  Query,
  Patch,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AppointmentStatus, TransactionStatus } from '@prisma/client';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import {
  GetDoctorsSwagger,
  UpdateDoctorStatusSwagger,
  GetTransactionsSwagger,
  GetAppointmentsSwagger,
} from './admin.swagger';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('doctors')
  @GetDoctorsSwagger()
  async getDoctors(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('isActive') isActive?: string,
    @Query('isVerified') isVerified?: string,
  ) {
    return this.adminService.getDoctors({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      isActive:
        isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      isVerified:
        isVerified === 'true'
          ? true
          : isVerified === 'false'
            ? false
            : undefined,
    });
  }

  @Patch('doctors/:id/status')
  @UpdateDoctorStatusSwagger()
  async updateDoctorStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { isVerified?: boolean; isActive?: boolean },
  ) {
    return this.adminService.updateDoctorStatus(id, body);
  }

  @Get('transactions')
  @GetTransactionsSwagger()
  async getTransactions(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: TransactionStatus,
  ) {
    return this.adminService.getTransactions({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      status,
    });
  }

  @Get('appointments')
  @GetAppointmentsSwagger()
  async getAppointments(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: AppointmentStatus,
  ) {
    return this.adminService.getAppointments({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      status,
    });
  }
}
