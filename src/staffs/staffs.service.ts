import { Injectable, HttpStatus } from '@nestjs/common';

import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

import { readFileSync } from 'fs'
import { Staff } from './entities/staff.entity'
import { parse } from 'csv-parse';

@Injectable()
export class StaffsService {
  constructor(@InjectDataSource() private dataSource: DataSource) { }

  // This function creates new staff entries in the database from a CSV file.
  async create(file: Express.Multer.File) {
    // Define the headers for the CSV file.
    const headers = ['staff_pass_id', 'team_name', 'created_at'];

    // Return a new Promise that resolves when the CSV file has been parsed and the data has been inserted into the database.
    return new Promise((resolve, reject) => {
      parse(readFileSync(file.path), {
        delimiter: ',',
        columns: headers,
        fromLine: 2,
        // Cast the 'created_at' column value to a Date object.
        cast: (columnValue, context) => {
          if (context.column === 'created_at') {
            return new Date(parseInt(columnValue));
          }
          return columnValue;
        }
      }, (error, result: Staff[]) => {
        let values = [];

        // Validate the data for each staff entry.
        for (let i = 0; i < result.length; i++) {
          if (typeof result[i].staff_pass_id !== "string" ||
            typeof result[i].team_name !== "string" ||
            isNaN(result[i].created_at.getTime())
          ) {
            // If the data is invalid, resolve the Promise with a status of '400' and a response message.
            resolve({ 'status': HttpStatus.BAD_REQUEST, 'response': `Invalid Data!!` });
            return;
          }
          // If the data is valid, add it to the 'values' array.
          values.push([result[i].staff_pass_id, result[i].team_name, result[i].created_at]);
        }

        //Reset the staffs table in the database.
        this.dataSource.query(`TRUNCATE staffs`);

        // Insert the new staffs entries into the staffs table.
        this.dataSource.createQueryBuilder()
          .insert()
          .into("staffs")
          .values(result)
          .execute();
        
        // Resolve the Promise with a status of '201' and a response message.
        resolve({ 'status': HttpStatus.CREATED, 'response': `Staffs added successfully!!` });
      })
    })
  }

  // This function retrieves a specific staff entry from the database.
  async findOne(id: string) {
    // The SQL query is executed to count the number of staff entries in the staffs table that have the specified staff_pass_id.
    const result = await this.dataSource.query(`
        SELECT COUNT(staff_pass_id) As count
        FROM staffs
        WHERE staff_pass_id = $1;
      `, [id]);
    // The function returns a response object with a boolean indicating whether the staff entry exists. true if count is 1 else false is 0.
    return { 'response': result[0].count == 1 };
  }

}
