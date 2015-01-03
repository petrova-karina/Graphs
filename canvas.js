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

function print_count() {
	console.log("test");
}  

var current_color;

function c_dfs(v) {
	color[v] = 1;
	single_comp[v] = current_color;
    for (var i = 0; i < edges[v].length; i++) {
        if (!color[edges[v][i].first]) 
            c_dfs(edges[v][i].first);
    }
    color[v] = 2;
}

function components(vert) {
	makeUndirected(vert);
	var count = 0;
	for (var i = 0; i < N; i++) 
		if (color[i] == 0) {
			count++;
			current_color = count;
			c_dfs(i);
		}
	return count;
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
				if (i == beg) 
					flag = "BEG";
				else {
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
	bicone(vertices);
	print_count();
	console.log(components(vertices));
	if(check_planarity()) alert("Граф планарен"); else alert("Граф не планарен");
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



function min(x, y) 
{
	return (x < y) ? x : y;
}

var N;
var color;
var enter;
var up;
var comp;
var edges;
var component;
var time;
var answer;
var comp_number;
var single_comp;

function bi_dfs(v, parent) {
    component.push(v);
    color[v] = 1;
    enter[v] = time++;
    up[v] = enter[v];
    for (var i = 0; i < edges[v].length; i++) {
        if (!color[edges[v][i].first]) {
            bi_dfs(edges[v][i].first, v);
            up[v] = min(up[v], up[edges[v][i].first]);
        } else if (edges[v][i].first != parent) {
            up[v] = min(up[v], enter[edges[v][i].first]);
        }
        if (color[edges[v][i].first] == 2 && up[edges[v][i].first] >= enter[edges[v][i].first]) {
            comp_number++;
            while (component[component.length - 1] != edges[v][i].first) {
                comp[component.pop()] = comp_number;
            }
            comp[component.pop()] = comp_number;
        }
    }
    color[v] = 2;
}

function makeUndirected(vert) {
	N = vert.length;
	time = 0;
	component = [];
	answer = [];
	comp_number = 0;

	color = [];
	enter = [];
	up = [];
	comp = [];
	single_comp = [];
	for (var i = 0; i < N; i++) 
		color[i] = enter[i] = up[i] = comp[i] = single_comp[i] = 0;

    edges = [];
	for (var i = 0; i < vert.length; i++) 
    	edges[i] = [];

    var counter = 0;
    for (var i = 0; i < vert.length; i++) 
		for (var j = 0; j < vert[i].edges.length; j++) {
			edges[i].push({"first": vert[i].edges[j].number, "second": ++counter});    	
			edges[vert[i].edges[j].number].push({"first": i, "second": ++counter});    	
		}
}

function bicone(vert) {
	makeUndirected(vert);

    for (var i = 0; i < N; i++)
        if (!color[i])
            bi_dfs(i, -1);

    comp_number++;
    while (component.length > 0) {
        comp[component.pop()] = comp_number;
    }

	return {"count": comp_number, "list": comp};   
}

var cycle_vertices;

function cycle_dfs(v, parent) {
	color[v] = 1;
	var cycle_found = false;
	var result;
    for (var i = 0; i < edges[v].length; i++) {
    	if (edges[v][i].first != parent) {
	        if (color[edges[v][i].first] == 0) { 
	            result = cycle_dfs(edges[v][i].first, v);
	            if (result.exit) 
	            	return result;
	            if (result.cycle) {
	            	cycle_found = true;
	            	break;
	            }
	        }
	        if (color[edges[v][i].first] == 1) {// cycle found 
	        	cycle_vertices.push(v);
	        	return {"cycle": true, "start": edges[v][i].first, "exit": false};
	        }
    	}
    }
    if (cycle_found) {
    	cycle_vertices.push(v);
    	if (v != result.start)
    		return result;
    	else 
    		return {"cycle": false, "exit": true}
    }
    color[v] = 2;
    return {"cycle": false, "exit": false};
}

function get_cycle(vert) {
	makeUndirected(vert);
	cycle_vertices = [];
	cycle_dfs(0, -1);
	return cycle_vertices;
}

var rest_components;
var rest_color;
var placed;

function rest_dfs(v) {
	color[v] = 1;
	rest_components[v] = rest_color;
	for (var i = 0; i < edges[v].length; i++)
		if (color[edges[v][i].first] == 0 && !placed[edges[v][i].first]) 
			rest_dfs(edges[v][i].first);
	color[v] = 2;
}

var path_from;
var path_to;
var path_answer;
var good_vertices;
var matrix;

function path_dfs(v, flag, parent) {
	console.log("come to: " + v)
	color[v] = 1;
	if (v == path_from && flag) {
		path_answer.push(v);
		return true;
	}
	for (var i = 0; i < edges[v].length; i++) {
		if (edges[v][i].first != parent && (color[edges[v][i].first] == 0 || edges[v][i].first == path_from) && good_vertices[edges[v][i].first] && !matrix[v][edges[v][i].first]) 
			if (path_dfs(edges[v][i].first, true, v)) {
				path_answer.push(v);
				return true;
			}
	}
	color[v] = 2;
	return false;
}

function check_biconnected_planarity(vert) {
	if (vert.length == 1)
		return true;
	var sides = [];
	var first_cycle = get_cycle(vert);
	sides.push(first_cycle);
	sides.push(first_cycle);
	placed = [];
	for (var i = 0; i < first_cycle.length; i++)
		placed[first_cycle[i]] = true;

	var vertex_sides = [];
	for (var i = 0; i < N; i++)
		if (placed[i])
			vertex_sides[i] = [0, 1];
		else
			vertex_sides[i] = [];

	while (true) {

		matrix = [];
		for (var i = 0; i < N; i++) {
			matrix[i] = [];
			for (var j = 0; j < N; j++)
				matrix[i][j] = false;
		}
		for (var i = 0; i < sides.length; i++) {
			for (var j = 0; j < sides[i].length - 1; j++) {
				matrix[sides[i][j]][sides[i][j + 1]] = true;
				matrix[sides[i][j + 1]][sides[i][j]] = true;
			}
			matrix[sides[i][0]][sides[i][sides[i].length - 1]] = true;
			matrix[sides[i][sides[i].length - 1]][sides[i][0]] = true;
		}

		var segments = [];
		var segment_comps = [];
		for (var i = 0; i < N; i++)
			if (placed[i])
				for (var j = 0; j < edges[i].length; j++) 
					if (edges[i][j].first > i) {
						console.log(i + ", " + edges[i][j].first);
						if (placed[edges[i][j].first] && !matrix[i][edges[i][j].first]) {
							segments.push([i, edges[i][j].first]);
							segment_comps.push([]);
						}
					}

		rest_components = [];
		color = [];
		for (var i = 0; i < N; i++)
			color[i] = 0;

		rest_color = 0;
		for (var i = 0; i < N; i++)
			if (color[i] == 0 && !placed[i]) {
				rest_color++;
				rest_dfs(i);
			}

		for (var i = 1; i <= rest_color; i++) {
			var inner_vert = [];
			var outer_vert = [];
			for (var j = 0; j < N; j++)
				if (rest_components[j] == i)
					inner_vert.push(j);
			for (var j = 0; j < inner_vert.length; j++)
				for (var k = 0; k < edges[inner_vert[j]].length; k++) 
					if (placed[edges[inner_vert[j]][k].first])
						outer_vert.push(edges[inner_vert[j]][k].first);
			segments.push(outer_vert);
			segment_comps.push(inner_vert);
		}

		var intersect = function(a, b) {
			var result = [];
			for (var i = 0; i < a.length; i++) {
				for (var j = 0; j < b.length; j++)
					if (b[j] == a[i]) {
						result.push(a[i]);
						break;
					}
			}
			return result;
		}

		var size_gamma = [];
		var gamma = [];
		for (var i = 0; i < segments.length; i++) {
			var cur_set = vertex_sides[segments[i][0]];
			for (var j = 1; j < segments[i].length; j++)
				cur_set = intersect(cur_set, vertex_sides[segments[i][j]]);
			gamma.push(cur_set);
			size_gamma.push(cur_set.length);
		}

		console.log(rest_components);
		console.log(segments.length);
		for (var i = 0; i < segments.length; i++) {
			console.log(segments[i]);
			console.log(segment_comps[i]);
			console.log(gamma[i]);
		}

		if (segments.length == 0)
			return true;

		console.log("size gamma:");
		console.log(size_gamma);
		console.log("gamma:");
		for (var i = 0; i < gamma.length; i++)
			console.log(gamma[i]);

		var min_gamma = size_gamma[0];
		var min_gamma_id = 0;
		for (var i = 1; i < size_gamma.length; i++)
			if (size_gamma[i] < min_gamma) {
				min_gamma = size_gamma[i];
				min_gamma_id = i;
			}

		if (min_gamma == 0)
			return false;

		var cur_side = gamma[min_gamma_id][0];
		var new_side = sides.length;
		console.log("cur_side: " + cur_side);

		console.log("cur side");
		console.log(sides[cur_side]);

		path_from = segments[min_gamma_id][0];
		path_to = segments[min_gamma_id][1];
		path_answer = [];
		for (var i = 0; i < N; i++)
			color[i] = 0;
		good_vertices = [];
		for (var i = 0; i < N; i++)
			good_vertices[i] = false;
		good_vertices[path_from] = true;
		good_vertices[path_to] = true;
		for (var i = 0; i < segment_comps[min_gamma_id].length; i++)
			good_vertices[segment_comps[min_gamma_id][i]] = true;
		path_dfs(path_to, false);

		console.log("path:");
		console.log(path_answer);
		console.log(path_from + ", " + path_to);

		var from_in_cycle = -1;
		var to_in_cycle = -1;
		for (var i = 0; i < sides[cur_side].length; i++) {
			if (sides[cur_side][i] == path_from)
				from_in_cycle = i;
			if (sides[cur_side][i] == path_to)
				to_in_cycle = i;
		}

		console.log(from_in_cycle + ", " + to_in_cycle);

		var arr_append = function(a, b) {
			for (var i = 0; i < a.length; i++)
				if (a[i] == b)
					return;
			a.push(b);
		}

		var arr_replace = function(a, b, c) {
			for (var i = 0; i < a.length; i++)
				if (a[i] == b) {
					a[i] = c;
					return;
				}
		}

		if (path_from == path_to) {
			var new_cycle = [];
			var old_cycle = [];

			for (var i = 0; i < path_answer.length - 1; i++)
				new_cycle.push(path_answer[i]);

			for (var i = 0; i <= sides[cur_side].length; i++)
				old_cycle.push(sides[cur_side][(from_in_cycle + i) % sides[cur_side].length]);
			for (var i = 1; i < path_answer.length - 1; i++)
				old_cycle.push(path_answer[i]);			

			console.log("cycles:");
			console.log(new_cycle);
			console.log(old_cycle);

			for (var i = 0; i < path_answer.length; i++) {
				arr_append(vertex_sides[path_answer[i]], new_side);	
				arr_append(vertex_sides[path_answer[i]], cur_side);	
				placed[path_answer[i]] = true;
			}

			sides[cur_side] = old_cycle;
			sides.push(new_cycle);
			console.log("fix?");
			console.log("sides:");
			for (var i = 0; i < sides.length; i++)
				console.log(sides[i]);
			console.log("-----------");
			console.log("new vertex_sides:");
			for (var i = 0; i < vertex_sides.length; i++)
				console.log(vertex_sides[i]);
			console.log("-----");

		} else {
			var new_cycle = [];
			var old_cycle = [];
			for (var i = 0; i < path_answer.length; i++)
				new_cycle.push(path_answer[i]);
			var index = to_in_cycle;
			while (sides[cur_side][index] != path_from) {
				index = (index + 1) % sides[cur_side].length;
				if (sides[cur_side][index] != path_from) {
					new_cycle.push(sides[cur_side][index]);
					arr_replace(vertex_sides[sides[cur_side][index]], cur_side, new_side);
				}
			}

			
			for (var i = 0; i < path_answer.length; i++)
				old_cycle.push(path_answer[i]);
			index = to_in_cycle;
			while (sides[cur_side][index] != path_from) {
				index = (index - 1 + sides[cur_side].length) % sides[cur_side].length;
				if (sides[cur_side][index] != path_from)
					old_cycle.push(sides[cur_side][index]);
			}

			console.log("cycles:");
			console.log(new_cycle);
			console.log(old_cycle);

			for (var i = 0; i < path_answer.length; i++) {
				arr_append(vertex_sides[path_answer[i]], new_side);	
				arr_append(vertex_sides[path_answer[i]], cur_side);	
				placed[path_answer[i]] = true;
			}

			console.log(vertex_sides);
			console.log("sides:");
			for (var i = 0; i < sides.length; i++)
				console.log(sides[i]);
			console.log("-----------");

			sides[cur_side] = [];
			for (var i = 0; i < old_cycle.length; i++)
				sides[cur_side].push(old_cycle[i]);

			sides[new_side] = [];
			for (var i = 0; i < new_cycle.length; i++)
				sides[new_side].push(new_cycle[i]);


		}

		console.log("vertex_sides:");
		for (var i = 0; i < vertex_sides.length; i++)
			console.log(vertex_sides[i]);
		console.log("-----");
		
	}

	return true;
}

function check_connected_planarity(vert) {

	var cycle = get_cycle(vert);
	if (cycle.length == 0)
		return true;

	var bi_comp = bicone(vert);
	var cur_n = N;
	var cur_edges = edges;
	
	for (var i = 1; i <= bi_comp.count; i++) {
		var new_vertices = [];
		var new_n = 0; 
		var new_numeration = [];
		var rev_numeration = [];
		for (var j = 0; j < cur_n; j++)
			if (bi_comp.list[j] == i) {
				new_n++;
				new_numeration.push(j);
				rev_numeration[j] = new_numeration.length - 1;
			}

		for (var j = 0; j < new_n; j++) {
			new_vertices[j] = {"edges": []}
			for (var k = 0; k < cur_edges[new_numeration[j]].length; k++) 
				if (cur_edges[new_numeration[j]][k].first > new_numeration[j]) {
					if (rev_numeration[cur_edges[new_numeration[j]][k].first] != undefined)
						new_vertices[j].edges.push({"number": rev_numeration[cur_edges[new_numeration[j]][k].first]});
				}
		}

		if (!check_biconnected_planarity(new_vertices))
			return false;

	}

	return true;

}

function check_planarity() {

	var count = components(vertices);
	var cur_n = N;
	var cur_edges = edges;
	var cur_single_comp = single_comp;

	for (var i = 1; i <= count; i++) {
		var new_vertices = [];
		var new_n = 0; 
		var new_numeration = [];
		var rev_numeration = [];
		for (var j = 0; j < cur_n; j++)
			if (cur_single_comp[j] == i) {
				new_n++;
				new_numeration.push(j);
				rev_numeration[j] = new_numeration.length - 1;
			}

		for (var j = 0; j < new_n; j++) {
			new_vertices[j] = {"edges": []}
			for (var k = 0; k < cur_edges[new_numeration[j]].length; k++) 
				if (cur_edges[new_numeration[j]][k].first > new_numeration[j])
					new_vertices[j].edges.push({"number": rev_numeration[cur_edges[new_numeration[j]][k].first]});
		}
		
		if (!check_connected_planarity(new_vertices))
			return false;

	}

	return true;

}




