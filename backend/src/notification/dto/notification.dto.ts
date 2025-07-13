import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  APPOINTMENT = 'APPOINTMENT',
  PAYMENT = 'PAYMENT',
  VERIFICATION = 'VERIFICATION',
  MESSAGE = 'MESSAGE',
  REVIEW = 'REVIEW',
  REMINDER = 'REMINDER',
  ARTICLE = 'ARTICLE',
  SYSTEM = 'SYSTEM',
}

export class CreateNotificationDto {
  @IsNumber()
  userId: number;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsNumber()
  referenceId?: number;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @IsOptional()
  @IsString()
  actionUrl?: string; // URL to navigate to when clicking the notification

  @IsOptional()
  @IsString()
  imageUrl?: string; // Image for the notification
}

export class NotificationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  skip?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  take?: number = 20;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @IsOptional()
  @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
  @IsBoolean()
  isRead?: boolean;
}
