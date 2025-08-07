export class CustomError extends Error {
    statusCode: number
    status: string
    isOperational: boolean
    code: string | null
    message: string

    constructor(message: string, statusCode: number, code: string | null = null) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.code = code;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}