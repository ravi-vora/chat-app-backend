import { validateEmail } from "../helpers/util.helper.js";
export const validateUser = (user) => {
    const { email, password } = user;
    const errors = {
        email: [],
        password: [],
        general: []
    };
    if (!email && email === "")
        errors.email.push("Email is required");
    if (!password && password === "")
        errors.password.push("Password is required");
    if (email && !validateEmail(email))
        errors.email.push("Email is invalid.");
    if (errors.email.length > 0 ||
        errors.password.length > 0) {
        Object.keys(errors).map((key, index) => {
            if (errors[key].length < 1)
                delete errors[key];
        });
        return {
            validate: false,
            errors
        };
    }
    else
        return {
            validate: true,
            data: {
                email,
                password
            }
        };
};
//# sourceMappingURL=user.middleware.js.map