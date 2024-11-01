import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Mod } from "./mod";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("text")
  contacts: string;

  @ManyToMany(() => Mod, (mod) => mod.allowedUsers)
  @JoinTable()
  mods: Mod[];

  @Column("text")
  passwordSaltedHash: string;
}
