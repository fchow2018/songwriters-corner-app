var mongoose = require('mongoose');
/*add you connection somewhere here*/
mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/songwriters-corner-app', {promiseLibrary: global.Promise});

