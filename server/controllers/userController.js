import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

const escapeRegex = (value)=> value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const emailRegex = (email)=> new RegExp(`^${escapeRegex(email.trim().toLowerCase())}$`, "i");

// Signup a new user
export const signup = async (req, res)=>{
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio){
            return res.json({success: false, message: "Missing Details" })
        }
        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({email: emailRegex(normalizedEmail)});

        if(user){
            return res.json({success: false, message: "Account already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName, email: normalizedEmail, password: hashedPassword, bio
        });


        const token = generateToken(newUser._id)
        const userData = newUser.toObject();
        delete userData.password;

        res.json({success: true, userData, token, message: "Account created successfully"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// Controller to login a user
export const login = async (req, res)=>{
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.trim().toLowerCase();
        const userData = await User.findOne({email: emailRegex(normalizedEmail)})

        if(!userData){
            return res.json({ success: false, message: "Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if(!isPasswordCorrect){
            return res.json({ success: false, message: "Invalid credentials"});
        }

        const token = generateToken(userData._id)
        const safeUserData = userData.toObject();
        delete safeUserData.password;

        res.json({success: true, userData: safeUserData, token, message: "Login successful"})
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Controller to check if user is authenticated
export const checkAuth = (req, res)=>{
    res.json({success: true, user: req.user});
}

// Controller to update user profile details
export const updateProfile = async (req, res)=>{
    try {
        const { profilePic, bio, fullName, email, newPassword } = req.body;

        const userId = req.user._id;
        const updates = { bio, fullName };
        const trimmedEmail = email?.trim().toLowerCase();
        const currentEmail = req.user.email?.trim().toLowerCase();
        const emailChanged = trimmedEmail && trimmedEmail !== currentEmail;
        const passwordChanged = Boolean(newPassword);

        if(!fullName || !bio || !trimmedEmail){
            return res.json({success: false, message: "Missing Details" });
        }

        if(passwordChanged && newPassword.length < 6){
            return res.json({success: false, message: "Password must be at least 6 characters" });
        }

        if(emailChanged){
            const existingUser = await User.findOne({ email: emailRegex(trimmedEmail), _id: { $ne: userId } });

            if(existingUser){
                return res.json({success: false, message: "Email address is already in use" });
            }

            updates.email = trimmedEmail;
        }

        if(passwordChanged){
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(newPassword, salt);
        }

        if(profilePic){
            const upload = await cloudinary.uploader.upload(profilePic);
            updates.profilePic = upload.secure_url;
        }

        const updateUser = await User.findByIdAndUpdate(userId, updates, {new: true}).select("-password");

        res.json({success: true, user: updateUser})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
