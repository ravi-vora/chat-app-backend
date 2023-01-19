import { authUser } from "../helpers/util.helper.js";
import { validateChat } from "../middlewares/chat.middleware.js";
import { Chat } from "../model/chat.model.js";
import { User } from "../model/user.model.js";
export const sendMessage = (io, socket, payload) => {
    const { target_user, Authorization, message } = payload;
    const payloadCheck = validateChat({
        target_user,
        Authorization,
        message
    });
    /**
     * validating payload schema within value
     */
    if (!payloadCheck.validate) {
        socket.emit('chat:message:fail', payloadCheck.errors);
    }
    else {
        /**
         * checking the one who's sending message is authorized or not
         */
        authUser(Authorization, (jwtValidate) => {
            if (!jwtValidate.validate) {
                socket.emit('user:signup:fail', {
                    general: ["signup expired"]
                });
            }
            {
                /**
                 * find targeted user's room id to send message in reciever room
                 */
                User.findOne({ email: target_user.trim() }).then((reciever_result) => {
                    if (!reciever_result) {
                        socket.emit('chat:message:fail', {
                            general: ["user is not registered."]
                        });
                    }
                    else {
                        const chat = {
                            sender: jwtValidate.user.id,
                            receiver: reciever_result.id,
                            message: message
                        };
                        /**
                         * register chat within sender and reciever
                         */
                        Chat.create(chat).then((result) => {
                            if (result) {
                                /**
                                 * emiting on reciever's room and sender's socket
                                 */
                                io.to(reciever_result.roomId).emit('chat:message:recieve', {
                                    message: result.message,
                                    sender: jwtValidate.user.email,
                                    reciever: reciever_result.email
                                });
                                socket.emit('chat:message:success', {
                                    sender: jwtValidate.user.email,
                                    reciever: reciever_result.email,
                                    message: chat.message
                                });
                            }
                            else {
                                socket.emit('chat:message:fail', {
                                    general: ["something went wrong, LOGIC_ERROR"]
                                });
                            }
                        }).catch((e) => {
                            socket.emit('chat:message:fail', {
                                general: [e.message]
                            });
                        });
                    }
                }).catch((e) => {
                    socket.emit('chat:message:fail', {
                        general: [e.message]
                    });
                });
            }
        });
    }
};
export const viewMessage = (io, socket, payload) => {
    const authorization = payload.Authorization;
    const sender = payload.sender;
    /**
     * check user has send authorization or not
     */
    if (!authorization || authorization === "") {
        socket.emit('user:signup:fail', {
            general: ["signup expired"]
        });
    }
    else if (!sender || sender === "") {
        socket.emit('user:signup:fail', {
            general: ["sender is required."]
        });
    }
    else {
        /**
         * validate the authorization token
         */
        authUser(authorization, (jwtValidate) => {
            if (!jwtValidate.validate) {
                socket.emit('user:signup:fail', {
                    general: ['signup expired']
                });
            }
            else {
                /**
                 * get all messages that are not viewed
                 */
                User.findOne({ email: sender }).then((sender_result) => {
                    Chat.find({ receiver: jwtValidate.user.id, sender: sender_result.id, viewed: false }).then((messages) => {
                        /**
                         * update the status of not viewed message and return those to reciever.
                         */
                        Chat.updateMany({
                            receiver: jwtValidate.user.id,
                            sender: sender_result.id
                        }, { viewed: true }, { new: true })
                            .then((result) => {
                            socket.emit('chat:message:view:success', result.matchedCount > 0 ? messages : []);
                        }).catch((e) => {
                            socket.emit('chat:message:view:fail', {
                                general: [e.message]
                            });
                        });
                    }).catch((e) => {
                        socket.emit('chat:message:view:fail', {
                            general: [e.message]
                        });
                    });
                }).catch((e) => {
                    socket.emit('chat:message:view:fail', {
                        general: [e.message]
                    });
                });
            }
        });
    }
};
//# sourceMappingURL=chat.router.js.map