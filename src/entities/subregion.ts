import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Region } from "./region";
import { IHaveVisibilitySettings } from "./IHaveVisibilitySettings";
import { User } from "./user";

@Entity()
export class Subregion implements IHaveVisibilitySettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Region, (region) => region.subregions)
  owningRegion?: Region;

  isVisible(): boolean {
    return Boolean(this.owningRegion?.isVisible());
  }
  allowedUsers(): User[] {
    return this.owningRegion == undefined
      ? []
      : this.owningRegion.allowedUsers();
  }

  setAuthor(user: User): void {
    void this.owningRegion?.setAuthor(user);
  }
  removeAuthor(author: User): void {
    this.owningRegion?.removeAuthor(author);
  }
}
