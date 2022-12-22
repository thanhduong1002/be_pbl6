// CRUD create read update delete

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'PBL6'

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error){
        return console.log(error)
    }
    // console.log('Connected correctly!');
    const db = client.db(databaseName);

    db.collection('products').insertOne({
        name: 'Quần Áo Nữ Đẹp Giá Rẻ Ngắn Tay Mặc Đi Chơi Xinh Cute',
        price: 45000,
        star: 4.5,
        sold: 1.8
        
    }, (error, result) => {
        if(error){
            return console.log('Unable to insert user');
        }
        console.log(result);
    })
})  