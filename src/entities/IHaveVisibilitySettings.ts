import { User } from "./user";

export interface IHaveVisibilitySettings {
  allowedUsers(): User[];
  isVisible(): boolean;
  setAuthor(author: User): void;
  removeAuthor(author: User): void;
}

export function hasVisibilitySettings(
  obj: any
): obj is IHaveVisibilitySettings {
  return (
    "allowedUsers" in obj &&
    typeof obj.allowedUsers === "function" &&
    "isVisible" in obj &&
    typeof obj.isVisible === "function"
  );
}
