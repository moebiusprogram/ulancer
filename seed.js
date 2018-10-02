const mongoose = require('mongoose');
const seeder = require('mongoose-seed');
const data = require('./test/test.data');
 
//const url = 'mongodb://localhost:27017/SeederTest';
const databaseConf  = require('./config/database.config.js')

seeder.setLogOutput(true)

seeder.connect(databaseConf.url,{ useNewUrlParser: true }, function() {

    //seeder.loadModels( ['./testModel.js'] )
    seeder.loadModels( ['./models/accounts.model'] )

    // Clear specified collections
    seeder.clearModels(['Test'], function() {
        mongoose.models.Test.find().exec(function(err, test) {
                    console.log(err, test)
                });
        // Callback to populate DB once collections have been cleared
        seeder.populateModels(data.seed, function() {
          seeder.disconnect();
        });
  });
});
