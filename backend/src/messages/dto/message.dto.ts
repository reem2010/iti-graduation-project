import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty({
    description: 'ID of the sender',
    example: 1,
  })
  @IsInt()
  senderId: number;

  @ApiProperty({
    description: 'ID of the recipient',
    example: 2,
  })
  @IsInt()
  recipientId: number;

  @ApiProperty({
    description: 'Content of the message',
    example: 'Hello, how can I help you today?',
  })
  @IsString()
  content: string;
}
