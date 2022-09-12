import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import * as Joi from "joi";
import { CreateUserOptions } from "./options/create-user.options";
import { Exclude } from "class-transformer";

@Entity("user")
export class User {

  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column({
    type: "varchar",
    unique: true
  })
  public readonly email: string;

  @Column({
    type: "varchar"
  })
  public readonly username: string;

  @Exclude()
  @Column({
    type: "varchar"
  })
  public readonly password: string;

  public static createOne(options: CreateUserOptions): User {
    const plain = { ...options };
    Reflect.setPrototypeOf(plain, User.prototype);

    return plain as User;
  }

  public withEmail(email: string): User {
    return User.createOne({ ...this, email });
  };

  public withUsername(username: string): User {
    return User.createOne({ ...this, username });
  };

  public withPassword(password: string): User {
    return User.createOne({ ...this, password });
  };

  @BeforeInsert()
  @BeforeUpdate()
  public async _hashPassword(): Promise<void> {

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(this.password, salt);
    Reflect.set(this, "password", hashedPassword);
  }
}
