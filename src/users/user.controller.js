import { response } from "express";
import { hash } from "argon2";
import { generarJWT } from "../helpers/generate-jwt.js";
import User from "./user.model.js";
import {
  getUserByUsername,
  getUserByEmail,
  checkUserStatus,
  checkPassword,
  checkRolePermission,
  checkActualPassword,
  checkUsernameLower,
  getUserByIdvalidation,
  checkCredentials,
  checkRequiredData,
  noActualizarAdmin
} from "../helpers/validation-user.js";

export const register = async (req, res) => {
  try {
    const data = req.body;
    const encryptedPassword = await hash(data.password);

    const user = await User.create({
      name: data.name,
      surname: data.surname,
      username: data.username.toLowerCase(),
      email: data.email.toLowerCase(),
      phone: data.phone,
      password: encryptedPassword,
      role: data.role,
    });

    return res.status(201).json({
      message: "user registered successfully",
      userDetails: {
        user: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "user registration failed",
      error,
    });
  }
};

export const login = async (req, res) => {
    try {
      const { email, password, username } = req.body;
  
      
      const user = email
        ? await getUserByEmail(email)
        : await getUserByUsername(username);
  
      checkUserStatus(user);
  
      await checkPassword(user, password);
  
      const token = await generarJWT(user.id);
  
      return res.status(200).json({
        msg: "Login successful",
        userDetails: {
          username: user.username,
          token: token,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: "Error logging in",
        error: error.message,
      });
    }
  };

  export const updateUser = async (req, res) => {
    try {
      const user = req.user;
      const { password, actualpassword, ...data } = req.body;
      let { username } = req.body;
  
      await noActualizarAdmin(user._id)
      data.password = await checkActualPassword(user, actualpassword, password);
  
      if (username) {
        username = username.toLowerCase();
        data.username = username;
      }
  
      const UserUpdate = await User.findByIdAndUpdate(user._id, data, { new: true });
  
      res.status(200).json({
        success: true,
        msg: "user Updated",
        UserUpdate,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: "Error updating user",
        error: error.message || error,
      });
    }
  };

export const getUsers = async (req, res = response) => {
  try {
    const { limite = 10, desde = 0 } = req.query || {};

    const [total, users] = await Promise.all([
      User.countDocuments({ status: true }),
      User.find({ status: true }).skip(Number(desde)).limit(Number(limite))
    ]);

    res.json({
      total,
      users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

export const getUserById = async (req, res) => {
    try {
      const user = req.user;
        
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  };

export const createAdmin = async () => {
  try {
    const user = await User.findOne({ username: "admin" });

    if (!user) {
      const password = await hash("12345678");
      const newUser = new User({
        name: "Kevin",
        surname: "Gutierrez",
        username: "admin",
        email: "kevin161@gmail.com",
        phone: "32111213",
        password: password,
        role: "ADMINISTRATOR",
      });
      await newUser.save();
      console.log("Admin created successfully");
    } else {
      console.log("Admin already exists");
    }
  } catch (error) {
    console.error("Failed to create Admin: ", error);
  }
};

export const deleteUser = async (req, res) => {
    try {
      const user = req.user;
      const { username, email, password } = req.body;

      await noActualizarAdmin(user._id);
      await getUserByUsername(username.toLowerCase());
      checkRequiredData(username, email, password);
      checkUsernameLower(user, username.toLowerCase());
      await checkCredentials(user, password);
  
      const updatedUser = await User.findByIdAndUpdate(user._id, { status: false }, { new: true });
  
      return res.status(200).json({
        success: true,
        msg: "User deactivated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Error deleting user",
        error: error.message || error,
      });
    }
  };
