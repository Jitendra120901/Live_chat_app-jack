let express = require('express');
let bodyParser = require('body-parser');
let app = express();
// creating http server by http and express module
var http = require('http').Server(app);
// require socket.io labrery  for the real time work or live work
var io = require('socket.io')(http);
// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. 
const multer = require('multer');
const path = require('path')

// mongodb data base module 
const mongoose = require("mongoose");
//  required mongodb Database connection file 
const login_data = require('./dataconnection.js');
// Database connection with mongodb 
const DB = 'mongodb+srv://jitendra_12:jitendra@cluster0.83h76ye.mongodb.net/information?retryWrites=true&w=majority';

// getting rendom port if it exits otherwise defult port will take place
let port = process.env.PORT || 3000;

// cookies set 
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Email sender module
let fs = require('fs');
const nodemailer = require("nodemailer");

// form Data parser  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// setting template engines &&
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "/views/")));
app.use(express.static('uploads/image'));


// with the help of multer we are specifiying  defult of uploading profile 
const Storagefile = multer.diskStorage({

    destination: "./uploads/image/",
    filename: (req, file, cb) => {

        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: Storagefile,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == 'image/jpeg' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/png' ||
            file.mimetype == 'image/gif'
        ) {
            cb(null, true)
        }
        else {
            cb(null, false);
            cb(new Error('only , jpeg ,png, jpg,gif image allow'))
        }
    }
});


// getting current time
// let datetime= require('node-datetime');
let dataAndTime
setInterval(() => {
    let date = new Date();
    dataAndTime = date.toLocaleTimeString();
}, 1000);


// Email verification  code 
async function main(email, name) {

    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: 'jack704921@gmail.com',
            pass: 'vkqxamutpkhshrws'
        }
    });


    // send mail with defined transport object
    fs.readFile("./Email_sent_body.html", 'utf-8', async (err, data) => {
        if (err) {
            console.log(err);
            return;
        } else {

            let info = await transporter.sendMail({
                from: '"Live_chat_Application" <jack704921@gmail.com>', // sender address
                to: email,  // list of receivers
                subject: "For Email Verification ✔", // Subject line
                text: "kaise ho", // plain text body
                html: `<!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8'>
                    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
                    <title>Page Title</title>
                    <meta name='viewport' content='width=device-width, initial-scale=1'>
                   <style> 
                p{
                
                    text-align: center;
                    margin: auto;
                    color: rgb(150, 66, 66);
                    letter-spacing: 1px;
                    height: 100%;
                    width: 100%;
                    font-family:'Segoe UI', Tahoma, Verdana, sans-serif;
                    font-size: 16px;
                }
                a{
                    text-decoration: none;
                    display: block;
                    color: #ffffff;
                    background-color: #ff7900;
                    border-radius: 10px;
                    width: 30%;
                    border-top: 0px solid transparent;
                    font-weight: 400;
                    border-right: 0px solid transparent;
                    border-bottom: 4px solid #c3610b;
                    border-left: 0px solid transparent;
                    padding-top: 2px;
                    padding-bottom: 5px;
                    font-family:Helvetica,sans-serif;
                    font-size: 12px;
                    text-align: center;
                    word-break: keep-all;
                    text-align: center;
                    margin:auto;
                }
                
                
                
                h4{
                
                  
                    text-decoration: none;
                    display: block;
                    color: #ffffff;
                    background-color:rgb(29, 197, 239);
                    border-radius: 10px;
                    width: 30%;
                    border-top: 0px solid transparent;
                    font-weight: 400;
                    border-right: 0px solid transparent;
                    border-bottom: 4px solid rgb(101, 212, 240);
                    border-left: 0px solid transparent;
                    padding-top: 2px;
                    padding-bottom: 5px;
                    font-family: Georgia, Times, 'Times New Roman', serif;
                    font-size: 12px;
                    text-align: center;
                    word-break: keep-all;
                    text-align: center;
                    margin:15px auto;
                    
                }
                
                fieldset{
                
                    background-color: rgb(240, 255, 250);
                }
                body{
                   
                    background-attachment: fixed;
                    background-color: rgb(239, 239, 225);
                }
                </style>
                </head>
                <body>
                <fieldset>
                    <h4> Live_Chat_App</h4>
                    <br>
                    
                    <p>
                        Thanks for singing up with the Live_Chat_Application!
                         You must click below button to activate your account 
                         and redirect to into your account.
                    </p><br>
                <a  href="https://live-chat-app-jack.onrender.com/?name=${name}">Click Here to Verify your Email</a>
                </fieldset>
                       
                      
                  
                
                </body>
                </html>`// html body
            }, (err, data) => {
                if (err) { console.log("mail not sent"); }
                else {
                    console.log("mail sent succesfully")

                }


            });
        }
    })

    //   console.log("Message sent: %s", nodemailer.getTestMessageUrl(info));
}

