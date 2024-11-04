import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";
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

  @OneToMany(() => Region, (region) => region.owningMod)
  regions: Region[];

  allowedUsers = () => this.authors;
  isVisible() {
    return this.visibility;
  }
  setAuthor(user: User): void {
    void this.authors.push(user);
  }
  removeAuthor(author: User): void {
    this.authors = this.authors.filter((x) => x != author);
  }
}
