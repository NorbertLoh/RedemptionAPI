import { IsNotEmpty, IsInt, IsString, IsDefined } from 'class-validator';

export class CreateEventDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    event_name: string;
}
