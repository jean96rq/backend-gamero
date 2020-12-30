var mongoose = require('mongoose')
var app = require('./app');
var port = 3700;
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/portafolio', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conexión a la base de datos establecida con exito...')
            //creación del servidor
        app.listen(port, () => {
            console.log('servidor corriendo en localhost:3700')
        })

    })
    .catch(err => console.log(err))