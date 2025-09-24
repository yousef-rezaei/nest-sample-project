import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export default class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ length: 30, nullable: true })
  first_name: string;

  @Column({ length: 30, nullable: true })
  last_name: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  avatar?: string | null; // filename only, e.g., "42-1695412345678.webp"
}
