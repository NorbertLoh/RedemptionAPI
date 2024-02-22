import { Test, TestingModule } from '@nestjs/testing';
import { RedemptionService } from './redemption.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TypeORMMySqlTestingModule } from "../TestingConnectionModule";

describe('RedemptionService', () => {
  let service: RedemptionService;
  let module: TestingModule;
  let connection = TypeORMMySqlTestingModule([]);

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
    // arrange
    const assert = new HttpException('Staff does not exist', HttpStatus.NOT_FOUND);
    const data = { event_id: 1, staff_pass_id: 'abc' };

    // act
    const act = service.create(data);

    // assert
    await expect(act).rejects.toThrow(assert);
  });

  it('should throw "Event does not exist" if event does not exist', async () => {
    // arrange
    const assert = new HttpException('Event does not exist', HttpStatus.NOT_FOUND);
    const data = { event_id: 1000000, staff_pass_id: 'BOSS_T000000001P' };

    // act
    const act = service.create(data);

    // assert
    await expect(act).rejects.toThrow(assert);
  });

  it('should return "redeemed successfully" if not already redeemed', async () => {
    // arrange
    const assert = { status: HttpStatus.CREATED, response: 'Team RUST redeemed successfully!!' };
    const data = { event_id: 1, staff_pass_id: 'BOSS_T000000001P' };

    // act
    const act = await service.create(data);

    // assert
    expect(act).toEqual(assert);
  });

  it('should return "already redeemed" if already redeemed', async () => {
    // arrange
    const assert = { status: HttpStatus.OK, response: 'Team RUST already redeemed!!' };
    const data = { event_id: 1, staff_pass_id: 'BOSS_T000000001P' };

    // act
    const act = await service.create(data);

    // assert
    expect(act).toEqual(assert);
  });


});
