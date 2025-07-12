import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
} from 'class-validator';

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
}

export class NotificationQueryDto {
  @IsOptional()
  @IsNumber()
  skip?: number = 0;

  @IsOptional()
  @IsNumber()
  take?: number = 20;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
