const User = require('../models/user');

module.exports = {
    filterinfo: async (req, res) => {
        try {
            await User.findOne({ _id: req.params.id }).then(async result => {
    
                let object;
                console.log(result.interest);
                if (result.interest === "all") {
                     await User.find({  _id: { $ne: req.params.id },age: { $gte: result.minage, $lte: result.maxage } })
                        .then(ketqua => {
                            return res.status(200).json({
                              object:  ketqua
                            });
                        });
                }
                else {
                    await User.find({ _id: { $ne: req.params.id }, sex: result.interest, age: { $gte: result.minage, $lte: result.maxage } })
                    .then(ketqua => {
                        return res.status(200).json({
                            object: ketqua
                        });
                    });
                }
            })
            // if (!req.query.interest) {
            //     await User.find({age: {$gte: req.query.minage, $lte: req.query.maxage}})
            //     .then(result => {
            //             return res.status(200).json({
            //             user: result
            //         });
            //     });
            // } else {
            //     await User.find({age: {$gte: req.query.minage, $lte: req.query.maxage}, sex: req.query.interest})
            //     .then(result => {
            //             return res.status(200).json({
            //             user: result
            //         });
            //     });
            // }
        } catch (err) {
            console.log('Error ' + err);
            res.status(400).json({
                message: err
            });
        }
    },
    // age: async (req, res) => {
    //     try {
    //         await Promise.all([User.find({ age: { $gte: req.body.minage, $lte: req.body.maxage } }).then(async result => {
    //             return res.status(200).json({
    //                 ketqua: result
    //             })
    //         })]);


    //     } catch (err) {
    //         console.log('Error ' + err);
    //         res.status(400).json({
    //             message: err
    //         });
    //     }
    // }
}