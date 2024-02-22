import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';

import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class EventsService {
  constructor(@InjectDataSource() private dataSource: DataSource,) { }

  // Create new events
  async create(createEventDto: CreateEventDto) {
    // The SQL query is executed to insert a new event into the events table.
    // The event name is taken from the createEventDto object and the current timestamp is used for created_at column.
    await this.dataSource.query(`
      INSERT INTO events (event_name, created_at)
      VALUES ($1, NOW())
    `, [createEventDto.event_name]);

    // After the event is successfully created, a response object is returned with a status of 201 and a success message.
    return { 'status': HttpStatus.CREATED, 'response': `Event created successfully!!` };
  }

  // Get all events
  async findAll() {
    // The SQL query is executed to select all events from the events table.
    // The results are ordered by created_at in descending order.
    const all = await this.dataSource.query(`
      SELECT event_id, event_name, TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI:SS') AS created_at FROM events ORDER BY created_at DESC;
    `);

    // The function returns a response object with a status of '200' and the retrieved events.
    return { 'status': HttpStatus.OK, 'response': all };
  }

}
