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
        VALUES ('${createEventDto.event_name}', NOW())
      `)
    return { 'status': HttpStatus.CREATED, 'response': `Event created successfully!!` }
  }

  async findAll() {
    const all = await this.dataSource.query(`
    SELECT event_id, event_name, DATE_FORMAT(created_at, "%d/%c/%Y %T") AS created_at FROM events ORDER BY created_at DESC
  `)
    return { 'status': HttpStatus.OK, 'response': all };
  }
}
