const mongoose = require('mongoose');
const live_url = 'mongodb+srv://nakulpal105:nakulpalpassword@cluster0.gxanihe.mongodb.net/MPCTAdmission?retryWrites=true&w=majority'
const local_url = 'mongodb://127.0.0.1:27017/MPCTAdmission'

const connectDbs = () => {

    return mongoose.connect(live_url)
        .then(() => {
            console.log('Connect To MongoDb')
        }).catch((error) => {
            console.log(error)
        })

};

module.exports = connectDbs;