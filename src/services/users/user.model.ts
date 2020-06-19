import mongoose, { Schema } from 'mongoose';
import { IUser, IUserModel } from "./user.interface";
import bcrypt from 'bcrypt';
import { newToken } from '../../utils/auth';
import createHttpError from 'http-errors';

const isOwner =  function (this: IUser):boolean {
  return this.rol === 'owner';
};
const isDebtor =  function (this: IUser):boolean {
  return this.rol === 'debtor';
};
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
      trim: true,
      required: [ 
        isOwner, 
        'Must be Provide for Users with type owners'
      ]
    },
    firstName: {
			type: String,
			required: true,
			trim: true
    }, 
    emailAsDebtor: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
      trim: true,
      required: [ 
        isDebtor, 
        'Must be Provide for Users with type owners'
      ]
    },
    lastName: {
			type: String,
			required: true,
			trim: true
    },
    phone: {
			type: String,
			trim: true
    },
    password: {
      type: String,
      required: [
        isOwner,
        'Password Must be Provide for Users with type owners'
      ]
    },
    isEmailVerified: Boolean,
    tokens: [String],
    rol: {
      type: String,
      enum: ['owner', 'debtor'],
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: function(this: IUser){
        console.log("Validator del this:", this)
        return this.rol === 'debtor';
      }
    }
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
  });
});

userSchema.methods.checkPassword = function(password: string): Promise<boolean>{
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err)
      }
      resolve(same)
    })
  });
}

userSchema.statics.findByCredentials = async (email: string, password: string) => {
  const user = await User.findOne({
    email
  });

  if (!user) {
    throw createHttpError(404, 'Usuario y/o contasena invalidos, ingrese Credenciales validas porfavor.');
  }

  const isMatch = await user.checkPassword(password);

  if (!isMatch) {
    throw createHttpError(404, 'Usuario y/o contasena invalidos, ingrese Credenciales validas porfavor.');
  }
  return user;
}

userSchema.methods.toJSON = function (): Object {
  const user = this;
	const userObject = user.toObject();
  
  delete userObject.createdAt;
  delete userObject.updatedAt
  delete userObject.password;
	delete userObject.tokens;
	delete userObject.firstName;
	delete userObject.lastName;
	userObject.fullName = this.fullName;

  return userObject;
}

userSchema.methods.generateAuthToken = async function (this: IUser): Promise < String > {
  const user = this;
  const token = newToken(user);
  
  user.tokens.push(token);
  await user.save();
  
  return token;
  
}
userSchema.virtual('fullName').get(function(this: {firstName: String, lastName: String}){
	return this.firstName + " " + this.lastName;
});

export const User: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema)