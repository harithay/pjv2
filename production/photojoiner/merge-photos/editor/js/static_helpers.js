$.ajaxSetup({
	xhrFields: { 
        withCredentials: true,
		credentials: 'same-origin'
    }
});

function getRandomNumbers() {
	var cryptoObj = window.crypto || window.msCrypto; 
	var array = new Uint32Array(3);
	cryptoObj.getRandomValues(array);
 
	var randText = "";
	for (var i = 0; i < array.length; i++) {
		randText += array[i] + "-";
	}
	return randText;
}

function rgbaObjectToCSSRGBAColorString(rgbaObject){
	return "rgba(" + rgbaObject.r + "," + rgbaObject.g + "," + rgbaObject.b + "," + rgbaObject.a + ")";
};
function clientRectToObject(clientRect){
	var obj = {};
	obj.bottom = clientRect.bottom;
	obj.height = clientRect.height;
	obj.left = clientRect.left;
	obj.right = clientRect.right;
	obj.top = clientRect.top;
	obj.width = clientRect.width;
	return obj;
}

function isPointWithinRectabgle(x , y, pos) {
    return pos.left <= x && x <= pos.right && pos.top <= y && y <= pos.bottom;
}
function getAllChildNodes(element, resultArray){
	var childNodes = element.childNodes;
	for(var i = 0; i < childNodes.length; i++){
        resultArray.push(childNodes[i]);
		getAllChildNodes(childNodes[i], resultArray);
	}
}
function elementsFromPoint(x, y, context, selector) {
    // Fallback to built in method if no context provided. (In IE)
    /*
	if (!context || document.msElementsFromPoint || document.elementsFromPoint) {
		var nativeElementsFromPoint = document.elementsFromPoint || document.msElementsFromPoint;
        return (document.elementsFromPoint && document.elementsFromPoint(x,y)) || 
				(document.msElementsFromPoint && document.msElementsFromPoint(x, y)) || null;
    }
    */
    var elements = [];
	getAllChildNodes($(selector).get(0), elements)
    var result = [];
	for(var i = 0; i < elements.length; i++){
		var element = elements[i];
		if(element.getBoundingClientRect){
			var pos = element.getBoundingClientRect();
			if(isPointWithinRectabgle(x, y, pos)){
				result.push(element);
			}
		}else{
			console.log("Element does not contain getBoundingClientRect property");
		}
		
	}

    return result.reverse();
};
$(".resizePanel .resizeCanvas").click(function(e){
	var backboneModel = backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0];
	var pageWidth = backboneModel.attributes.pageWidth;
	var pageHeight = backboneModel.get("children")[0].attributes.pageHeight;
	var modal = $(".resizeCanvasModal");
	//Add title
	modal.find(".modal-title").text("Update canvas print area")
	var canvasSizeOptions = [
		{
			name : "Custom",
			type : "custom",
			width : 2000,
			height : 2000,
		},{
			name : "Square",
			type : "preset",
			width : 2000,
			height : 2000,
		},{
			name : '2 x 2.5"',
			type : "preset",
			width : 2000,
			height : 2500,
		},{
			name : '3 x 5"',
			type : "preset",
			width : 2000,
			height : 3333,
		},{
			name : '4 x 6"',
			type : "preset",
			width : 2000,
			height : 3000,
		},{
			name : '5 x 7"',
			type : "preset",
			width : 2000,
			height : 2800,
		},{
			name : '8 x 10"',
			type : "preset",
			width : 2000,
			height : 2500,
		},{
			name : '11 x 14"',
			type : "preset",
			width : 2000,
			height : 2545,
		},{
			name : '16 x 9"',
			type : "preset",
			width : 2000,
			height : 1125,
		},{
			name : '',
			type : "preset",
			width : 2000,
			height : 2000,
		},{
			name : 'Facebook cover',
			type : "preset",
			width : 850,
			height : 315,
		},{
			name : 'Twitter picture',
			type : "preset",
			width : 500,
			height : 500,
		},{
			name : '800x600',
			type : "preset",
			width : 2000,
			height : 2000,
		},{
			name : '1024x768',
			type : "preset",
			width : 1024,
			height : 768,
		},{
			name : '1280x800',
			type : "preset",
			width : 1280,
			height : 800,
		},{
			name : '1280x1024',
			type : "preset",
			width : 1280,
			height : 1024,
		},{
			name : 'HD (1600x900)',
			type : "preset",
			width : 1600,
			height : 900,
		},{
			name : 'Full HD (1920x1080)',
			type : "preset",
			width : 1920,
			height : 1080,
		},{
			name : '4K (4096x2160)',
			type : "preset",
			width : 4096,
			height : 2160,
		},{
			name : 'iPad 3+',
			type : "preset",
			width : 2048,
			height : 1536,
		},{
			name : 'IPhone 4',
			type : "preset",
			width : 640,
			height : 960,
		},{
			name : 'IPhone 5',
			type : "preset",
			width : 640,
			height : 1136,
		},{
			name : 'IPhone 6/7',
			type : "preset",
			width : 750,
			height : 1334,
		},{
			name : 'IPhone 7+',
			type : "preset",
			width : 1080,
			height : 1920,
		}
	];
	var canvasSizeOptionsHTMLList = "";
	for(var i = 0; i < canvasSizeOptions.length; i++){
		var option = canvasSizeOptions[i];
		canvasSizeOptionsHTMLList += '<li role="presentation" class="resizeOptionItem ' + option.type + '">\
			<a data-width="' + option.width + '" data-height="' + option.height + '" role="menuitem" tabindex="-1" href="#">' + option.name + '</a></li>';
		if(option.type == "custom"){

		}

	}
	//Create body
	var bodyString = '<div class="dropdown">\
    	<button class="btn btn-primary dropdown-toggle currentSelection" id="menu1" type="button" data-toggle="dropdown">Select a option\
    	<span class="caret"></span></button>\
		<ul class="dropdown-menu" role="menu" aria-labelledby="menu1">\
			' + canvasSizeOptionsHTMLList + 
		'</ul>\
		<div class="customResizeOptions">\
			<input size="7" type="text" class="form-control option width">\
			<div style="margin: 5px;">px</div>\
			<input size="7" type="text" class="form-control option height">\
			<div style="margin: 5px;">px</div>\
		</div>\
  	</div>';
	
	var bodyHTML = jQuery.parseHTML(bodyString);
	var jBody = $(bodyHTML);
	
	//Show model
	modal.find(".modal-body").html(bodyHTML);
	modal.modal("show");

	jBody.find(".customResizeOptions .width").val(pageWidth)
	jBody.find(".customResizeOptions .height").val(pageHeight)
	
	//Activate selection on dropdown 
	var selection = $("a[data-width="+ pageWidth + "][data-height="+ pageHeight + "]");
	if(selection.length){
		selection.addClass("active");
		jBody.find(".customResizeOptions input").attr("readonly", "");
	}else{
		modal.find('.custom').addClass("active");
		jBody.find(".customResizeOptions input").removeAttr("readonly");
	}

	

	//Dropdown select events
	modal.find("ul > li:not(.divider)").click(function(e){
		modal.find("ul > li:not(.divider)").removeClass("active");
		var target = $(e.target).closest("li");
		target.addClass("active");
		if(target.hasClass("preset")){
			modal.find(".customResizeOptions input").attr("readonly", "");
			modal.find(".customResizeOptions .width").val(target.find("a").get(0).dataset.width);
			modal.find(".customResizeOptions .height").val(target.find("a").get(0).dataset.height);
		}else{
			modal.find(".customResizeOptions input").removeAttr("readonly");
		}
	}.bind(this));

	//on click save
	modal.find(".save-changes").click(function(e){
		e.stopPropagation();
		var newPageWidth = modal.find(".customResizeOptions .width").val();
		var newPageHeight = modal.find(".customResizeOptions .height").val();

		backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({"pageWidth": parseInt(newPageWidth)});
		backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].get("children")[0].set({"pageHeight" : parseInt(newPageHeight)})

		

		var bestFitZoom = 4 * parseInt(100 * ($(".document").width()/ parseInt(newPageWidth))/4);
		backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({
			"zoom" : bestFitZoom/100,	
		});
		$(".zoomOptions .menu").text(bestFitZoom + "%");
		$(".zoomOptionList > ul > li").removeClass("active");
		$(".zoomOptionList > ul > li[data-zoom=a").addClass("active");
		modal.modal("hide");
		e.stopPropagation();
		modal.find(".save-changes").unbind();
	}.bind(this));
});

