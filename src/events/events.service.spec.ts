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
    // arrange
    const assert = { 'status': HttpStatus.CREATED, 'response': `Event created successfully!!` };
    const data = { event_name: 'Test Event' };

    // act
    const act = await service.create(data);

    // assert
    expect(act).toEqual(assert);
  });
});
