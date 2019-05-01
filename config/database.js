// config/database.js
module.exports = {

    'url' : `mongodb+srv://sabir:${process.env.MONGOPASSWORD}@crud-1-x5qne.mongodb.net/news?retryWrites=true`, // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
    'dbName': 'news'
};
console.log("updated pw", process.env.MONGOPASSWORD )