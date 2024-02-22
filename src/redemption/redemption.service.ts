import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateRedemptionDto } from './dto/create-redemption.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class RedemptionService {
  constructor(@InjectDataSource() private dataSource: DataSource,) { }

  // This function creates a new redemption in the database.
  async create(createRedemptionDto: CreateRedemptionDto) {
    // The SQL query is executed to check if the staff exists in the staffs table.
    const team_name_query = await this.dataSource.query(`
      SELECT team_name
      FROM staffs
      WHERE staff_pass_id = $1;
    `, [createRedemptionDto.staff_pass_id]);

    // If the staff does not exist, an exception is thrown.
    if (team_name_query.length == 0) {
      throw new HttpException('Staff does not exist', HttpStatus.NOT_FOUND);
    }

    // The SQL query is executed to check if the event exists in the events table.
    const event_query = await this.dataSource.query(`
      SELECT *
      FROM events
      WHERE event_id = $1;
    `, [createRedemptionDto.event_id]);

    // If the event does not exist, an exception is thrown.
    if (event_query.length == 0) {
      throw new HttpException('Event does not exist', HttpStatus.NOT_FOUND);
    }

    const team_name = team_name_query[0].team_name;

    // The SQL query is executed to check if the team has already redeemed for the event.
    const result = await this.dataSource.query(`
      SELECT COUNT(*) As count
      FROM redemption
      WHERE team_name = $1 AND event_id = $2;
    `, [team_name, createRedemptionDto.event_id]);

    // If the team has already redeemed, a response is returned indicating that the team has already redeemed.
    if (result[0].count > 0) {
      return { 'status': HttpStatus.OK, 'response': `Team ${team_name} already redeemed!!` };
    } else {
      // If the team has not redeemed, a new redemption is created in the redemption table.
      this.dataSource.query(`
        INSERT INTO redemption (event_id, redeemed_at, team_name)
        VALUES ($1, NOW(), $2)
      `, [createRedemptionDto.event_id, team_name]);

      // Returns a response object with a status of '201' indicating that the redemption was successful.
      return { 'status': HttpStatus.CREATED, 'response': `Team ${team_name} redeemed successfully!!` };
    }

  }

  // This function retrieves a specific event's redemptions from the database.
  async findOne(id: number) {
    // The SQL query is executed to check if the event exists in the events table.
    const event_query = await this.dataSource.query(`
        SELECT *
        FROM events
        WHERE event_id = '${id}';
      `);
    // If the event does not exist, an exception is thrown.
    if (event_query.length == 0) {
      throw new HttpException('Event does not exist', HttpStatus.NOT_FOUND);
    }

    // The SQL query is executed to retrieve all redemptions for the event from the redemption table based on the event_id.
    const result = await this.dataSource.query(`
        SELECT redemption_id, TO_CHAR(redeemed_at, 'DD/MM/YYYY HH24:MI') AS redeemed_at, team_name, event_id FROM redemption 
        WHERE event_id = ${id}
        ORDER BY redeemed_at DESC;
      `);
    // Returns a response object with a status of '200' and the retrieved redemptions.
    return { 'status': HttpStatus.OK, 'response': result };
  }
}
