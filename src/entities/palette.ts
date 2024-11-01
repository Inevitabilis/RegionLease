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

  @ManyToMany(() => Mod, (mod) => mod.allowedUsers)
  mods: Mod[];

  isVisible(): boolean {
    return this.mods.some((mod) => mod.isVisible());
  }

  allowedUsers(): User[] {
    let result: Set<User> = new Set();
    this.mods.forEach((mod) => {
      const modAllowedUsers = new Set<User>(mod.allowedUsers());
      result = new Set([...result, ...modAllowedUsers]);
    });
    return new Array(...result);
  }
}
