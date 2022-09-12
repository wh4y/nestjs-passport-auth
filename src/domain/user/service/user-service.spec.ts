import { UserService } from "./user.service";
import { Repository } from "typeorm";
import { User } from "../entity/user.entity";
import { CreateUserOptions } from "../entity/options/create-user.options";
import { UpdateUserOptions } from "./options/update-user.options";

describe("UserService", () => {
  let userRepositoryMock: Partial<Repository<User>>;
  let userService: UserService;

  const createUserOptions: CreateUserOptions = {
    email: "test@test.com",
    username: "test",
    password: "Test-00000"
  };

  beforeEach(() => {
    userRepositoryMock = {
      save: jest.fn(),
      delete: jest.fn()
    };

    userService = new UserService(userRepositoryMock as Repository<User>);

    jest.spyOn(userService, "findById");
    jest.spyOn(userService, "delete");
  });

  describe("create", () => {
    it("should create a user", async () => {
      userRepositoryMock.findOne = jest.fn().mockReturnValue(null);

      const user: User = await userService.create(createUserOptions);

      expect(userRepositoryMock.findOne).toBeCalledTimes(1);
      expect(userRepositoryMock.save).toBeCalledTimes(1);

      expect(user.email).toEqual(createUserOptions.email);
      expect(user.username).toEqual(createUserOptions.username);
      expect(user.password).toEqual(createUserOptions.password);
    });

    it("should throw an exception", () => {
      userRepositoryMock.findOne = jest.fn().mockReturnValue(true);

      expect(async () => await userService.create(createUserOptions)).rejects.toThrowError("User already exists!");
    });
  });

  describe("delete", () => {
    it("should delete a user", async () => {
      userRepositoryMock.findOne = jest.fn().mockReturnValue(true);

      await userService.delete("id");

      expect(userService.delete).toBeCalledTimes(1);
      expect(userRepositoryMock.delete).toBeCalledTimes(1);
    });

    it("should throw an exception", () => {
      userRepositoryMock.findOne = jest.fn().mockReturnValue(null);

      expect(async () => await userService.delete("id")).rejects.toThrowError("User doesn't exist!");
      expect(userRepositoryMock.delete).toBeCalledTimes(0);
      expect(userService.delete).toBeCalledTimes(1);
    });
  });

  describe("edit", () => {
    it("should change user's response", async () => {
      userRepositoryMock.findOne = jest.fn().mockReturnValue(true);

      const user = User.createOne(createUserOptions);
      const updateOptions: UpdateUserOptions = { email: "new@test.com", username: "yollo" };

      const updatedUser = await userService.edit(user, updateOptions);

      expect(updatedUser).not.toBe(user);
      expect(updatedUser).toBeInstanceOf(User);
      expect(updatedUser.email).toEqual(updateOptions.email);
      expect(updatedUser.username).toEqual(updateOptions.username);

      expect(userRepositoryMock.findOne).toBeCalledTimes(1);
      expect(userRepositoryMock.save).toBeCalledTimes(1);
    });
  });
});