$(".resizeButton").click(function(e){

	var bestFitZoom = 4 * parseInt(100 * ($(".document").width()/ backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].attributes.pageWidth)/4);
	var bestFillZoon = 4 * parseInt(100 * ($(".document").height()/ backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].get("children")[0].attributes.pageHeight)/4);
	
	var current = $(".zoomOptionList > ul > li.active");
	if(current.get(0).dataset.zoom == "a" || current.get(0).dataset.zoom == "b"){
		if($(e.target).closest(".zoomIn").length){
			var currentZoom = parseInt($(".zoomOptions .menu").text());
			var liList = $(".zoomOptionList > ul > li.number");
			for(var i = 0; i < liList.length; i++){
				var li = liList[i];
				if(li.dataset.zoom > currentZoom){
					var zoom = li.dataset.zoom;
					backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({
						"zoom" : zoom/100,	
					});
					$(".zoomOptionList > ul > li").removeClass("active");
					$(li).addClass("active");
					$(".zoomOptions .menu").text(zoom + "%");
					break;
				}
			}
		}else{
			var currentZoom = parseInt($(".zoomOptions .menu").text());
			var liList = $(".zoomOptionList > ul > li.number");
			for(var i = liList.length - 1; i >= 0; i--){
				var li = liList[i];
				if(li.dataset.zoom < currentZoom){
					var zoom = li.dataset.zoom;
					backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({
						"zoom" : zoom/100,	
					});
					$(".zoomOptionList > ul > li").removeClass("active");
					$(li).addClass("active");
					$(".zoomOptions .menu").text(zoom + "%");
					break;
				}
			}
		}
	}else{
		if($(e.target).closest(".zoomIn").length){
			var next = $(".zoomOptionList > ul > li.active").next();
			
			if(next && next.length && next.get(0).dataset.zoom){
				var zoom = next.get(0).dataset.zoom;
				backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({
					"zoom" : zoom/100,	
				});
				$(".zoomOptionList > ul > li").removeClass("active");
				next.addClass("active");
				$(".zoomOptions .menu").text(zoom + "%");
			}else{
				var currentZoom = parseInt($(".zoomOptions .menu").text());
				var liList = $(".zoomOptionList > ul > li.number");
				for(var i = 0; i < liList.length; i++){
					var li = liList[i];
					if(li.dataset.zoom > currentZoom){
						var zoom = li.dataset.zoom;
						backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({
							"zoom" : zoom/100,	
						});
						$(".zoomOptionList > ul > li").removeClass("active");
						$(li).addClass("active");
						$(".zoomOptions .menu").text(zoom + "%");
						break;
					}
				}
			}
		}else {
			var prev = $(".zoomOptionList > ul > li.active").prev();
			if(prev && prev.length && prev.get(0).dataset.zoom){
				var zoom = prev.get(0).dataset.zoom;
				backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({
					"zoom" : zoom/100,	
				});
				$(".zoomOptionList > ul > li").removeClass("active");
				prev.addClass("active");
				$(".zoomOptions .menu").text(zoom + "%");
			}else{
				var currentZoom = parseInt($(".zoomOptions .menu").text());
				var liList = $(".zoomOptionList > ul > li.number");
				for(var i = liList.length - 1; i >= 0; i--){
					var li = liList[i];
					if(li.dataset.zoom < currentZoom){
						var zoom = li.dataset.zoom;
						backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({
							"zoom" : zoom/100,	
						});
						$(".zoomOptionList > ul > li").removeClass("active");
						$(li).addClass("active");
						$(".zoomOptions .menu").text(zoom + "%");
						break;
					}
				}
			}
		}
	}
});
$(".zoomOptions .menu").click(function(e){
	$(".zoomOptionPanel").toggleClass("active");
});

