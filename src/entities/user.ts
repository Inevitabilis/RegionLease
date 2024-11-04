import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Mod } from "./mod";
import { Palette } from "./palette";

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

  @ManyToMany(() => Palette, (palette) => palette.allowedUsers)
  @JoinTable()
  palettes: Palette[];

  @Column("text")
  passwordSaltedHash: string;
}
