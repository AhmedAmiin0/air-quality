import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
@Entity({ name: 'air_quality' })
export class AirQualityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  aqius: number;

  @Column({ type: "decimal", precision: 10, scale: 6 })
  lat: number;

  @Column({ type: "decimal", precision: 10, scale: 6 })
  lon: number;

  @Column()
  city: string;

  @CreateDateColumn()
  createdAt: Date;

  date?: string;
  time?: string;
}