$(".zoomOptionList > ul > li").click(function(e){
	$(".zoomOptionList > ul > li").removeClass("active");
	$(e.target).addClass("active");
	console.log(e.target.dataset.zoom);
	if(e.target.dataset.zoom == "a" || e.target.dataset.zoom == "b"){
		var zoom = 100;
		if(e.target.dataset.zoom == "a"){
			zoom = 4 * parseInt(100 * ($(".document").width()/ backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].attributes.pageWidth)/4);
		}else{
			zoom = 4 * parseInt(100 * ($(".document").height()/ backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].get("children")[0].attributes.pageHeight)/4);
		}
		backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({
			"zoom" : zoom/100,	
		});
		$(".zoomOptions .menu").text(zoom + "%");
	}else {
		backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({
			"zoom" : e.target.dataset.zoom/100,
		});
		$(".zoomOptions .menu").text(e.target.dataset.zoom + "%");
	}
	$(".zoomOptionPanel").toggleClass("active");
});

$(".graphicsPanel menu li").click(function(e){
	$(".graphicsPanel > .content").removeClass("retracted");
	$(".graphicsPanel .menuHide").toggleClass("retracted");
	$(".graphicsPanel menu li").removeClass("active");
	$(this).addClass("active");
	var px = $(this).data("tab") * 72;
	$(".selectedItem").css("transform","translate(0px," + px + "px)");
	sideBarTabMenu.showTab($(this).data("tab"));
});
// Bootstrap initial state
$(".selectedItem").css("transform","translate(0px, 72px)");
$(".graphicsPanel .menuHide").click(function(e){
	$(".graphicsPanel > .content").toggleClass("retracted");
	$(".graphicsPanel .menuHide").toggleClass("retracted");
});


