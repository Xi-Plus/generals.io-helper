var movetocanpass = [70, 71, 72, 80, 90];
var gatherareacan = [70, 71, 72, 80, 90];
var expandmy = [70, 71, 72];
var expandneutral = [90];
var expandattack = [91];

var mapel = document.getElementById("gameMap").children[0];
var height = mapel.children.length;
var width = mapel.children[0].children.length;
var mycolor = document.getElementsByClassName("general")[0].classList[0];
var othercolor = [];

var style = document.createElement('style');
style.id = "infoel";
style.innerHTML = '.info{position: absolute; top: 0; left: 0; width: 100%; height: 100%; line-height: 30px; background: #000; }';
document.head.appendChild(style);

for (var i = document.getElementsByClassName("leaderboard-name").length - 1; i >= 0; i--) {
	var color = document.getElementsByClassName("leaderboard-name")[i].classList[1];
	if (color !== mycolor) {
		othercolor.push(color);
	}
}
var usercnt = othercolor.length;
for (var i = 0; i < usercnt; i++) {
	movetocanpass.push(i*10);
	movetocanpass.push(i*10+1);
	movetocanpass.push(i*10+2);
	expandattack.push(i*10);
	expandattack.push(i*10+1);
	expandattack.push(i*10+2);
}
var mymap = [];
for (var i = 0; i < height; i++) {
	mymap[i] = [];
	mymap[i][-1] = [];
	mymap[i][-1]["type"] = -1;
	for (var j = 0; j < width; j++) {
		var node = document.createElement("span");
		node.id = "info_"+i+"_"+j;
		mapel.children[i].children[j].px = i;
		mapel.children[i].children[j].py = j;
		mapel.children[i].children[j].id = "land_"+i+"_"+j;
		mapel.children[i].children[j].addEventListener("click", function(event){
			var el = event.target || event.srcElement;
			choose(el.px, el.py);
		});
		mymap[i][j] = [];
	}
	mymap[i][width] = [];
	mymap[i][width]["type"] = -1;
}
mymap[-1] = [];
for (var j = 0; j < width; j++) {
	mymap[-1][j] = [];
	mymap[-1][j]["type"] = -1;
}
mymap[height] = [];
for (var j = 0; j < width; j++) {
	mymap[height][j] = [];
	mymap[-1][j]["type"] = -1;
}
function update() {
	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			var classes = document.all["land_"+i+"_"+j].classList;
			mymap[i][j]["type"] = 0;
			mymap[i][j]["army"] = document.all["land_"+i+"_"+j].innerText;
			var neutral = true;
			for (var k = 0; k < usercnt; k++) {
				if (classes.contains(othercolor[k])) {
					mymap[i][j]["type"] += k*10;
					neutral = false;
					break;
				}
			}
			if (neutral && classes.contains(mycolor)) {
				mymap[i][j]["type"] += 70;
				neutral = false;
			}
			if (neutral && classes.contains("fog")) {
				mymap[i][j]["type"] += 80;
				neutral = false;
			}
			if (neutral) {
				mymap[i][j]["type"] += 90;
			}
			if (classes.contains("city")) {
				mymap[i][j]["type"] += 1;
			}
			if (classes.contains("general")) {
				mymap[i][j]["type"] += 2;
			}
			if (classes.contains("mountain")) {
				mymap[i][j]["type"] += 3;
			}
			if (classes.contains("obstacle")) {
				mymap[i][j]["type"] += 4;
			}
		}
	}
}
for (var i = 0; i < height; i++) {
	var node = document.createElement("td");
	node.innerHTML = i;
	node.className = "tiny";
	node.style = "background: #000;";
	mapel.children[i].appendChild(node);
}
var node = document.createElement("tr");
mapel.appendChild(node);
for (var i = 0; i < width; i++) {
	var node = document.createElement("td");
	node.innerHTML = i;
	node.className = "tiny";
	node.style = "background: #000;";
	mapel.children[height].appendChild(node);
}

