import {ChatPayloadErrorSchema, ChatPayloadSchema} from '../config/chat.config.js'


export const validateChat = (chat: ChatPayloadSchema) : { validate: boolean, errors?: ChatPayloadErrorSchema } => {
    const errors : ChatPayloadErrorSchema = {
        Authorization: [],
        target_user: [],
        message: []
    }
    if (!chat.Authorization || chat.Authorization === "") errors.Authorization.push("'Authorization' is required")
    if (!chat.target_user || chat.target_user === "") errors.target_user.push("'target_user' is required")
    if (!chat.message || chat.message === "") errors.message.push("'message' is required")

    if (
        errors.Authorization.length > 0 ||
        errors.target_user.length > 0 ||
        errors.message.length > 0 
    ) {
        Object.keys(errors).map((key: string, index: number) => {
            if (errors[key].length < 1) delete errors[key]
        })

        return {
            validate: false,
            errors
        }
    } else return {
        validate: true
    }
}