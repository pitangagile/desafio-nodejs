import { APIError, User } from "../domain/models";
import {UserModel} from "../config/database";

type UserRepository = {
  findUser: (query: any) => Promise<User | undefined | null>;
  create: (user: User) => Promise<User>;
  update: (user: User) => Promise<User>;
};

class FakeUserRepository implements UserRepository {
  users: User[] = [];
  printUsers: () => void = () => {
    console.log(this.users);
  };
  async findUser(query: any) {
    if (query.email) {
      const user = this.users.find((u) => u.email === query.email);
      if(user) { return user; }
    } else if (query._id) {
      const user = this.users.find((u) => u._id === query._id);
      if(user) { return user; }
    }
  }
  async create(user: User) {
    user._id = user.email.toLowerCase();
    this.users.push(user);
    return user;
  }
  async update(user: User) {
    // replaces the user with the same email if it exists
    const index = this.users.findIndex((u) => u.email === user.email);
    if (index !== -1) {
      this.users[index] = user;
    } else {
      this.users.push(user);
    }
    return user;
  }
}



class MongoUserRepository implements UserRepository {
  async findUser(query: any) {
    const user = await UserModel.findOne(query);
    if (!user) { return undefined; }
    return user.toJSON() as User;
  }
  async create(user: User) {
    const newUser = new UserModel(user);
    await newUser.save();
    return newUser.toJSON() as User;
  }
  async update(user: User) {
    const updatedUser = await UserModel.findOneAndUpdate({ _id: user._id }, user, {lastLogin: Date.now()});
    if (!updatedUser) { throw new APIError("User not found", 404);}
    return updatedUser.toJSON() as User;
  }
}

export { UserRepository, FakeUserRepository, MongoUserRepository };
