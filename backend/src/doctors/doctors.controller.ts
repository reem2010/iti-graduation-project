import { Controller, Get, Query } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { ApiTagsTherapists, ApiFindAllTherapists } from './doctors.swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Doctors')
@Controller('therapists')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  @ApiFindAllTherapists()
  findAll(@Query() query: any) {
    return this.doctorsService.findAll(query);
  }
}
