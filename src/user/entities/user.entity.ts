import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, unique: true, name: 'email' })
  email: string;

  @Column({ type: 'varchar', length: 2000, name: 'password', select: false })
  password: string;

  @Column({ type: 'varchar', length: 200, name: 'name' })
  name: string;

  @Column({ type: 'boolean', default: false, name: 'status' })
  status: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'update_at',
  })
  update_at: Date;
}
