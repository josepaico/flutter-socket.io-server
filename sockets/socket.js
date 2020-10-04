const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');
const bands = new Bands();

bands.addBand(new Band( 'Queen Ok'));
bands.addBand(new Band( 'Bon Jovi'));
bands.addBand(new Band( 'Heroes del Silencio'));
bands.addBand(new Band( 'Metalica'));


//mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente Conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { 
        console.log('Cliente desconectado');
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);

        io.emit('mensaje', {admin: 'Nuevo mensaje'});
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());//para todos
    });

    client.on('add-band', (payload) => {
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());//para todos
    });

    client.on('delete-band', (payload) => {
    
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());//para todos
    });

    //client.on('emitir-mensaje', ( payload ) => {
        //console.log(payload);
        //io.emit('nuevo-mensaje', payload );//emite para todos
        //client.broadcast.emit('nuevo-mensaje', payload );//emit para todos menos para el qe lo envia
    //});
});