import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entitties/user.entity';

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

  @ManyToMany((type) => User, { cascade: true })
  @JoinTable({
    name: 'user_with_address',
    joinColumn: { name: 'address_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  users: User[];
}
