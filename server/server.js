var express = require('express');
var bodyParser = require('body-parser');
const hbs = require('hbs');
const moment = require('moment');
const os = require('os');

var {mongoose} = require('./db-conf/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine','hbs');

//We create the port for Heroku and a TS
var ts = moment().format('YYYY-MM-DD_HH:mm:ss_Z');
var connected = 0;
const PORT = process.env.PORT||5000;

 
app.get('/',(req,res)=>{
    res.render('home.hbs',{ts});
    console.log('Connected to HOME '+ts);
}); 

app.post('/todos',(req,res)=>{
    todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc)=>{
        console.log(JSON.stringify(doc,undefined,2));
        res.send(doc);
    },(e) =>{
        res.status(400).send(e);
    });
}); 

module.exports = {app};






//Start the server and log info in console
app.listen(PORT,() => {
    var ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;
    ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
        }

        if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log('Server listening on: '+ifname + ':' + alias, iface.address+' - Port:'+PORT);
        } else {
        // this interface has only one ipv4 adress
        console.log('Server listening on: '+ifname, iface.address+' - Port:'+PORT);
        }
        ++alias;
    });
    });
});



