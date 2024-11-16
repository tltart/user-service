import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({
  name: 'address',
})
@Index(['town', 'street', 'houseNumber'], { unique: true })
export class Address {
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: number;

  @Column({ nullable: false, type: 'varchar', length: 300 })
  town: string;

  @Column({ nullable: false, type: 'varchar', length: 300 })
  street: string;

  @Column({ nullable: false, type: 'varchar', length: 10 })
  houseNumber: string;
}
