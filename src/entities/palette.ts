import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Mod } from "./mod";
import { IHaveVisibilitySettings } from "./IHaveVisibilitySettings";
import { User } from "./user";

@Entity()
export class Palette implements IHaveVisibilitySettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  number: number;

  @Column("boolean")
  visibility: boolean;

  @ManyToMany(() => User, (user) => user.mods)
  authors: User[];

  isVisible(): boolean {
    return this.visibility;
  }

  allowedUsers(): User[] {
    return this.authors;
  }

  setAuthor(user: User): void {
    void this.authors.push(user);
  }
  removeAuthor(author: User): void {
    this.authors = this.authors.filter((x) => x != author);
  }
}