// Routs 
let gobalvariable;
let profilePic;
app.get('/', (req, res) => {
    let url = require('url').parse(req.url, true).query;
    let name = url.name;
    res.render('index', { tempName: name });

})

app.get('/login', (req, res) => {
    let chat_type = req.query.chat_type;
    let usr = req.query.usr;
    if (chat_type == "General Chat") {
        res.render('./app',{usr:usr});
    }
    else {
        res.render('./login',);
        //res.sendFile(__dirname + 'public/login.html');
    }

})
app.get('/room', (req, res) => {
    let roomName = req.query.roomName;
    let usr = req.query.usr;
    

    res.render('./room', { roomName:roomName, user:usr });
    //res.sendFile(__dirname + 'public/login.html');
})

app.get('/recovery', (req, res) => {
    res.render('./recovery');
    //res.sendFile(__dirname + 'public/login.html');


})

app.get('/registration', (req, res) => {

    res.render("./registration")
});


app.post("/uploads/image/", upload.single('file'), async function (req, res) {

    // console.log(req.body, req.file);


    // registration Section Data
    var name = req.body.name;
    var email = req.body.e;
    var pass = req.body.p;
    var repass = req.body.cp;
    //  var image = req.file.filename;


    const fistLoginData = new login_data({

        name: name,
        email: email,
        pass: pass,
        repass: repass,
        image: req.file.filename

    });
    if (pass == repass) {

        // collectiion.findOne() returns promiss data exits or not
        const tem = await login_data.findOne({ email: email }, { new: true }).exec();
        if (tem) {

            login_data.find({ email: email }, await function (err, result) {

                res.render('../emailused', { email: email });
            });
        }

        else {
            res.render('./emailVerificationLink', { email: email, name: req.body.name });


            fistLoginData.save();

            main(email, name).catch(console.error);

        }
    }
    else {
        res.sendFile('../passMissMatch');
    }

});

app.post("/login", async function (req, res) {


    // Login  Section  Data
    var ln_email = req.body.ln_email;
    var ln_pas = req.body.ln_pas;


    // console.log(req.body);
    const tem = await login_data.findOne({ email: ln_email }, { new: true }).exec();

    if (tem) {
        login_data.find({ email: ln_email }, (err, result) => {

            console.log(result);
           gobalvariable = result[0].name;
            profilePic= result[0].image;

            if (result[0].email == ln_email && result[0].pass == ln_pas) {

                let setData = {
                    email: result[0].email,
                    password: result[0].pass
                }
             //   res.cookie("logindata", setData, { maxAge: 360000 });

              //  console.log(req.cookies.logindata);
               // res.render("app.hbs", { image: imagename });


                res.render("index.hbs", { tempName: gobalvariable });




            }
            else res.sendFile(__dirname + '/passwordNotmatch.html');

            //  res.send("email is already in use :  "+result[0].email);
        });

    }

    else {
        res.sendFile(__dirname + '/temperory.html');
        // fistLoginData.save();
    }

});

