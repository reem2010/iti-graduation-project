import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class ReviewDoctorVerificationDto {
  @ApiProperty({
    description: 'Status of the doctor verification',
    enum: VerificationStatus,
    example: VerificationStatus.APPROVED,
  })
  @IsEnum(VerificationStatus)
  status: VerificationStatus;

  @ApiPropertyOptional({
    description: 'Reason for rejection (required if status is rejected)',
    example: 'Incomplete certification documents',
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
