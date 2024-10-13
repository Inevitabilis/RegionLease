import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Region } from "./region";

@Entity()
export class Subregion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Region, (region) => region.subregions)
  owningRegion?: Region;
}
