import { IsInt, IsString } from 'class-validator';

export class MessageDto {
  @IsInt()
  senderId: number;

  @IsInt()
  recipientId: number;

  @IsString()
  content: string;
}
