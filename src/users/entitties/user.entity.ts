import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToMany, JoinTable } from 'typeorm';
import { Address } from '../../address/entities/address.entity';

@Entity({
  name: 'user',
})
@Index(['firstName', 'lastName'])
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn({type: 'int8'})
  id: number;

  @Column({nullable: false, type: 'varchar', length: 300})
  firstName: string;

  @Column({nullable: false, type: 'varchar', length: 300})
  lastName: string;

  @Column({nullable: false, unique: true, type: 'varchar', length: 100})
  email: string;

  @Column({nullable: false, unique: true, type: 'varchar', length: 12})
  phone: string;

  @ManyToMany(type => Address, { cascade: true })
  @JoinTable({
      name: 'user_with_address',
      joinColumn: { name: 'user_id', referencedColumnName: 'id'},
      inverseJoinColumn: { name: 'address_id', referencedColumnName: 'id'},
  })
  addresses: Address[];
}
