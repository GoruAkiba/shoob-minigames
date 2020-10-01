
const request = require("request");
const io = require('socket.io-client');
var last_emmited = [];

const miniGameSocket = io('https://animesoul.com',{
  autoConnect: false,
	path: '/socket.io',
  transports: ['websocket']
});

miniGameSocket.emit("location", "creating mini game");
miniGameSocket.emit("createminigame");


miniGameSocket.on('connect', function(data){ 
	console.log("connected " )
});
// miniGameSocket.emit("init",null,(data)=> console.log(data));
// miniGameSocket.emit("location", "home");
// miniGameSocket.emit("getminigameslist");

miniGameSocket.on('disconnect', (reason) => {
	console.log("disconnected :"+reason)
	console.log("reconnecting")
});

miniGameSocket.on("createminigameres",(data) => {
	// console.log("Mini game :"+ JSON.stringify(data,null,2))
	var update = substract(data.games,last_emmited);
	last_emmited = data.games;
	update.forEach(e=>{
		// console.log(e);
		get_info(e.card);
		
	})
	
})

miniGameSocket.on("getminigameslistres",(datat) => {
	console.log("Mini game :"+ JSON.stringify(datat,null,2))
})

miniGameSocket.open();


// miniGameSocket.on('message', function(data){ console.log("gotchu"+JSON.stringify(data))});

// miniGameSocket.on("payload",(datat) => {
// 	console.log("location shanged :"+ JSON.stringify(datat))
// })




// infoSocket

const infoSocket = io('https://animesoul.com',{
  forceNew: true,
	autoConnect: false,
	path: '/socket.io',
  transports: ['websocket']
});

infoSocket.emit("location","cards");

function get_info(card_id,callback){
	infoSocket.emit("cardview",{"cardid":card_id});
}

infoSocket.on("cardviewres", data => {
		console.log("tier: "+data.card.tier, data.card.name);
		sendHook(data);
		// console.log(data.card);
	})

infoSocket.on('disconnect', (reason) => {
	console.log("disconnected :"+reason)
	console.log("reconnecting")
});

infoSocket.open();

/**
 * substract array
 */
function substract(a,b){
	var baru = [];
	var sbn = b.map(e => e._id);
	a.forEach(e=>{if(!sbn.includes(e._id)){return baru.push(e)}});

	return baru;
}

function sendHook(obj){
	// console.log(obj.card);
	if(obj.card.tier < 3) return ;
	var card = obj.card,
			icon = "https://cdn.animesoul.com/images/content/shoob-square.png",
			games = last_emmited.find(e => {
				return e.card === card._id;
			}),
			em = {
				"title": `Tier ${card.tier} | `+card.name,
				"url": `https://animesoul.com/mini-game/${games._id}`,
				"description":`**[ Card Appears on Minigame ]**\n`+card.category.map(e=> `\`\`${e}\`\``).join(", ")+`\nIssue: \`\`${card.claim_count}\`\``,
				"image": {
					"url":
						`https://cdn.animesoul.com/images/cards/${card.tier}/${card.file}`
				},
				"footer": {
					"text": "Shoob miniGames Tracker | GB_Sources",
					"icon_url": icon
				}
			};

	request.post(process.env.WEBHOOK).json({
          "username": "Card Minigame Tracker",
          "avatar_url": icon,
          "content":``,
          "embeds":[em]
        })
}

require("./webserver");