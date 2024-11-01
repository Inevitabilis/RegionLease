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
import { IHaveVisibilitySettings } from "./IHaveVisibilitySettings";

@Entity()
export class Mod implements IHaveVisibilitySettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  modname: string;

  @Column("text")
  description: string;

  @Column("bool")
  visibility: boolean;

  @ManyToMany(() => User, (user) => user.mods)
  authors: User[];

  @ManyToMany(() => Palette, (palette) => palette.mods)
  @JoinTable()
  palettes: Palette[];

  @OneToMany(() => Region, (region) => region.owningMod)
  regions: Region[];

  allowedUsers = () => this.authors;
  isVisible() {
    return this.visibility;
  }
}
