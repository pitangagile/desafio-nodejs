const UserValidator = require('./UserValidator')
const DataBaseManager = require('./DataBaseManager')

class User{

    constructor(){
        this.userValidator = new UserValidator()
    }

    init = async userData =>{
        if(userData == null)
            throw new Error("User must be instantiated from data either validated by SignUpValidator or from database.")

        if(!this.userValidator.isValidUser(userData))
            throw new Error("Userdata is invalid.")
        this.userData = userData

        if(!this.userValidator.isValidExistingUser(userData))
            this._addTimeFieldsForDB()

        this.dataBaseManager = new DataBaseManager()
        let userOnDB = await this.dataBaseManager.get(userData)
        if(userOnDB == null)
            this.isOnDB = false
        else
            this.isOnDB = true

        return this
    }

    _addTimeFieldsForDB = () =>{
        this.userData['created_at'] = new Date()
        this.userData['last_login'] = new Date(0)
        return this
    }

    addRefreshToken = refreshToken =>{
        if(this.userData == null)
            throw new Error("No data. Call init() method.")

        if(this.userValidator.isValidExistingUser(this.userData)) return;
        this.userData.refreshToken = refreshToken
    }

    pushToDB = async () =>{
        if(this.userData == null)
            throw new Error("No data. Call init() method.")

        if(this.isOnDB){
            let query = {email: this.userData.email}
            this.dataBaseManager.update(query, this.userData)
            return this
        }

        if(!('refreshToken' in this.userData))
            throw new Error("Can't add user to database. Missing refresh token.")

        this.dataBaseManager.put(this.userData)
        this.isOnDB = true
        return this
    }

    updateLastLogin = async () =>{
        if(this.userData == null)
            throw new Error("No data. Call init() method.")

        if(!this.isOnDB)
            throw new Error("User not on database")
        let query = {email: this.userData.email}
        let currentTimestamp = new Date()
        let update = {last_login: currentTimestamp}
        this.dataBaseManager.update(query, update)
    }

}

module.exports = User