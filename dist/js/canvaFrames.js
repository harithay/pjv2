// Remove redundant a
var grids = $("li[class=grid]");
for(var i = 0; i < grids.length; i++) {
	var grid = grids[i];
	var div = $($(grid).find("div.rows")[0]).remove();
	$(grid).find("a").remove();
	$(grid).append(div);
};



// PJ row are Canva columns, so change them
$("li[class=grid] .rows").addClass("column");
$("li[class=grid] .columns").addClass("row");


function getRandomColor() {
	return "rgb(15, 197, 224)";
}


//var el = $("li[data-grid-name=Page*] a").remove();
//$("li[data-grid-name=Page50]").append(el.first("div"))

function analyzeGrid(rootEl){
    var width = parseFloat($(rootEl).get(0).style.width) || 100;
    var height = parseFloat($(rootEl).get(0).style.height) || 100;
	if($(rootEl).hasClass("row")){
		var rowChildren = [];
		var row = {
			"type": "row",
			"row" : rowChildren,
			"style" : {
				height : height + "%",
				top : $(rootEl).get(0).style.top,
                width: "100%",
			},
		}
		var children = $(rootEl).children();
		for(var i = 0; i < children.length; i++) {
			var child = children[i];
			rowChildren.push(analyzeGrid(child))
		}
		return row;
	}else if($(rootEl).hasClass("column")){
		var columnChildren = [];
		var column = {
			"type": "column",
			"column" : columnChildren,
			"style" : {
				width : width + "%",
				left : $(rootEl).get(0).style.left,
                height: "100%",
			},
		}
		var children = $(rootEl).children();
		for(var i = 0; i < children.length; i++) {
			var child = children[i];
			columnChildren.push(analyzeGrid(child))
		}
		return column;
	}else if($(rootEl).hasClass("item")){
		var item = {
			"type": "cell",
			"cell" : [{
				"type": "cellContent", 
				"cellContent" : [{
					"type": "cellImage",
					"cellImage" : [{
								
					}],
					"zoom" : 1,
					"style" : {
						"transform": "translate(0px, 0px)"
					}
				}],
				"style" : {
					backgroundColor : getRandomColor(),
					left: 1,
					right: 1,
					top: 1,
					bottom: 1,
					borderRadius: "0",
				}
			}],
			"style" : {
				"padding" : "0px",
			}
		};
		var isColumn = parseInt($(rootEl).get(0).style.width) || false;
		if(isColumn){
			var columnChildren = [item];
			var column = {
				"type": "column",
				"column" : columnChildren,
				"style" : {
					width : width + "%",
					left : $(rootEl).get(0).style.left,
                    height: "100%",
				},
			}
			return column;
		}else{
			var rowChildren = [item];
			var row = {
				"type": "row",
				"row" : rowChildren,
				"style" : {
					height : height + "%",
					top : $(rootEl).get(0).style.top,
                    width: "100%",
				},
			};
			return row;
		}
	}else if($(rootEl).hasClass("grid")){
		var rootRow = [];
		var obj = {
			"type" : "fixedCollageContainer",
			"fixedCollageContainer" : [{
                //Contaiers contents root is always a Row
                "type": "row",
                "row" : rootRow,
                "style" : {
                    "width": "100%",
                    "height": "100%",
                }
            }],
			"style" : {
				"width": "120px",
				"height": "120px",
				"transform": "translate(0px, 0px)",
				"opacity": "1",
				"backgroundColor" : "#FFF", 
			}
		}
		var children = $(rootEl).children();
		for(var i = 0; i < children.length; i++) {
			var child = children[i];
			rootRow.push(analyzeGrid(child))
		}
		return obj;
	}
}



var array = [];
for(var i = 0; i < grids.length; i++) {
	var grid = grids[i];
	array.push(analyzeGrid(grid));
}