function move(x, y, d, half = false) {
	var start = document.all["land_"+x+"_"+y];
	var end;
	switch(d) {
		case 0:
			end = document.all["land_"+(x-1)+"_"+y];
			break;
		case 1:
			end = document.all["land_"+x+"_"+(y+1)];
			break;
		case 2:
			end = document.all["land_"+(x+1)+"_"+y];
			break;
		case 3:
			end = document.all["land_"+x+"_"+(y-1)];
			break;
		default:
			log("move: wrong d", "color: red;font-weight: bold;");
			return;
	}
	if (!start.classList.contains("selectable") && !end.classList.contains("attackable")) {
		log("move: cannot attack "+x+","+y+" "+d, "color: red;font-weight: bold;");
		return;
	}
	if (start.classList.contains("attackable")) {
		var selected = document.getElementsByClassName("selected")[0];
		selected.dispatchEvent(new Event("touchstart"));
		selected.dispatchEvent(new Event("touchend"));
		if (selected.classList.contains("selected50")) {
			selected.dispatchEvent(new Event("touchstart"));
			selected.dispatchEvent(new Event("touchend"));
		}
	}
	if (!start.classList.contains("selected")) {
		start.dispatchEvent(new Event("touchstart"));
		start.dispatchEvent(new Event("touchend"));
	}
	if (half) {
		start.dispatchEvent(new Event("touchstart"));
		start.dispatchEvent(new Event("touchend"));
	}
	end.dispatchEvent(new Event("touchstart"));
	end.dispatchEvent(new Event("touchend"));
}
var node = document.createElement("div");
node.id = "helper";
node.style = "position: fixed; bottom: 0; right: 0; z-index: 25; background: white;";
document.all["game-page"].appendChild(node);

var node = document.createElement("div");
node.id = "movetodiv";
document.all.helper.appendChild(node);
document.all.movetodiv.innerHTML = '<button id="movetobtn" style="padding: 0px 0px; margin: 5px; font-size: 18px; width: 100%;" onclick="movetostart();">移動到指定地方 [Z]</button>';

var node = document.createElement("div");
node.id = "gatherdiv";
document.all.helper.appendChild(node);
document.all.gatherdiv.innerHTML = '<button id="gatherareabtn" style="padding: 0px 0px; margin: 5px; font-size: 18px; width: 100%;" onclick="gatherareastart();">聚集區域兵力 [X]</button>';

var node = document.createElement("div");
node.id = "expanddiv";
document.all.helper.appendChild(node);
document.all.expanddiv.innerHTML = '<button style="padding: 0px 0px; margin: 5px; font-size: 18px; width: 50%;" onclick="expandstart();">擴散 [C]</button>'+
	'<label><input type="checkbox" id="expandchkattack">攻擊</label>'+
	'<label><input type="checkbox" id="expandchkhalf">半兵</label>';

var node = document.createElement("div");
node.id = "logdiv";
node.style.height = "150px";
node.style.width = "300px";
node.style.overflow = "scroll";
document.all.helper.appendChild(node);
document.all.logdiv.innerHTML = "<ul id='loglist'></ul><div id='logend'>";

function log(text, style) {
	var node = document.createElement("li");
	node.style = style;
	node.innerText = text;
	document.all.loglist.appendChild(node);
	logend.scrollIntoView();
}

