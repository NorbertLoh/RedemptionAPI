import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateRedemptionDto } from './dto/create-redemption.dto';

import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class RedemptionService {
  constructor(@InjectDataSource() private dataSource: DataSource,) { }

  async create(createRedemptionDto: CreateRedemptionDto) {
    //check if alr redeemed
    const team_name_query = await this.dataSource.query(`
        SELECT team_name
        FROM staffs
        WHERE staff_pass_id = '${createRedemptionDto.staff_pass_id}';
      `)
    if (team_name_query.length == 0) {
      throw new HttpException('Staff does not exist', HttpStatus.NOT_FOUND);
    }

    const event_query = await this.dataSource.query(`
        SELECT *
        FROM events
        WHERE event_id = '${createRedemptionDto.event_id}';
      `)
    if (event_query.length == 0) {
      throw new HttpException('Event does not exist', HttpStatus.NOT_FOUND);
    }

    const team_name = team_name_query[0].team_name
    const result = await this.dataSource.query(`
        SELECT COUNT(*) As count
        FROM redemption
        WHERE team_name = '${team_name}' AND event_id = '${createRedemptionDto.event_id}';
      `)

    if (result[0].count > 0) {
      return { 'status': HttpStatus.OK, 'response': `Team ${team_name} already redeemed!!` }
    } else {

      this.dataSource.query(`
        INSERT INTO redemption (event_id, redeemed_at, team_name)
        VALUES ('${createRedemptionDto.event_id}', NOW(), '${team_name}')
      `)
      return { 'status': HttpStatus.CREATED, 'response': `Team ${team_name} redeemed successfully!!` }
    }
  }

  async findOne(id: number) {
    const event_query = await this.dataSource.query(`
        SELECT *
        FROM events
        WHERE event_id = '${id}';
      `)
    if (event_query.length == 0) {
      throw new HttpException('Event does not exist', HttpStatus.NOT_FOUND);
    }
    const result = await this.dataSource.query(`
        SELECT *, DATE_FORMAT(redeemed_at, "%d/%c/%Y %T") AS redeemed_at FROM redemption 
        WHERE event_id = ${id}
        ORDER BY redeemed_at DESC
      `)
    return { 'status': HttpStatus.OK, 'response': result };
  }
}
