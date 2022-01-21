

import {UserRepository, FakeUserRepository, MongoUserRepository} from '../adapters/repository';

type UnitOfWork = {
    userRepository : UserRepository;
}

class FakeUnitOfWork implements UnitOfWork {
    userRepository: UserRepository;
    constructor(){
        this.userRepository = new FakeUserRepository();
    }
}

class MongoUnitOfWork implements UnitOfWork {
    userRepository: UserRepository;
    constructor(){
        this.userRepository = new MongoUserRepository();
    }
}


export {UnitOfWork, FakeUnitOfWork, MongoUnitOfWork};