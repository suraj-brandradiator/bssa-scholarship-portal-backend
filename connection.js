const mongoose = require("mongoose");


module.exports = (databaseURI) => {
    try {
        mongoose.connect(databaseURI, {
            // useNewUrlParser: true, // This option is no longer needed
            useUnifiedTopology: true, // This option is no longer needed
            // useFindAndModify: false, // To prevent deprecation warnings for findAndModify
            useCreateIndex: true, // To prevent deprecation warnings for ensureIndex
        }).then(() => console.log("Connected to database successfully"))
        const parsedUri = mongodbUri.parse(databaseURI);
    }
    catch (e) {
        console.log(e)
    }
}




