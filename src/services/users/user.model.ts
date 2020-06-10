import mongoose from 'mongoose';
import { IUser, IUserModel } from "./user.interface";
import bcrypt from 'bcrypt';
import config from '../../config';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    firstName: {
			type: String,
			required: true,
			trim: true
    }, 
    lastName: {
			type: String,
			required: true,
			trim: true
    },
    phone: {
			type: String,
			required: true,
			trim: true
    },
    password: {
      type: String,
      required: true
		},
		tokens: [String]
  },
  { timestamps: true, versionKey: false}
)

userSchema.pre<IUser>('save', function(next) {
  if (!this.isModified('password')) {
    return next()
  }

  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err)
    }

    this.password = hash;
    next();
  })
});
userSchema.methods.checkPassword = function(password: string){
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err)
      }
      resolve(same)
    })
  })
}

userSchema.statics.findByCredentials = async (email: string, password: string) => {
  const user = await User.findOne({
    email
  })

  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user.toJSON;
}

userSchema.methods.toJSON = function (): Object {
  const user = this;
	const userObject = user.toObject();
	
	delete userObject._id;
  delete userObject.password;
	delete userObject.tokens;
	delete userObject.firstName;
	delete userObject.lastName;
	userObject.fullName = this.fullName;

  return userObject;
}

userSchema.methods.generateAuthToken = async function (): Promise < String > {
	const user = this;
	console.log(this);
  const token = jwt.sign({
    _id: user._id.toString()
  }, config.secrets.jwt);

	user.tokens.push(token);
	await user.save();

  return token;
}

userSchema.virtual('fullName').get(function(this: {firstName: String, lastName: String}){
	return this.firstName + " " + this.lastName;
});
export const User = mongoose.model<IUser, IUserModel>('user', userSchema)