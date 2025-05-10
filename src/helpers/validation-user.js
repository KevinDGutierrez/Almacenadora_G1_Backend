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

export const checkCredentials = async (user, password = '') => {
    const isMatch = await verify(user.password, password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
};

export const checkRolePermission = (user, idParam) => {
    if (user.id !== idParam && user.role !== 'ADMINISTRATOR') {
        throw new Error('You are not authorized to update this user');
    }
};

export const checkPermission = (req, res, next) => {
    const user = req.user; 
    const idParam = req.params.id;

    if (user.id !== idParam && user.role !== 'ADMINISTRATOR') {
        return res.status(403).json({ 
            success: false,
            msg: 'You are not authorized to update o delete things'
        });
    }

    next();
};

export const checkPermissionAdd = (req, res, next) => {
    const user = req.user; 
    const idParam = req.params.id;

    if (user.id !== idParam && !['ADMINISTRATOR', 'EMPLOYEE'].includes(user.role)) {
        return res.status(403).json({ 
            success: false,
            msg: 'You are not authorized to update this user'
        });
    }

    next();
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

export const noActualizarAdmin = async (id) => {
 
    const user = await User.findById(id);
   
    if (user.username === "Employee" || user.username === "administrator") {
        throw new Error('ADMINISTRATOR NOT UPDATING OR DELETE');
    }
}
 