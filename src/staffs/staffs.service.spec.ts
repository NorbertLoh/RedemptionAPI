import { Test, TestingModule } from '@nestjs/testing';
import { StaffsService } from './staffs.service';
import { TypeORMMySqlTestingModule } from "../TestingConnectionModule";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Express } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { HttpStatus } from '@nestjs/common';
import * as path from 'path';

import * as fs from "fs";


describe('StaffsService', () => {
  let service: StaffsService;
  let module: TestingModule;

  let connection = TypeORMMySqlTestingModule([])
  beforeEach(async () => {
    module  = await Test.createTestingModule({
      imports: [
        connection,
        TypeOrmModule.forFeature([]),
      ],
      providers: [StaffsService],
    }).compile();

    service = module.get<StaffsService>(StaffsService);
  });

  afterAll(async () => {
    module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
