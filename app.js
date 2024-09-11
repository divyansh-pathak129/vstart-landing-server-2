require("dotenv").config();
const bodyParser = require('body-parser');
const http = require('http');
const express  = require('express');
const { Server } = require('socket.io');
const cors = require("cors");
const { createClient } = require('@supabase/supabase-js');


const app = express()
app.use(cors());
const server = http.createServer(app)
const io = new Server(server, {
    cors:{
        // origin: process.env.CORS_URL,
        origin: 'https://vstart.online',
        methods: ["GET", "POST"],
        credentials: true
    }
});


const supabaseUrl = process.env.SUPABASE_URL ; // Replace with your Supabase project URL
const supabaseKey = process.env.ANON_KEY ;
const supabase = createClient(supabaseUrl, supabaseKey);



io.on("connection", (socket) => {
    socket.on('submit_email', async (email) => {
        if (email) {
            console.log("received", email);
            const { data, error } = await supabase
                .from('vstart-waitlist-mail')
                .insert([{ email }]);
            console.log("Data:", data);
            console.log("Error:", error);
    
            if (error) {
                socket.emit('error', { message: 'Failed to add email to waitlist.', error });
            } else {
                socket.emit('success', { message: 'Email added to the waitlist!', data });
                // console.log("done")
            }
        } else {
            socket.emit('error', { message: 'Email is required!' });
        }
    });
})


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
// console.log("Server running on port" ${PORT});
console.log(`${PORT}`)
});