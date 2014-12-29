vertices = [];
clone = [];
used = [];
state = "IDLE";
flag = "BEG";
beg = -1;
end = -1;
var stage = new Kinetic.Stage({
    container: 'container',
    width: 600,
	height: 400
	});
var layer = new Kinetic.Layer();
var layer2 = new Kinetic.Layer();
var layer3 = new Kinetic.Layer();
var box = new Kinetic.Rect({
    x: 0,
    y: 0,
    width: 600,
    height: 400,
    fill: '#FFFFFF',
    stroke: 'black',
    strokeWidth: 1,
    draggable: false
  });

function count() {
	console.log("test");
}  

function dfs(v) {
	if(used[v]) return;
	used[v] = true;
	for(var i = 0; i < clone[v].edges.length; i++) {
		dfs(clone[v].edges[i].number);
	}
}

function components() {
	var c = 0;
	clone = $.extend(true, [], vertices);
	for (var i = 0; i < clone.length; i++) {
		for (var j = 0; j < clone[i].edges.length; j++) {
			var end = clone[i].edges[j].number; var flag = true;
			for (var k = 0; k < clone[end].edges.length; k++)
			if (clone[end].edges[k].number == i) { flag = false; break; }
			if(flag) clone[end].edges.push({'number': i, 'weight': clone[i].edges[j].weight});
		}
	}
	for (var i = 0; i < clone.length; i++) used[i] = false;
	for (var i = 0; i < clone.length; i++)
		if (!used[i]) {
			dfs(i);
			c++;
		}
	return c;
}
  
function add_edge(evt) {
	if(state == "IDLE") {
		for(var i=0; i<vertices.length; i++) {
			if(vertices[i].circle == this) {
				var t = prompt("Метка вершины:");
				var mark = new Kinetic.Text({
					x: vertices[i].circle.x() - 10, 
					y: vertices[i].circle.y() - 7.5,
					text: t,
					fill: 'black',
				});
				break;
			}
		}
		layer3.add(mark);
		layer3.draw();
	}
	if(state == "ADD_EDGE") {
	for(var i=0; i<vertices.length; i++) {
		if(vertices[i].circle == this) {
			if(flag == "BEG") {
				beg = i;
				flag = "END";
			}
			else if(flag == "END") {
				end = i;
				flag = "BEG";
				vertices[beg].edges.push({"number": end});
                var fromx = vertices[beg].circle.x();
                var fromy = vertices[beg].circle.y();
                var tox = vertices[end].circle.x();
                var toy = vertices[end].circle.y();
                var headlen = 20;
                var angle = Math.atan2(toy - fromy,tox - fromx);
                var cx = tox - 15*Math.cos(angle),
                    cy = toy - 15*Math.sin(angle);

                var points = [
	                fromx, fromy,
                    tox, toy,
                    cx, cy,
	                cx-headlen*Math.cos(angle-Math.PI/6),
	                cy-headlen*Math.sin(angle-Math.PI/6),
	                cx, cy,
	                cx-headlen*Math.cos(angle+Math.PI/6),
	                cy-headlen*Math.sin(angle+Math.PI/6)
                ];
				var edge = new Kinetic.Line({
					points: points,
					stroke: 'black',
					strokeWidth: 2,
					lineCap: 'round',
					lineJoin: 'round'
				});
				var w;
				if ($('#weighted').prop('checked')) {
					w = prompt("Введите вес ребра: ");
					vertices[beg].edges[vertices[beg].edges.length - 1].weight = parseInt(w);
				}
				if (!$('#weighted').prop('checked')) {
					w = "";
					vertices[beg].edges[vertices[beg].edges.length - 1].weight = 1;
				}	
				var weight = new Kinetic.Text({
                    x: 0.5 * (fromx + tox) - 15 * Math.sin(angle),
                    y: 0.5 * (fromy + toy) + 15 * Math.cos(angle),
                    text: w,
                    fill: 'blue',
                });
				
				layer2.add(edge);
				layer2.add(weight);
				layer2.draw();
			}
			break;
			}
		}
	}
}

stage.on('click', function(ev) {
	if(state != "ADD_VER") return;
	var r = new Kinetic.Ellipse({
        x: ev.evt.offsetX, y: ev.evt.offsetY,
        radius: {x: 15, y: 15}, fill: '#E6E6FA', strokeWidth: 1, stroke: '#000000'
    });
	r.on('click', add_edge);
	vertices.push({"number": vertices.length, "edges": [], "circle": r});
    layer.add(r);
    layer.draw();
});  
  
box.on('mouseout', function() {
    document.body.style.cursor = 'default';
});
layer2.add(box);
stage.add(layer2);
stage.add(layer);
stage.add(layer3);

$("#fin").click(function() {
	count();
	console.log(components());
});

$("#add_ver").click(function() {
	if(state == "IDLE") {
		state = "ADD_VER";
		$("#add_ver").css("color", "blue");
	}
	else if(state == "ADD_VER") {
		state = "IDLE";
		$("#add_ver").css("color", "black");
	}
});

$("#add_edge").click(function() {
	if(state == "IDLE") {
		state = "ADD_EDGE";
		$("#add_edge").css("color", "blue");
	}
	else if(state == "ADD_EDGE") {
		state = "IDLE";
		$("#add_edge").css("color", "black");
	}
});