$("a.new-canvas").click(function(e){
	
	var modal = $(".confirmNewCanvas");
	modal.find(".modal-title").text("Warning!");
	var bodyHTML = $($.parseHTML('<div class="">\
		This will delete all your changes and creates a blank Canvas. Is that what you want?\
		</div>\
	</div>'));
	modal.find(".modal-body").html(bodyHTML);
	modal.modal("show");
	//on click save
	modal.find(".save-changes").click(function(e){
		e.stopPropagation();
		dataModel =  modelWalkRecursive(Model);
		localStorage.setItem("model", JSON.stringify(dataModel.toJSON()));
		setTimeout(function(e){
			window.location.reload();
		}, 1000);
		modal.modal("hide");
		e.stopPropagation();
		modal.find(".save-changes").unbind();
	}.bind(this));

	modal.on("hide.bs.modal", function(e){
		modal.find(".save-changes").unbind();
	}.bind(this));
}.bind(this));

$("a.convert-option").click(function(e){
	//Show modal
	$(".downloadConvertedDesgin").find(".modal-title").text("Download image");
	var urlData = null;
	var bodyHTML = $($.parseHTML('<div class="progress">\
		<div class="progress-bar progress-bar-striped active" role="progressbar"\
		aria-valuenow="0" data-value="0" aria-valuemin="0" aria-valuemax="100" style="width:0%">\
			0%\
		</div>\
	</div>'));
	$(".downloadConvertedDesgin").find(".modal-body").html(bodyHTML);
	var interval = setInterval(function(e){
		
		var width = parseInt($(".downloadConvertedDesgin .progress-bar").attr("data-value")) + 10;
		console.log(width);
		$(".downloadConvertedDesgin .progress-bar").css("width", width + "%");
		$(".downloadConvertedDesgin .progress-bar").text((width) + "%");
		$(".downloadConvertedDesgin .progress-bar").attr("aria-valuenow", width);
		$(".downloadConvertedDesgin .progress-bar").attr("data-value", width);
		if(urlData){
			var d = JSON.parse(urlData);
			clearInterval(interval);

			//Show download link
			var bodyHTML = $($.parseHTML('<img style="max-width:200px" src="//s3.photojoiner.net/PJ/convert/' + d.path + '"/>\
				<a href="//s3.photojoiner.net/PJ/convert/' + d.path + '">\
					Download image\
			</a>'));
			$(".downloadConvertedDesgin").find(".modal-body").html(bodyHTML);
		}
	}.bind(this),1000);
	$(".downloadConvertedDesgin").modal("show");

	var zoom = backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].get("zoom");
	backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({"zoom" : 1,});
	setTimeout(function(){
		var type = $(e.target).data("convert-type");

		var multipageHTML = $(".multipage")[0].outerHTML;
		//add webkit css
		var arr = ["transform", "perspective", "perspective-origin", "transform-origin", "transform-style", "background-clip", "background-origin", "background-size", "border-bottom-left-radius", "border-bottom-right-radius", "border-image", "border-radius", "border-top-left-radius", "border-top-right-radius", "box-sizing", "opacity", "box-ordinal-group", "box-orient", "box-pack", "box-reflect", "box-shadow", "box-align", "box-direction", "box-flex", "filter" ];
		for(var i = 0; i < arr.length; i++){
			var property = arr[i];
			var regex = new RegExp(property + "(.*?;)", "ig");
			multipageHTML = multipageHTML.replace(regex, property + "$1 -webkit-" + property + "$1");
		}
		//multipageHTML = multipageHTML.replace(/border-radius(.*?;)/ig, "border-radius$1 -webkit-border-radius$1");
		var data = btoa(multipageHTML);
		var pages = $(".multipage").find(".page");
		var printAreas = [];
	
	
		for(var i = 0; i < pages.length; i++){
			var page = pages[i];
			var obj = {};
			
			obj.width = $(page).width();
			obj.height = $(page).height();
			obj.top = 0;
			obj.left = 0;
			printAreas.push(obj);
		}
		backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({"zoom" : zoom,});
		$.ajax({
			url : "//s3.photojoiner.net/PJ/convert",
			data : {
				data: data,
				type: type,
				printArea : JSON.stringify(printAreas)
			},
			method : 'POST',
			success : function(data, status){
				urlData = data;
				console.log(data);
			}.bind(this)
		});
	}.bind(this), 2000);
});

