import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Mod } from "./mod";

@Entity()
export class Palette {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  number: number;

  @ManyToMany(() => Mod, (mod) => mod.authors)
  mods: Mod[];
}
