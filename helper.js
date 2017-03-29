var mpe = document.getElementById("map").children[0];
var height = mpe.children.length;
var width = mpe.children[0].children.length;
for (var i = 0; i < height; i++) {
	var node = document.createElement("td");
	node.innerHTML = i;
	node.className = "tiny";
	node.style = "background: #000;";
	mpe.children[i].appendChild(node);
}
var node = document.createElement("tr");
mpe.appendChild(node);
for (var i = 0; i < width; i++) {
	var node = document.createElement("td");
	node.innerHTML = i;
	node.className = "tiny";
	node.style = "background: #000;";
	mpe.children[height].appendChild(node);
}

function move(x, y, d, half = false) {
	var start = mpe.children[x].children[y];
	var end;
	if (!start.classList.contains("selectable")) {
		console.log("cannot attack");
		return;
	}
	switch(d) {
		case 0:
			end = mpe.children[x-1].children[y];
			break;
		case 1:
			end = mpe.children[x].children[y+1];
			break;
		case 2:
			end = mpe.children[x+1].children[y];
			break;
		case 3:
			end = mpe.children[x].children[y-1];
			break;
		default:
			console.log("wrong d");
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
