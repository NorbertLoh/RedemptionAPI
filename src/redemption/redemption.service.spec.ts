import { Test, TestingModule } from '@nestjs/testing';
import { RedemptionService } from './redemption.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redemption } from "./entities/redemption.entity";
import { DataSource } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

import { TypeORMMySqlTestingModule } from "../TestingConnectionModule";


describe('RedemptionService', () => {
  let service: RedemptionService;
  let module: TestingModule;

  let connection = TypeORMMySqlTestingModule([])
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        connection,
        TypeOrmModule.forFeature([]),
      ],
      providers: [RedemptionService],
    }).compile();

    service = await module.get<RedemptionService>(RedemptionService);
  });

  afterAll(async () => {
    module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw "Staff does not exist" if staff does not exist', async () => {
    await expect(service.create({ event_id: 1, staff_pass_id: 'abc' })).rejects.toThrow(new HttpException('Staff does not exist', HttpStatus.NOT_FOUND));
  });

  it('should throw "Event does not exist" if event does not exist', async () => {
    await expect(service.create({ event_id: 1000000, staff_pass_id: 'BOSS_T000000001P' })).rejects.toThrow(new HttpException('Event does not exist', HttpStatus.NOT_FOUND));
  });

  it('should return "redeemed successfully" if not already redeemed', async () => {
    const result = await service.create({ event_id: 1, staff_pass_id: 'BOSS_T000000001P' });
    expect(result).toEqual({ status: HttpStatus.CREATED, response: 'Team RUST redeemed successfully!!' });
  });

  it('should return "already redeemed" if already redeemed', async () => {
    const result = await service.create({ event_id: 1, staff_pass_id: 'BOSS_T000000001P' });
    expect(result).toEqual({ status: HttpStatus.OK, response: 'Team RUST already redeemed!!' });
  });


});
