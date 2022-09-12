import { CreateUserOptions } from "./options/create-user.options";
import { User } from "./user.entity";

describe("User entity", () => {
  const creationOptions: CreateUserOptions = {
    email: "test@test.com",
    username: "test",
    password: "Test-000"
  };

  describe("create", () => {
    it("should create new User", () => {
      const user: User = User.createOne(creationOptions);

      expect(user).toBeInstanceOf(User);
      expect(user.id).toEqual(undefined);
      expect(user.email).toEqual(creationOptions.email);
      expect(user.username).toEqual(creationOptions.username);
      expect(user.password).toEqual(creationOptions.password);
    });
  });

  describe("immutable getters", () => {
    const user: User = User.createOne(creationOptions);

    it("should return new updated users", () => {
      const email = "test-2@jest.com";
      const userWithEmail = user.withEmail(email);
      expect(userWithEmail.email).toEqual(email);
      expect(userWithEmail).not.toBe(user);

      const password = "Pass-0000";
      const userWithPassword = user.withPassword(password);
      expect(userWithPassword.password).toEqual(password);
      expect(userWithPassword).not.toBe(user);

      const username = "guest";
      const userWithUsername = user.withUsername(username);
      expect(userWithUsername.username).toEqual(username);
      expect(userWithUsername).not.toBe(user);
    });
  });
});