app.post("/recovery", async (req, res) => {

    console.log(req.body.ln_email);
    const tem = await login_data.findOne({ email: req.body.ln_email }, { new: true }).exec();

    if (tem) {
        login_data.find({ email: req.body.ln_email }, (err, result) => {


            if (result) {

                // console.log(result[0].pass);

                async function main2() {

                    // Only needed if you don't have a real mail account for testing
                    let testAccount = await nodemailer.createTestAccount();
                    // create reusable transporter object using the default SMTP transport
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        port: 587,
                        auth: {
                            user: 'jack704921@gmail.com',
                            pass: 'vkqxamutpkhshrws'
                        }
                    });


                    // send mail with defined transport object


                    let info = await transporter.sendMail({
                        from: '"Live_chat_Application" <jack704921@gmail.com>', // sender address
                        to: result[0].email,  // list of receivers
                        subject: "Password comfirmation from the Live_chat_Application  ✔", // Subject line
                        text: "kaise ho guys", // plain text body
                        html: ` <html>
                        <head>
                        <meta charset='utf-8'>
                        <meta http-equiv='X-UA-Compatible' content='IE=edge'>
                        <title>Page Title</title>
                        <meta name='viewport' content='width=device-width, initial-scale=1'>
                       <style> 
                    #text{
                        
                         text-align: center;
                            margin: auto;
                            color: rgb(150, 66, 66);
                            letter-spacing:3px;
                            height: 100%;
                            width: 100%;
                            font-family:'Segoe UI', Tahoma, Verdana, sans-serif;
                            font-size: 26px;
                    }
                   
                    h4{
                    
                      
                        text-decoration: none;
                        display: block;
                        color: #ffffff;
                        background-color:rgb(29, 197, 239);
                        border-radius: 5px;
                        width: 45%;
                        border-top: 0px solid transparent;
                        font-weight: 400;
                        border-right: 0px solid transparent;
                        border-bottom: 4px solid rgb(101, 212, 240);
                        border-left: 0px solid transparent;
                        padding-top: 2px;
                        padding-bottom: 5px;
                        font-family: Georgia,'Times New Roman', serif;
                        font-size: 18px;
                        text-align: center;
                        word-break: keep-all;
                        text-align: center;
                        margin:8px auto;
                        
                    }
                    
                    fieldset{
                    
                        background-color: rgb(240, 255, 250);
                        border-radius:10px ;
                    }
                    body{
                       
                        background-attachment: fixed;
                        background-color: rgb(234, 234, 231);
                    }
                    h5{
                        font-size:22px;
                        font-weight: 400;
                        width: 45%;
                        margin:auto;
                        text-align:center;
                        word-break: keep-all;
                        background-color:white;
                    }
                    </style>
                        </head>
                        <fieldset>
                        <body>
    <h4> Live_Chat_App</h4>
    
    <p id="text">
    
      <h3> Hii ,</h3>
           Someone tried to recover your password for Live_chat_Application account
           with ${result[0].email} at ${dataAndTime}. if it was you ,
           enter thise comfirmation password in the app :<h5>${result[0].pass}</h5>
    </p>
     
   
</body>
</fieldset>
</html>
` // html body
                    },
                        (err, data) => {
                            if (err) { console.log("mail not sent"); }
                            else {

                                let mes = "your password has been sent to your email account"

                                res.render("./recovery.hbs", { messege: mes })

                            }
                        });


                    // console.log("Message sent: %s", nodemailer.getTestMessageUrl(info));

                }
                main2().catch(console.error);
            }

        });

    }
    else {
        // let name=jack;
        res.sendFile(__dirname + '/temperory.html');
        // res.render('mail sent succesfully', {title:'message sent', value:'jack' , succes:'messege sent'})
    }

});


// if any connection request hit by url on broswer then it will be called automaticall
// "socket.on" is used to listen events 
// "socket.emit" is used to 
io.on('connection', function (socket) {
  
  
    
    socket.on('new_user-joined', (room) => {
      let  temproom_name = room.name;
      let gobalvariable2=room.usrTemp;
    
        if (temproom_name!="") {
            let activeUsers = {};
     // defining empty array variable , it is used to store and provide unique id to uses
            activeUsers[socket.id] = gobalvariable2;
           
            socket.emit('user_name', { image:profilePic, time: dataAndTime });
    
            socket.join(temproom_name)
            socket.to(temproom_name).emit('user-joined1_room',  activeUsers[socket.id]);

            socket.on('disconnect', () => {

                console.log(activeUsers[socket.id] + ' left the group');
    
                io.sockets.in(temproom_name).emit('user-left_room', activeUsers[socket.id]);
                let roomname = io.sockets.adapter.rooms
                var roster = io.sockets.adapter.rooms.get(temproom_name);
                const numClients = roster ? roster.size : 0;
                console.log(roomname);
                console.log(numClients);
    
    
            });

            socket.on('deliToServer_room', (msg) => {

                socket.to(temproom_name).emit('receive_room',
        
                    {
                        messege: msg,
                        gobalvariable: activeUsers[socket.id],
                        time: dataAndTime
                    }
                )
            });

            let roomname = io.sockets.adapter.rooms
            var roster = io.sockets.adapter.rooms.get(temproom_name);
            const numClients = roster ? roster.size : 0;
            console.log(roomname);
            console.log(numClients);


        }

        else {
            let activeUsers2 = {};

         // defining empty array variable , it is used to store and provide unique id to uses 
        
            activeUsers2[socket.id] = gobalvariable2;
           
            socket.emit('user_name', { image:profilePic, time: dataAndTime });
            console.log(activeUsers2[socket.id] + ' Joined the Room');
            socket.broadcast.emit('user-joined1', activeUsers2[socket.id]);
            socket.on('disconnect', () => {

                console.log(activeUsers2[socket.id] + ' left the Room');
    
                socket.broadcast.emit('user-left', activeUsers2[socket.id]);
    
    
            });

            socket.on('deliToServer', (msg) => {

                socket.broadcast.emit('receive',
        
                    {
                        messege: msg,
                        gobalvariable: activeUsers2[socket.id],
                        time: dataAndTime
                    }
                )
            });

        }

       

    });

   
});

http.listen(port, (err) => {
    console.log(err);

    console.log(`sever is running on port  ${port}`);

});