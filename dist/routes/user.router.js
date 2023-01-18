import { authUser, comparePassword, genPassword, issueJWT, verifyJwt } from '../helpers/util.helper.js';
import { validateUser } from '../middlewares/user.middleware.js';
import { User } from '../model/user.model.js';
import { v4 } from 'uuid';
export const joinUser = (io, socket, payload) => {
    /**
     * if user comes with authorization token
     */
    if (payload?.token) {
        const auth = verifyJwt(payload?.token);
        if (!auth.validate) {
            socket.emit('user:signup:fail', {
                general: ['signup expired']
            });
        }
        else {
            /**
             * check if token user really exist or not.
             */
            User.findByIdAndUpdate(auth.id, { socketId: socket.id }).then((result) => {
                if (result) {
                    const jwt = issueJWT(auth.id);
                    socket.emit('user:signup:success', {
                        token: jwt.token,
                        expires: jwt.expires
                    });
                }
                else {
                    socket.emit('user:signup:fail', {
                        general: ["signup expired."]
                    });
                }
            }).catch((e) => {
                socket.emit('user:signup:fail', {
                    general: [e.message]
                });
            });
        }
    }
    else {
        /**
         * validating user's email and password
         */
        const user = validateUser(payload);
        if (!user.validate) {
            socket.emit('user:signup:fail', user.errors);
        }
        else {
            /**
             * checking : user exist or not.
             */
            User.findOneAndUpdate({ email: user.data.email }, { socketId: socket.id }).then((result) => {
                if (result) {
                    /**
                     * if user exists, verify the his given password
                     */
                    const encryptPassword = comparePassword(user.data.password, result.hash, result.salt);
                    if (!encryptPassword) {
                        socket.emit('user:signup:fail', {
                            password: ["wrong password"]
                        });
                    }
                    else {
                        /**
                         * password match -> generate jwt token
                         */
                        socket.join(result.roomId);
                        const jwt = issueJWT(result.id);
                        socket.emit('user:signup:success', {
                            token: jwt.token,
                            expires: jwt.expires
                        });
                        socket.broadcast.emit('user:all', {
                            general: [`${result.email} joined`]
                        });
                    }
                }
                else {
                    /**
                     * if user does not exist, create register the new user
                     */
                    const encryptPassword = genPassword(user.data.password);
                    const roomId = v4();
                    User.create({
                        email: user.data.email,
                        hash: encryptPassword.hash,
                        salt: encryptPassword.salt,
                        socketId: socket.id,
                        roomId: roomId
                    }).then((result) => {
                        /**
                         * join the room with newly registered roomId
                         * generate jwt token
                         */
                        socket.join(result.roomId);
                        const jwt = issueJWT(result.id);
                        socket.emit('user:signup:success', {
                            token: jwt.token,
                            expires: jwt.expires
                        });
                        socket.broadcast.emit('user:all', {
                            general: [`${result.email} joined`]
                        });
                    }).catch((e) => {
                        /**
                         * if we reach this code in execution then
                         * there is some problem in above logic
                         * because if email already exist then it has to signin above
                         */
                        if (e["errors"] && e["errors"]["email"]?.message) {
                            socket.emit('user:signup:fail', {
                                email: [e["errors"]["email"]?.message]
                            });
                        }
                        else {
                            socket.emit('user:signup:fail', {
                                general: [e.message]
                            });
                        }
                    });
                }
            }).catch((e) => {
                socket.emit('user:signup:fail', {
                    general: [e.message]
                });
            });
        }
    }
};
export const getOnlineUsers = (io, socket, payload) => {
    /**
     * checking if the person who is asking for the data is in the system or not.
     */
    authUser(payload['Authorization'], (jwtValidate) => {
        if (!jwtValidate) {
            socket.emit('user:signup:fail', {
                general: ["signup expired"]
            });
        }
        else {
            /**
             * fetch all the socket
             * matching with returned db result each document socketId, -> that's online
             * @return Map
             */
            const sockets = io.sockets;
            User.find({}).then((result) => {
                if (result) {
                    const onlineUser = [...sockets.adapter.sids.keys()];
                    const filterUsers = result.filter((key) => {
                        return onlineUser.includes(key.socketId) && key.socketId !== socket.id;
                    });
                    socket.emit('user:get_onlines:success', {
                        users: filterUsers
                    });
                }
                else {
                    socket.emit('user:get_onlines:success', {
                        users: []
                    });
                }
            }).catch((e) => {
                socket.emit('user:get_onlines:fail', {
                    general: [e.message]
                });
            });
        }
    });
};
export const leaveRoom = (io, socket, payload) => {
    User.findOne({ socketId: socket.id }).then((result) => {
        if (result) {
            socket.leave(result.roomId);
        }
        else {
            console.log('something went wrong in signup logic');
        }
    }).catch((e) => {
        console.log(`something went wrong : ${e.message}`);
    });
};
//# sourceMappingURL=user.router.js.map