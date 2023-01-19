export interface ChatSchema {
    sender: string,
    receiver: string,
    message
}

export interface ChatPayloadErrorSchema {
    target_user: string[],
    Authorization: string[],
    message: string[]
}

export interface ChatPayloadSchema {
    target_user: string,
    Authorization: string,
    message: string
}