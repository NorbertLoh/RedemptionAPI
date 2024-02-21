import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { HttpStatus } from '@nestjs/common';

import { TypeORMMySqlTestingModule } from "../TestingConnectionModule";
import { TypeOrmModule } from '@nestjs/typeorm';

describe('EventsService', () => {
  let service: EventsService;
  let module: TestingModule;

  let connection = TypeORMMySqlTestingModule([])
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        connection,
        TypeOrmModule.forFeature([]),
      ],
      providers: [EventsService],
    }).compile();

    service = await module.get<EventsService>(EventsService);
  });

  afterAll(async () => {
    module.close();
  });
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an event', async () => {
    const createEventDto = { event_name: 'Test Event' };

    const result = await service.create(createEventDto);
    expect(result).toEqual({ 'status': HttpStatus.CREATED, 'response': `Event created successfully!!` });
  });
});
