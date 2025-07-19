import {
  Controller,
  Patch,
  Query,
  Body,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { UpdateReportDto } from './dto/update-report.dto';
import {
  SwaggerTags,
  SwaggerAuth,
  SwaggerUpdateReport,
  SwaggerGetPatientsReports,
} from './reports.swagger';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('reports')
@SwaggerTags()
@SwaggerAuth()
@UseGuards(JwtAuthGuard)
@Roles('doctor')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Patch()
  @SwaggerUpdateReport()
  async updateAppointmentReport(
    @Request() req: any,
    @Query('appointmentId') appointmentId: string,
    @Body() dto: UpdateReportDto,
  ) {
    const doctorId = req.user.userId;
    return this.reportsService.updateAppointmentReport(
      doctorId,
      Number(appointmentId),
      dto,
    );
  }

  @Get('')
  @SwaggerGetPatientsReports()
  async getDoctorPatientsReports(@Request() req: any) {
    const doctorId = req.user.userId;
    return this.reportsService.getDoctorPatientsReports(doctorId);
  }
}