var action = "";
var actionpx, actionpy;
function choose(x, y) {
	log("點擊: "+x+","+y);
	if (action == "moveto") {
		moveto(actionpx, actionpy, x, y);
	} else if (action == "gatherarea") {
		gatherarea(x, y);
	}
}
function movetostart() {
	if (action === "") {
		var selected = document.getElementsByClassName("selected")[0]
		if (selected === undefined) {
			log("移動至此: 請先選擇起始點", "color: red;font-weight: bold;");
			return;
		}
		movetobtn.style.background = "lightseagreen";
		actionpx = selected.px;
		actionpy = selected.py;
		action = "moveto";
		log("移動至此: 請選擇終點");
	} else if (action === "moveto") {
		movetobtn.style.background = "";
		action = "";
		log("移動至此: 動作取消", "color: blue;");
	}
}
function moveto(x1, y1, x2, y2) {
	log("移動至此: from "+x1+","+y1+" to "+x2+","+y2);
	update();
	var visited = [];
	for (var i = 0; i < height; i++) {
		visited[i] = [];
		visited[i][-1] = true;
		for (var j = 0; j < width; j++) {
			if (movetocanpass.indexOf(mymap[i][j]["type"]) === -1) {
				visited[i][j] = true;
			} else {
				visited[i][j] = false;
			}
		}
		visited[i][width] = true;
	}
	visited[-1] = [];
	for (var j = 0; j < width; j++) {
		visited[-1][j] = true;
	}
	visited[height] = [];
	for (var j = 0; j < width; j++) {
		visited[height][j] = true;
	}
	visited[x1][y1] = true;
	var queue = [];
	var temp = {px: x1, py:y1, d:0, path:[]};
	queue.push(temp);
	while (queue.length > 0) {
		var now = queue.shift();
		if (now.px == x2 && now.py == y2) {
			var x = x1;
			var y = y1;
			var ds = now.path.length;
			log("移動至此: 需要 "+ds+" 步", "color: blue;");
			for (var i = 0; i < ds; i++) {
				move(x, y, now.path[i]);
				switch (now.path[i]) {
					case 0:
						x--; break;
					case 1:
						y++; break;
					case 2:
						x++; break;
					case 3:
						y--; break;
				}
			}
			movetobtn.style.background = "";
			action = "";
			return;
		}
		if (!visited[now.px-1][now.py]) {
			var temp = {px: now.px-1, py:now.py, d:now.d+1, path:now.path.slice()};
			temp.path.push(0);
			queue.push(temp);
			visited[now.px-1][now.py] = true;
		}
		if (!visited[now.px][now.py+1]) {
			var temp = {px: now.px, py:now.py+1, d:now.d+1, path:now.path.slice()};
			temp.path.push(1);
			queue.push(temp);
			visited[now.px][now.py+1] = true;
		}
		if (!visited[now.px+1][now.py]) {
			var temp = {px: now.px+1, py:now.py, d:now.d+1, path:now.path.slice()};
			temp.path.push(2);
			queue.push(temp);
			visited[now.px+1][now.py] = true;
		}
		if (!visited[now.px][now.py-1]) {
			var temp = {px: now.px, py:now.py-1, d:now.d+1, path:now.path.slice()};
			temp.path.push(3);
			queue.push(temp);
			visited[now.px][now.py-1] = true;
		}
	}
	log("移動至此: 找不到路徑", "color: red;font-weight: bold;");
	movetobtn.style.background = "";
	action = "";
}
function gatherareastart() {
	if (action === "") {
		gatherareabtn.style.background = "lightseagreen";
		action = "gatherarea";
		log("聚集兵力: 請選擇目標");
	} else if (action === "gatherarea") {
		gatherareabtn.style.background = "";
		action = "";
		log("聚集兵力: 動作取消", "color: blue;");
	}
}
function gatherarea(px, py) {
	if ((dis = prompt("多少步數?", "20")) !== null) {
		update();
		var visited = [];
		for (var i = 0; i < height; i++) {
			visited[i] = [];
			visited[i][-1] = true;
			for (var j = 0; j < width; j++) {
				if (gatherareacan.indexOf(mymap[i][j]["type"]) === -1) {
					visited[i][j] = true;
				} else {
					visited[i][j] = false;
				}
			}
			visited[i][width] = true;
		}
		visited[-1] = [];
		for (var j = 0; j < width; j++) {
			visited[-1][j] = true;
		}
		visited[height] = [];
		for (var j = 0; j < width; j++) {
			visited[height][j] = true;
		}
		visited[px][py] = true;
		var queue = [];
		var path = [];
		var temp = {px: px, py:py};
		queue.push(temp);
		while (queue.length > 0 && dis > 0) {
			var now = queue.shift();
			if (!visited[now.px-1][now.py]) {
				var temp = {px: now.px-1, py:now.py};
				path.push({px: temp.px, py:temp.py, d:2});
				queue.push(temp);
				visited[now.px-1][now.py] = true;
				dis--;
			}
			if (dis && !visited[now.px][now.py+1]) {
				var temp = {px: now.px, py:now.py+1};
				path.push({px: temp.px, py:temp.py, d:3});
				queue.push(temp);
				visited[now.px][now.py+1] = true;
				dis--;
			}
			if (dis && !visited[now.px+1][now.py]) {
				var temp = {px: now.px+1, py:now.py};
				path.push({px: temp.px, py:temp.py, d:0});
				queue.push(temp);
				visited[now.px+1][now.py] = true;
				dis--;
			}
			if (dis && !visited[now.px][now.py-1]) {
				var temp = {px: now.px, py:now.py-1};
				path.push({px: temp.px, py:temp.py, d:1});
				queue.push(temp);
				visited[now.px][now.py-1] = true;
				dis--;
			}
		}
		log("聚集兵力: "+px+","+py+" 步數 "+path.length, "color: blue;");
		for (var i = path.length - 1; i >= 0; i--) {
			move(path[i].px, path[i].py, path[i].d);
		}
	} else {
		log("聚集兵力: 動作取消", "color: blue;");
	}
	gatherareabtn.style.background = "";
	action = "";
}
function expandstart() {
	expand(expandchkattack.checked, expandchkhalf.checked);
}
function expand(attack = false, half = false) {
	log("擴散: 攻擊"+attack+" 半兵"+half);
	update();
	var count = 0;
	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			if (expandmy.indexOf(mymap[i][j]["type"]) !== -1) {
				if (mymap[i][j]["army"] < 2) {
					continue;
				}
				var d = [];
				if (expandneutral.indexOf(mymap[i-1][j]["type"]) !== -1) {
					d.push([0, true]);
				} else if (attack && expandattack.indexOf(mymap[i-1][j]["type"]) !== -1) {
					if (mymap[i][j]["army"] - mymap[i-1][j]["army"] >= 2) {
						d.push([0, false]);
					}
				}
				if (expandneutral.indexOf(mymap[i][j+1]["type"]) !== -1) {
					if ((expandmy.indexOf(mymap[i][j+2]["type"]) === -1 ||
						mymap[i][j+2]["army"] < 2) &&
						(expandmy.indexOf(mymap[i+1][j+1]["type"]) === -1 ||
						mymap[i+1][j+1]["army"] < 2)) {
						d.push([1, true]);
					}
				} else if (attack && expandattack.indexOf(mymap[i][j+1]["type"]) !== -1) {
					if (mymap[i][j]["army"] - mymap[i][j+1]["army"] >= 2) {
						d.push([1, false]);
					}
				}
				if (expandneutral.indexOf(mymap[i+1][j]["type"]) !== -1) {
					if ((expandmy.indexOf(mymap[i+1][j+1]["type"]) === -1 ||
						mymap[i+1][j+1]["army"] < 2) &&
						(expandmy.indexOf(mymap[i+2][j]["type"]) === -1 ||
						mymap[i+2][j]["army"] < 2)) {
						d.push([2, true]);
					}
				} else if (attack && expandattack.indexOf(mymap[i+1][j]["type"]) !== -1) {
					if (mymap[i][j]["army"] - mymap[i+1][j]["army"] >= 2) {
						d.push([2, false]);
					}
				}
				if (expandneutral.indexOf(mymap[i][j-1]["type"]) !== -1) {
					d.push([3, true]);
				} else if (attack && expandattack.indexOf(mymap[i][j-1]["type"]) !== -1) {
					if (mymap[i][j]["army"] - mymap[i][j-1]["army"] >= 2) {
						d.push([3, false]);
					}
				}
				var ishalf = half;
				if (d.length > 1) {
					ishalf = true;
				}
				for (var k = 0; k < d.length; k++) {
					if (mymap[i][j]["army"] < 2) {
						break;
					}
					move(i, j, d[k][0], ishalf&d[k][1]);
					count ++;
					if (ishalf) {
						mymap[i][j]["army"] -= Math.floor(mymap[i][j]["army"] / 2);
					} else {
						mymap[i][j]["army"] = 1;
					}
				}
			}
		}
	}
	log("擴散: 需要 "+count+" 步", "color: blue;");
}
document.onkeydown = function (e) {
	switch (e.keyCode) {
		case 90:
			movetostart();
			break;
		case 88:
			gatherareastart();
			break;
		case 67:
			expandstart();
			break;

	}
};
