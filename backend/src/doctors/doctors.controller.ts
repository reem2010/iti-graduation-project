import { Controller, Get, Query } from '@nestjs/common';
import { DoctorsService } from './doctors.service';

@Controller('therapists')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.doctorsService.findAll(query);
  }
}
