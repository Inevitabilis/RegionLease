import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Mod } from "./mod";
import { Subregion } from "./subregion";
import { IHaveVisibilitySettings } from "./IHaveVisibilitySettings";
import { User } from "./user";

@Entity()
export class Region implements IHaveVisibilitySettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  acronym: string;

  @Column("boolean")
  visibility: boolean;

  @ManyToOne(() => Mod, (mod) => mod.regions)
  owningMod?: Mod;

  @OneToMany(() => Subregion, (subregion) => subregion.owningRegion)
  subregions: Subregion[];

  @OneToMany(() => Region, (region) => region.connectedRegions)
  connectedRegions: Region[];

  isVisible(): boolean {
    return Boolean(this.owningMod?.isVisible());
  }
  allowedUsers(): User[] {
    return this.owningMod == undefined ? [] : this.owningMod?.allowedUsers();
  }
}
