import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';

import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class EventsService {
  constructor(@InjectDataSource() private dataSource: DataSource,) { }

  async create(createEventDto: CreateEventDto) {
    await this.dataSource.query(`
      INSERT INTO events (event_name, created_at)
      VALUES ($1, NOW())
    `, [createEventDto.event_name])
    return { 'status': HttpStatus.CREATED, 'response': `Event created successfully!!` }
  }

  async findAll() {
    const all = await this.dataSource.query(`
      SELECT event_id, event_name, TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI:SS') AS created_at FROM events ORDER BY created_at DESC;
    `)
    return { 'status': HttpStatus.OK, 'response': all };
  }

}
