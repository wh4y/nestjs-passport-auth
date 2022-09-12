import { LoginOptions } from "./login.options";

export interface RegisterOptions extends LoginOptions {
  username: string;
}
