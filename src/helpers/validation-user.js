import User from '../users/user.model.js';
import { hash, verify } from 'argon2';

export const getUserByUsername = async (username = '') => {
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
        throw new Error(`User with username '${username}' not found`);
    }
    return user;
};

export const getUserByEmail = async (email = '') => {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        throw new Error(`User with email '${email}' not found`);
    }
    return user;
};

export const checkUserStatus = (user) => {
    if (!user || user.status === false) {
        throw new Error('User is disabled');
    }
};

export const checkPassword = async (user, password = '') => {
    const validPassword = await verify(user.password, password);
    if (!validPassword) {
        throw new Error('The password is incorrect');
    }
};

export const checkCredentials = async (user, req, password = '') => {
    const { username, password: reqPassword } = req.body;

    if (!username || !reqPassword) {
        throw new Error('Username and password must be provided');
    }

    const inputUsername = username.trim().toLowerCase();
    const dbUsername = user.username.trim().toLowerCase();

    if (req.user.role !== 'ADMIN' && inputUsername !== dbUsername) {
        throw new Error('Invalid username');
    }

    const isMatch = await verify(user.password, reqPassword);
    if (!isMatch) {
        throw new Error('Invalid password');
    }
};






export const checkRolePermission = (user, idParam) => {
    if (user.id !== idParam && user.role !== 'ADMINISTRATOR') {
        throw new Error('You are not authorized to update this user');
    }
};

export const checkActualPassword = async (user, actualpassword = '', newPassword = '') => {
    if (!actualpassword) {
        throw new Error('You must provide your current password');
    }

    if (!user?.password) {
        throw new Error('Password hash not found in user data');
    }

    const validPassword = await verify(user.password, actualpassword);
    if (!validPassword) {
        throw new Error('Current password is incorrect');
    }

    return newPassword ? await hash(newPassword) : null;
};

export const checkUsernameLower = (user, lowerUsername = '') => {
    const userUsername = user.username.trim().toLowerCase();
    const lowerUserNameTrimmed = lowerUsername.trim().toLowerCase();
    
    console.log('Comparando:', userUsername, lowerUserNameTrimmed);
    
    if (userUsername !== lowerUserNameTrimmed) {
        throw new Error('Invalid username');
    }
};



export const getUserByIdvalidation = async (id = '') => {
    const user = await User.findById(id);
    if (!user) {
      throw new Error(`User with ID '${id}' not found`);
    }
    return user;
  };

export const checkRequiredData = (username = '', email = '', password = '') => {
    if ((!username && !email) || !password) {
        throw new Error('Username or email and password are required');
    }
};
