class UserDTO {
    constructor(user) {
        if (!user) return;
        this._id = user._id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.online = user.online;
    }
}

module.exports = UserDTO;
