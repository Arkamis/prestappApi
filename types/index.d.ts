declare namespace Express {
    interface Request {
        token?: string;
        user: import('../src/services/users/user.interface').IUser;
    }
}