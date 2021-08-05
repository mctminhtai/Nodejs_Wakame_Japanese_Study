const {MongoClient} = require("mongodb");

async function main() {
    const url = "mongodb+srv://tien:1234567890@cluster-1.zwd9b.mongodb.net/accountDB?retryWrites=true&w=majority"

    const client = new MongoClient(url);

    try {
        await client.connect();
        await listDatabases(client);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};