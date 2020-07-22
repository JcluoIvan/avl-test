import { HttpStatus } from '../typings';

export class BaseError extends Error {
    public status = HttpStatus.StatusInternalServerError;
    public code = 0;
    constructor(message: string = '', code = 0) {
        super(message);
        this.code = code;
        this.message = message;
    }
}

export class BadRequestError extends BaseError {
    public statuc = HttpStatus.StatusBadRequest;
    constructor(message = 'bad request') {
        super(message);
    }
}
export class ForbiddenError extends BaseError {
    public statuc = HttpStatus.StatusForbidden;
    constructor(message = 'forbidden') {
        super(message);
    }
}
export class NotFoundError extends BaseError {
    public status = HttpStatus.StatusNotFound;
    constructor(message = 'not found') {
        super(message);
    }
}

export class ServerError extends BaseError {
    public statuc = HttpStatus.StatusInternalServerError;
    constructor(message = 'server error') {
        super(message);
    }
}
