import { UserSchema, UserError } from "../config/user.config.js"
import { validateEmail } from "../helpers/util.helper.js";

export const validateUser = (user) : {validate: boolean, errors?: any, data?: any} => {
    const {
        email,
        password
    } : UserSchema = user;

    const errors : UserError = {
        email: [],
        password: [],
        general: []
    }

    if ( !email || email === "") errors.email.push("Email is required")
    if ( !password || password === "") errors.password.push("Password is required")

    if ( email && !validateEmail(email) ) errors.email.push("Email is invalid.")

    if (
        errors.email.length > 0 ||
        errors.password.length > 0
    ) {
        Object.keys(errors).map(( key: string, index: number ) : void => {
            if ( errors[key].length < 1 ) delete errors[key];
        })
        return {
            validate: false,
            errors
        };
    } else return {
        validate: true,
        data: {
            email,
            password
        }
    }
}
