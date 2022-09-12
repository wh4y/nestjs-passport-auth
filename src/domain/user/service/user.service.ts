import { Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { Repository } from "typeorm";
import { IUserService } from "./interface/user-service.interface";
import { UpdateUserOptions } from "./options/update-user.options";
import { FindUserOptions } from "./options/find-user.options";
import { CreateUserOptions } from "../entity/options/create-user.options";

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
  }

  async create(options: CreateUserOptions): Promise<User> {
    const existingUser = await this.findByEmail(options.email);
    if (existingUser) throw new Error("User already exists!");

    let user = User.createOne(options);
    user = await this.userRepository.save(user);

    return user;
  }

  async delete(id: string): Promise<void> {
    const existingUser = await this.findById(id);
    if (!existingUser) throw new Error("User doesn't exist!");

    await this.userRepository.delete({ id });
  }

  async edit(user: User, options: UpdateUserOptions): Promise<User> {
    const existingUser = await this.findById(user.id);
    if (!existingUser) throw new Error("User doesn't exist!");

    const plain = { ...user, ...options };
    Reflect.setPrototypeOf(plain, User.prototype);

    await this.userRepository.save(plain);

    return plain as User;
  }

  async findBy(options: FindUserOptions): Promise<User | User[]> {
    return await this.userRepository.find({ where: options });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }
}
