import { User } from "./user";

export interface IHaveVisibilitySettings {
  allowedUsers(): User[];
  isVisible(): boolean;
}

export function hasVisibilitySettings(obj: any): obj is IHaveVisibilitySettings {
  return "allowedUsers" in obj 
  && typeof obj.allowedUsers === "function"
  && "isVisible" in obj
  && typeof obj.isVisible === "function";
}
