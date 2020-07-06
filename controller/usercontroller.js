const User = require('../models/user');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const saltnumber = bcrypt.genSaltSync();
module.exports = {
    getusers: async (req, res) => {
        try {
            const user = await User.find();
            if (user < 1) {
                res.status(200).json({
                    message: 'khong co user'
                });
            }
            else {
                res.status(200).json({
                    user: user
                });

            }
        } catch (err) {
            console.log('Error ' + err);
            res.status(400).json({
                message: err
            });
        }
    },

    signup: async (req, res) => {
        try {
            console.log(req.body);
            User.findOne({ username: req.body.username }).then(
                user => {
                    if (user) {
                        res.status(200).json({
                            message: 'username da co nguoi dung'
                        });
                    }
                    else {
                        if (req.body.password != req.body.confirmpassword) {
                            res.status(200).json({
                                message: 'mat khau khong trung khop'
                            });
                        }
                        else {
                            bcrypt.hash(req.body.password, saltnumber, (err, hash) => {
                                if (err) {
                                    res.status(200).json({
                                        err: err
                                    });
                                }
                                else {
                                    const user = new User({
                                        username: req.body.username,
                                        password: hash

                                    });
                                    user.save().then(result => {
                                        res.status(200).json({
                                            message: 'tao user thanh cong'
                                        });
                                    });
                                }
                            });

                        }
                    }
                }
            );


        } catch (err) {
            console.log('Error ' + err);
            res.status(400).json({
                message: err
            });
        }
    },
    signin: async (req, res) => {
        try {
            User.findOne({ username: req.body.username }).then(
                user => {

                    if (!user) {
                        res.status(200).json({
                            message: 'username chua dang ki'
                        });
                    }
                    else {


                        bcrypt.compare(req.body.password, user.password, (err, result) => {

                            if (err) {
                                res.status(200).json({
                                    message: 'loi',
                                });
                            }
                            if (result) {
                                const token = jwt.sign({
                                    username: user.username,
                                    id: user._id,
                                }, '12345', {
                                    expiresIn: "24h"
                                });

                                user.token = token;

                                user.save();
                                res.status(200).json({
                                    message: 'dang nhap thanh cong',
                                    user: user,
                                });
                            }
                            else {
                                res.status(200).json({
                                    message: 'mat khau khong trung',
                                });
                            }

                        });

                    }


                }
            )

        } catch (err) {
            console.log('Error ' + err);
            res.status(400).json({
                message: err
            });
        }
    },

    getoneuser: async (req, res) => {
        User.findOne({
            _id: req.params.id
        }).then(result => {
            return res.status(200).json({
                type: '1',
                info: result
            });
        });
    },
    updateuser: async (req, res) => {
        try {

            if (req.file === undefined) {
                console.log(req.body);
                await Promise.all([User.updateOne(
                    { _id: req.params.id },
                    { $set: req.body }
                )]);
                return res.status(200).json({
                    type: '1',
                    message: 'Updated succeeded',
                });
            } else {
                req.body.avatar = `http://localhost:3000/${req.file.path}`;
                console.log(req.body);
                await Promise.all([User.updateOne(
                    { _id: req.params.id },
                    { $set: req.body },
                )]);
                return res.status(200).json({
                    type: '1',
                    message: 'Updated succeeded',
                });
            }
        } catch (err) {
            console.log(err);
            res.status(200).json({
                message: err
            });
        }
    },
    deleteuser: async (req, res) => {
        await Promise.all([User.deleteOne({
            _id: req.params.id
        })]).then(() => {
            return res.status(200).json({
                type: '1',
            });
        });
    },
    changepassword: async (req, res) => {
        User.findOne({ _id: req.params.id }).then(result => {
            if (!bcrypt.compareSync(req.body.oldpassword, result.password)) {
                return res.status(200).json({
                    type: '0',
                });
            }
            else {
                if (req.body.newpassword != req.body.confirm) {
                    return res.status(200).json({
                        type: 'sai roi',
                    });
                }
                else {
                    result.password = bcrypt.hashSync(req.body.newpassword, saltnumber);
                    result.save();
                    return res.status(200).json({
                        type: '1',
                    });
                }
            }
        })
    },
    like: async (req, res) => {
        User.findOne({ _id: req.body.userId }).then(async result => {
            if (result) {
                if (result.userlikedme.indexOf(req.body.likedId) > -1) {
                    User.findOne({ _id: req.body.likedId }).then(async ketqua => {
                        
                        if (ketqua) {
                            
                            ketqua.date.push(req.body.userId);
                            //console.log(ketqua.date);
                            await Promise.all([User.updateOne({ _id: req.body.likedId }, { date: ketqua.date })]).then(() => {
                                return res.status(200).json({
                                    type: 'success',
                                });
                            })
                        }
                    })
                    // User.findOne({ _id: req.body.likedId }).then(async result => {
                    //     if (result) {
                    //         result.date.shift(req.body.userId);
                    //         await Promise.all([User.updateOne({ _id: req.body.likedId }, { date: result.userlikedme })]).then(() => {
                    //             return res.status(200).json({
                    //                 type: 'success',
                    //             });
                    //         })
                    //     }
                    // })
                    result.date.push(req.body.likedId);
                    await Promise.all([User.updateOne({ _id: req.body.userId }, { date: result.date })])
                    return res.status(200).json({
                        type: 'matched',
                    });
                    
                }
                else {
                    User.findOne({ _id: req.body.likedId }).then(async result => {
                        if (result) {
                            result.userlikedme.push(req.body.userId);
                            await Promise.all([User.updateOne({ _id: req.body.likedId }, { userlikedme: result.userlikedme })]).then(() => {
                                return res.status(200).json({
                                    type: 'success',
                                });
                            })
                        }
                    })
                }
            }
            else {
                return res.status(400).json({
                    type: 'like that bai',
                });
            }
        });
    },
    getcrush: async (req, res) => {
        await User.findOne({
            _id: req.params.id
        }).then(async result => {
            let crushes = [];
            await Promise.all([result.userlikedme.forEach(async crush => {
                await User.findOne({ _id: crush }).then((user) => {
                    crushes.push({ avatar: user.avatar, username: user.username, id: user.id });
                })
            })]).then(() => {
                setTimeout(() => {
                    return res.status(200).json({
                        crushes,
                    });
                },100);
            })

        });
    }
}