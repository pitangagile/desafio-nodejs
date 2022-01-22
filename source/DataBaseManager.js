const {MongoClient} = require('mongodb')

class DataBaseManager{
	constructor(){
		let uri = "mongodb+srv://smartFella:fartSmella@desafionodejs.ifshn.mongodb.net"
		this.client = new MongoClient(uri);
	}

	get = async (query) =>{
		await this.client.connect()
		let result = await this.client.db("DesafioNodeJs").collection("SigningAPI").findOne(query)
		return result
	}

	put = async (data) =>{
		await this.client.connect()
		let result = await this.client.db("DesafioNodeJs").collection("SigningAPI").insertOne(data)
		return result
	}

	update = async (query, update) =>{
		update = { $set: update }
		await this.client.connect()
		let result = await this.client.db("DesafioNodeJs").collection("SigningAPI").updateOne(query, update)
		return result
	}

	checkConnection = async () => {
		try {
			await this.client.connect();
			await this.client.db("DesafioNodeJs").command({ ping: 1 });
			console.log("Connected successfully to server");
		} finally {
			await this.client.close();
		}
	}

}

module.exports = DataBaseManager