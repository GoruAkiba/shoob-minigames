const express = require("express");
const app = express();
const _PORT = process.env.PORT || 8080;

app.get("/",(req,resp)=>{

	resp.redirect("/gb-status")
})

// Discord Client leak
const client = {
	user:{
		username:"shoob minigames", 
		id: 200801, 
		tag: "#Shoob-Tracker", 
		verified: true,
		displayAvatarURL: () => {
			return "https://cdn.animesoul.com/images/content/shoob-square.png"
		}
	},
	ws : {
			ping : 0
		}
}
 
 
// socketStats Configuration
const socketStats = require("socketstats");
const server = new socketStats(app,client);

// open / listen port using socketStats
server.listen(_PORT, () => {
		console.log("Listening to port: "+_PORT);
});
