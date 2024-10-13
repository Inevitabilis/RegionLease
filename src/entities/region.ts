import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Mod } from "./mod";
import { Subregion } from "./subregion";

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  acronym: string;

  @Column("boolean")
  isVisible: boolean;

  @ManyToOne(() => Mod, (mod) => mod.regions)
  owningMod?: Mod;

  @OneToMany(() => Subregion, (subregion) => subregion.owningRegion)
  subregions: Subregion[];

  @OneToMany(() => Region, (region) => region.connectedRegions)
  connectedRegions: Region[];
}
