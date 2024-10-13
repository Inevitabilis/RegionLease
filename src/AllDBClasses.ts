import { Mod } from "./entities/mod";
import { Palette } from "./entities/palette";
import { Region } from "./entities/region";
import { Subregion } from "./entities/subregion";
import { User } from "./entities/user";

export const dbClassesMap = {
  mods: Mod,
  palettes: Palette,
  regions: Region,
  subregions: Subregion,
  users: User,
};
