var mapel = document.getElementById("map").children[0];
var height = mapel.children.length;
var width = mapel.children[0].children.length;
var mymap = [];
for (var i = 0; i < height; i++) {
	mymap[i] = [];
	mymap[i][-1] = [];
	mymap[i][-1]["type"] = -1;
	for (var j = 0; j < width; j++) {
		mapel.children[i].children[j].px = i;
		mapel.children[i].children[j].py = j;
		mapel.children[i].children[j].id = "land_"+i+"_"+j;
		mapel.children[i].children[j].addEventListener("click", function(event){
			var el = event.target || event.srcElement;
			choose(el.px, el.py);
		});
		mymap[i][j] = [];
		mymap[i][j]["type"] = 0;
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
			// 0x中立 1x我方 2x敵方
			// 0土地 1山脈 2城堡 3主堡 9山脈or城堡
			mymap[i][j]["type"] = 0;
			mymap[i][j]["army"] = document.all["land_"+i+"_"+j].innerText;
			if (classes.contains("selectable")) {
				mymap[i][j]["type"] += 10;
			}
			if (classes.contains("mountain")) {
				mymap[i][j]["type"] += 1;
			}
			if (classes.contains("obstacle")) {
				mymap[i][j]["type"] += 9;
			}
			if (classes.contains("city")) {
				mymap[i][j]["type"] += 2;
			}
			if (classes.contains("general")) {
				mymap[i][j]["type"] += 3;
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
document.all.movetodiv.innerHTML = "<button style='padding: 0px 0px; margin: 5px; font-size: 18px; width: 100%;' onclick='movetostart();'>移動到指定地方</button>";

var node = document.createElement("div");
node.id = "gatherdiv";
document.all.helper.appendChild(node);
document.all.gatherdiv.innerHTML = "<button style='padding: 0px 0px; margin: 5px; font-size: 18px; width: 100%;' onclick='gatherarea();'>聚集區域兵力</button>";

var node = document.createElement("div");
node.id = "expanddiv";
document.all.helper.appendChild(node);
document.all.expanddiv.innerHTML = "<button style='padding: 0px 0px; margin: 5px; font-size: 18px; width: 100%;' onclick='expand();'>擴散</button>";

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
	}
}
function movetostart() {
	var selected = document.getElementsByClassName("selected")[0]
	if (selected === undefined) {
		log("移動至此: 請先選擇起始點", "color: red;font-weight: bold;");
		return;
	}
	actionpx = selected.px;
	actionpy = selected.py;
	action = "moveto";
}
function moveto(x1, y1, x2, y2) {
	log("移動至此: from "+x1+","+y1+" to "+x2+","+y2);
	update();
	var visited = [];
	for (var i = 0; i < height; i++) {
		visited[i] = [];
		visited[i][-1] = true;
		for (var j = 0; j < width; j++) {
			if ([1, 2, 9, 22, 23].indexOf(mymap[i][j]["type"]) === -1) {
				visited[i][j] = false;
			} else {
				visited[i][j] = true;
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
	action = "";
}
function gatherarea() {
	var selected = document.getElementsByClassName("selected")[0]
	if (selected === undefined) {
		log("聚集兵力: 請先選擇目標", "color: red;font-weight: bold;");
		return;
	}
	if ((dis = prompt("多少步數?", "20")) !== null) {
		px = selected.px;
		py = selected.py;
		update();
		var visited = [];
		for (var i = 0; i < height; i++) {
			visited[i] = [];
			visited[i][-1] = true;
			for (var j = 0; j < width; j++) {
				if ([10, 12].indexOf(mymap[i][j]["type"]) === -1) {
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
			if (!visited[now.px][now.py+1]) {
				var temp = {px: now.px, py:now.py+1};
				path.push({px: temp.px, py:temp.py, d:3});
				queue.push(temp);
				visited[now.px][now.py+1] = true;
				dis--;
			}
			if (!visited[now.px+1][now.py]) {
				var temp = {px: now.px+1, py:now.py};
				path.push({px: temp.px, py:temp.py, d:0});
				queue.push(temp);
				visited[now.px+1][now.py] = true;
				dis--;
			}
			if (!visited[now.px][now.py-1]) {
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
	}
}
function expand(half = false) {
	update();
	var count = 0;
	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			if ([10, 12].indexOf(mymap[i][j]["type"]) !== -1) {
				if (mymap[i][j]["army"] < 2) {
					continue;
				}
				var d = [];
				if ([0].indexOf(mymap[i-1][j]["type"]) !== -1) {
					d.push(0);
				}
				if ([0].indexOf(mymap[i][j+1]["type"]) !== -1) {
					if ([10, 12].indexOf(mymap[i][j+2]["type"]) === -1 &&
						[10, 12].indexOf(mymap[i+1][j+1]["type"]) === -1) {
						d.push(1);
					}
				}
				if ([0].indexOf(mymap[i+1][j]["type"]) !== -1) {
					if ([10, 12].indexOf(mymap[i+1][j+1]["type"]) === -1 &&
						[10, 12].indexOf(mymap[i+2][j]["type"]) === -1) {
						d.push(2);
					}
				}
				if ([0].indexOf(mymap[i][j-1]["type"]) !== -1) {
					d.push(3);
				}
				var ishalf = half;
				if (d.length > 1) {
					ishalf = true;
				}
				for (var k = 0; k < d.length; k++) {
					if (mymap[i][j]["army"] < 2) {
						break;
					}
					move(i, j, d[k], ishalf);
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
