import { IsNotEmpty, IsInt, IsString, IsDefined } from 'class-validator';

export class CreateRedemptionDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    staff_pass_id : string;

    @IsDefined()
    @IsNotEmpty()
    @IsInt()
    event_id: number;
}