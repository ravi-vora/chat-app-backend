export interface UserError {
    email: string[],
    password: string[],
    general: string[]
}

export interface UserSchema {
    email: string,
    password: string
}

export interface Password {
    hash: string,
    salt: string
}

export interface Token {
    token: string,
    expires: string
}

export interface TokenStatus {
    validate: boolean,
    message: string,
    id?: string
}

export interface AuthErrorSchema {
    authorization: string[]
}