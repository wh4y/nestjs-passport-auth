import * as bcrypt from "bcrypt";
import { AuthService } from "./auth.service";
import { UserService } from "../../user/service/user.service";
import { CreateUserOptions } from "../../user/entity/options/create-user.options";
import { User } from "../../user/entity/user.entity";
import { RegisterOptions } from "./options/register.options";
import { LoginOptions } from "./options/login.options";

describe("AuthService", () => {

  let authService: AuthService;
  let userService: Partial<UserService>;

  beforeEach(() => {
    userService = {
      create: jest.fn().mockImplementation((options: CreateUserOptions) => Promise.resolve(User.createOne(options)))
    };
    authService = new AuthService(userService as UserService);

    jest.spyOn(authService, "validatePassword");
    jest.spyOn(authService, "register");
    jest.spyOn(authService, "login");
  });

  describe("validatePassword", () => {
    const password = "password";

    it("should return true", async () => {
      const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());
      const isPasswordValid = await authService.validatePassword(password, hashedPassword);

      expect(authService.validatePassword).toBeCalledTimes(1);
      expect(isPasswordValid).toBeDefined();
      expect(isPasswordValid).toEqual(true);
    });

    it("should return false", async () => {
      const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());
      const isPasswordValid = await authService.validatePassword("invalid", hashedPassword);

      expect(authService.validatePassword).toBeCalledTimes(1);
      expect(isPasswordValid).toBeDefined();
      expect(isPasswordValid).toEqual(false);
    });
  });

  describe("register", () => {
    const options: RegisterOptions = {
      email: "test@test.com",
      username: "Test",
      password: "Test-00000"
    };

    it("should return a user", async () => {
      const user = await authService.register(options);

      expect(authService.register).toBeCalledTimes(1);
      expect(userService.create).toBeCalledTimes(1);

      expect(user).toBeDefined();
      expect(user).toBeInstanceOf(User);
      expect(user.username).toEqual(options.username);
      expect(user.email).toEqual(options.email);
      expect(user.password).toEqual(options.password);
    });

    it("should throw an error", async () => {
      userService.create = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      let user: any;

      await expect(async () => user = await authService.register(options)).rejects.toThrow();

      expect(authService.register).toBeCalledTimes(1);
      expect(userService.create).toBeCalledTimes(1);

      expect(user).not.toBeDefined();
    });
  });

  describe("login", () => {
    const options: LoginOptions = {
      email: "test@test.com",
      password: "Test-00000"
    };

    it("should return a user", async () => {
      const hashedPassword = await bcrypt.hash(options.password, await bcrypt.genSalt());

      userService.findByEmail = jest.fn().mockImplementation(async () => {
        const user = User.createOne({ ...options, username: "test" });
        return user.withPassword(hashedPassword);
      });

      const user = await authService.login(options);

      expect(authService.login).toBeCalledTimes(1);
      expect(userService.findByEmail).toBeCalledTimes(1);

      expect(user).toBeDefined();
      expect(user).toBeInstanceOf(User);
      expect(user.email).toEqual(options.email);
      expect(user.username).toEqual("test");
      expect(user.password).toEqual(hashedPassword);
    });

    it("should ", async () => {
      userService.findByEmail = jest.fn().mockReturnValue(Promise.resolve(null));

      let user: any;

      await expect(async () => user = await authService.login(options)).rejects.toThrow();

      expect(authService.login).toBeCalledTimes(1);
      expect(userService.findByEmail).toBeCalledTimes(1);

      expect(user).not.toBeDefined();
    });
  });
});
