import { Injectable, HttpStatus, HttpException } from '@nestjs/common';

import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

import { readFileSync } from 'fs'
import { Staff } from './entities/staff.entity'
import { parse } from 'csv-parse';

@Injectable()
export class StaffsService {
  constructor(@InjectDataSource() private dataSource: DataSource,) { }

  async create(file: Express.Multer.File) {
    const headers = ['staff_pass_id', 'team_name', 'created_at'];
    return new Promise((resolve, reject) => {
      parse(readFileSync(file.path), {
        delimiter: ',',
        columns: headers,
        fromLine: 2,
        cast: (columnValue, context) => {
          if (context.column === 'created_at') {
            return new Date(parseInt(columnValue));
          }
          return columnValue;
        }
      }, async (error, result: Staff[]) => {
        let values = [];

        for (let i = 0; i < result.length; i++) {
          if (typeof result[i].staff_pass_id !== "string" ||
            typeof result[i].team_name !== "string" ||
            isNaN(result[i].created_at.getTime())
          ) {
            resolve({ 'status': HttpStatus.BAD_REQUEST, 'response': `Invalid Data!!` })
          }
          values.push([result[i].staff_pass_id, result[i].team_name, result[i].created_at])
        }

        await this.dataSource.query(`TRUNCATE staffs`)
        await this.dataSource.createQueryBuilder()
          .insert()
          .into("staffs")
          .values(result)
          .execute()
        resolve({ 'status': HttpStatus.CREATED, 'response': `Staffs added successfully!!` })
      })
    })
  }

  async findOne(id: string) {
    const result = await this.dataSource.query(`
        SELECT COUNT(staff_pass_id) As count
        FROM staffs
        WHERE staff_pass_id = $1;
      `, [id])
    return { 'response': result[0].count == 1 };
  }

}
