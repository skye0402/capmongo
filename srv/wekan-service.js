const cds = require("@sap/cds");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const uri = "mongodb://localhost:27017";
const db_name = "wekandb";
const client = new MongoClient(uri);
var response;

//--------------------------------------------------------
//Get all Boards
//--------------------------------------------------------
async function _getBoards(req) {
    // Connect the client to the server
    await client.connect();

    // Establish and verify connection
    var db = await client.db(db_name);

    //Connect to Collection
    var collection_Boards = await db.collection("boards");
    console.log(db);
    var filter, projection, results, date_high, date_low;

    console.log(req.query);

    //Make sure date_low and date_high are in format 2020-02-04T05:06:18.417Z
    //but not as 2020-2-4T5:6:18.417Z
    if (req.query.SELECT.where !== undefined) {
        date_low = req.query.SELECT.where[2].val;
        date_high = req.query.SELECT.where[6].val;
    }

    if (date_low !== undefined) {
        var MyCurLowDate = new Date(date_low);
        var MyCurHighDate = new Date(date_high);
        filter = { OrderCreatedOn: { $gte: MyCurLowDate, $lte: MyCurHighDate } };
    } else {
        filter = {};
    }

    projection = {
        _id: 1,
        _format: 1,
        title: 1
    };

    var results = await collection_Boards
        .find(filter, { projection: projection })
        .toArray();

    return results;
}

//--------------------------------------------------------
//Post Boards entry
//--------------------------------------------------------
async function _CreateBoards(req) {
    // Connect the client to the server
    await client.connect();

    // Establish and verify connection
    var db = await client.db(db_name);

    //Connect to Collection
    var collection_Boards = await db.collection("boards");

    var data = req.data;

    var results = await collection_Boards.insertOne(data);
    if ((results.insertedCount = 1)) {
        delete data._id;
        return data;
    } else {
        console.log(results.result);
        return results.result;
    }
}

//--------------------------------------------------------
//External calls on Read,Write for Entities
//--------------------------------------------------------
module.exports = cds.service.impl(function() {
    const { Boards } = this.entities;

    //For Boards
    this.on("READ", Boards, _getBoards);
    this.on("CREATE", Boards, _CreateBoards);

});