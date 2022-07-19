const mockingoose = require('mockingoose');
const { ObjectId } = require('mongodb');
const { alreadyExistById, alreadyExistByEmail, checkPassword, roomExistByUsersId } = require('../validate/dbCheck');
const User = require('../models/User');
const Room = require('../models/Room');
const bcrypt = require('bcrypt');
const saltRounds = 10;

jest.setTimeout(10000);

describe('DB checks', () => {

    describe('alreadyExistByEmail', () => {

        it('should return the user', async () => {
            mockingoose(User).toReturn({
                firstName: 'Lorenzo',
                lastName: 'Pachioli',
                email: 'lorenzo@gmail.com',
                password: 123456,
                online: false
            }, 'findOne');
            const results = await alreadyExistByEmail('lorenzo@gmail.com');
            expect(results.email).toBe('lorenzo@gmail.com');
        });

        it('should return false', async () => {
            mockingoose(User).toReturn(null, 'findOne');
            const results = await alreadyExistByEmail('lorenzoP@gmail.com');
            expect(results).toBe(false);
        });
    });

    describe('alreadyExistById', () => {

        it('should return the user', async () => {
            mockingoose(User).toReturn({
                _id: '507f191e810c19729de860ea',
                firstName: 'Lorenzo',
                lastName: 'Pachioli',
                email: 'lorenzo@gmail.com',
                password: 123456,
                online: false
            }, 'findOne');
            const results = await alreadyExistById('507f191e810c19729de860ea', User);
            expect(results._id.toString()).toEqual('507f191e810c19729de860ea');
        });

        it('should return false', async () => {
            mockingoose(User).toReturn(null, 'findOne');
            const results = await alreadyExistById(new ObjectId(), User);
            expect(results).toBe(false);
        });
    });

    describe('checkPassword', () => {

        it('should return the true', () => {
            const password = '123456';
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);
            const results = checkPassword(password, hash);
            expect(results).toBe(true);
        });

        it('should return false', () => {
            const password = '123456';
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);
            const results = checkPassword('1234567', hash);
            expect(results).toBe(false);
        });
    });

    describe('roomExistByUsersId', () => {

        it('should return the room', async () => {
            const user1 = '507f191e810c19729de855ef';
            const user2 = '507f191e810c19729de870aa';
            mockingoose(Room).toReturn({
                _id: '507f191e810c19729de860ea',
                messages: [],
                users: [user1, user2]
            }, 'find');
            const results = await roomExistByUsersId(user1, user2);
            expect(results._id.toString()).toEqual('507f191e810c19729de860ea');
        });

        it('should return false', async () => {
            const user1 = '507f191e810c19729de855ef';
            const user2 = '507f191e810c19729de870aa';
            mockingoose(Room).toReturn(null, 'find');
            const results = await roomExistByUsersId(user1, user2);
            expect(results).toBe(false);
        });
    });
});