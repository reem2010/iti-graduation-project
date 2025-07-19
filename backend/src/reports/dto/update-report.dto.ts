// src/reports/dto/update-report.dto.ts
import { IsOptional, IsString, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateReportDto {
  @ApiPropertyOptional({ example: 'Flu' })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional({ example: 'Rest and drink fluids' })
  @IsOptional()
  @IsString()
  prescription?: string;

  @ApiPropertyOptional({ example: 'Patient to follow up in 2 weeks' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    example: { reportUrl: 'https://link.com/report.pdf' },
  })
  @IsOptional()
  @IsObject()
  documents?: object;
}
