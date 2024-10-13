import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";
import { Palette } from "./palette";
import { Region } from "./region";

@Entity()
export class Mod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  modname: string;

  @Column("text")
  description: string;

  @Column("bool")
  isVisible: boolean;

  @ManyToMany(() => User, (user) => user.mods)
  authors: User[];

  @ManyToMany(() => Palette, (palette) => palette.mods)
  @JoinTable()
  palettes: Palette[];

  @OneToMany(() => Region, (region) => region.owningMod)
  regions: Region[];
}
