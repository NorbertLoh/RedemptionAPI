import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

import { TypeORMMySqlTestingModule } from "../TestingConnectionModule";
import { TypeOrmModule } from '@nestjs/typeorm';

describe('EventsController', () => {
  let controller: EventsController;
  let module: TestingModule;

  let connection = TypeORMMySqlTestingModule([])

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        connection,
        TypeOrmModule.forFeature([]),
      ],
      controllers: [EventsController],
      providers: [EventsService],
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  afterAll(async () => {
    module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
