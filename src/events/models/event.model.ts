import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Event extends Model {
  @Column
  event_name: string;
}