/* INTERGRATE THIS */
$("body")[0].addEventListener("touchstart", function(e){ 
	if($(e.target).closest(".movable").length){
		//e.preventDefault();
	}
}, {passive:false});

/**
 * File upload
 */
setTimeout(function(){
	$.ajax({
		url : "//s3.photojoiner.net/PJ/user",
		credentials: 'same-origin',
	});
}, 1000);
$('.fileupload-button').fileupload({
	// Uncomment the following to send cross-domain cookies:
	xhrFields: {withCredentials: true,credentials: 'same-origin'},
	url: '//s3.photojoiner.net/PJ/upload',
	progress : function(e, data){
		var progress = parseInt(data.loaded / data.total * 100, 10);
		console.log(progress);
		$(".site .header .navbar").css("background","linear-gradient(90deg, rgb(214, 214, 214) " + progress + "%, rgba(153, 65, 65, 0) 0%").
		css("backgroundColor", "#f8f8f8");
		if(progress == 100){
			$(".site .header .navbar").css("background","linear-gradient(90deg, rgb(214, 214, 214) " + 0 + "%, rgba(153, 65, 65, 0) 0%").
			css("backgroundColor", "#f8f8f8");
		}
	},
	start : function(){
		toastr.success("Upload in progress. Please wait.");
	},
	done : function(e,data){
		console.log("Upload completed.")
		try{
			var result = JSON.parse(data.result).data;
			fileLibrary.addItemByJSONObject(result);
		}catch(e){
			console.log(e);
		}
	}
});
/**
 * Ad close
 */
$(".adsenseContainerCloseButton").click(function(e){
	$(e.target).closest(".adParentContainer").remove();
});
//setTimeout(function(e){
	$(".adsenseContainerCloseButton").closest(".adParentContainer").remove();
//},60 * 1000);

function setCaret(el) {
   	var att = document.createAttribute("contenteditable");       // Create a "class" attribute
    att.value = "true";                           // Set the value of the class attribute
    el.setAttributeNode(att); 
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(el.childNodes[0], 5);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
}