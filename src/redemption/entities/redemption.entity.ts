import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Redemption {
  @PrimaryGeneratedColumn()
  redemption_id: number;

  @Column({ type: 'int' })
  event_id: number;

  @Column({ type: 'timestamp' })
  redeemed_at: Date;

  @Column({ type: 'varchar', length: 45 })
  team_name: string;
}
