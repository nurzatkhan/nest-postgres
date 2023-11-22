import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUserById {
  @IsInt()
  @Type(() => Number)
  id: number;
}
