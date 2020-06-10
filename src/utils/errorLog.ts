import { createWriteStream, WriteStream } from 'fs';
import { join } from 'path';

export const skip = (statusCode: number, maxCode: number = 600, minCode:number = 0): boolean => {
    return statusCode < maxCode && statusCode > minCode;
}
export const stream = (filePath: string): WriteStream | NodeJS.WriteStream => {
    if(process.env.NODE_ENV !== "production"){
        return process.stdout;
    }
    const path = join(__dirname, filePath);
    const options = {
        flags: "a",
    }
    return createWriteStream(path, options);
}