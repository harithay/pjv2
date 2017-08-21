window.MOUSE_EVENTS = {};
MOUSE_EVENTS.DBLCLICK = "dblclick";
MOUSE_EVENTS.CLICK = "click";
MOUSE_EVENTS.DOWN = "mousedown";
MOUSE_EVENTS.UP = "mouseup";
MOUSE_EVENTS.MOVE = "mousemove";
MOUSE_EVENTS.TOUCH_START = "mousedown";
MOUSE_EVENTS.TOUCH_MOVE = "mousemove";
MOUSE_EVENTS.TOUCH_END = "mouseup";

window.ModelRegistry = {};
window.BackboneObjectMap = new Map();

var DocumentModel = Backbone.Model.extend({
	defaults : function(){
		return { 
			id : 0,
			type : undefined, 
			// Ordered list of elements, zIndex depends on childs position on this array
			children : [],
		}
	},
	updateStyle(key, value){
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		object[key] = value;
		this.set("style", object);
	},
	updateStyleByObject(newStyles, isSilent) {
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		var newstyles = Object.getOwnPropertyNames(newStyles);
		for (var i = newstyles.length - 1; i >= 0; i--) {
			var newStylesKey = newstyles[i];
			var newStylesValue = newStyles[newStylesKey];
			object[newStylesKey] = newStylesValue;
		}
		this.set("style", object);
	},
	getView() {
		return $("div[data-id='" + this.cid +"']");
	},
	initialize() { 
		this.on("change", function(){
			console.log("Document changed.");
		});
	},
	swapChildrenAtIndex(index1, index2) {

	}
});
var MultipageModel = Backbone.Model.extend({
	defaults : function(){
		return { 
			id : 0,
			type : undefined, 
			// Ordered list of elements, zIndex depends on childs position on this array
			children : [],
			_defaultPageGap : 40,
			_defaultBottomPadding : 140
		}
	},
	updateStyle(key, value){
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		object[key] = value;
		this.set("style", object);
	},
	updateStyleByObject(newStyles, isSilent) {
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		var newstyles = Object.getOwnPropertyNames(newStyles);
		for (var i = newstyles.length - 1; i >= 0; i--) {
			var newStylesKey = newstyles[i];
			var newStylesValue = newStyles[newStylesKey];
			object[newStylesKey] = newStylesValue;
		}
		this.set("style", object, {silent : isSilent});
	},
	getView() {
		return $("div[data-id='" + this.cid +"']");
	},
	handleWindowResizeEvent(){
		//Center page
		var doc = $(".editorPanel")[0].getBoundingClientRect();
		var childDimension = {
			width : this.get("style").width,
			left : this.get("style").left,
		};
		if(childDimension.width < doc.width){
			childDimension.left = (doc.width - childDimension.width)/2;
		}else{
			childDimension.left = 10;
		}

		this.updateStyleByObject(childDimension);
	},
	initialize() { 
		this.on("change", function(){
			if(this.hasChanged("children")){
				var childDimension = {
					width :0,
					height: 0
				}
				var accumuatedGap = 0;
				var gap = this.get("_defaultPageGap");
				for(var i = 0; i < this.get("children").length; i++){
					var page = this.get("children")[i];
					// Fist update current child's location
					page.updateStyleByObject({
						top : childDimension.height + accumuatedGap
					});
					var pageStyle = page.get("style");
					childDimension.width = Math.max(parseFloat(pageStyle.width), childDimension.width);
					childDimension.height += parseFloat(pageStyle.height) + accumuatedGap;
					accumuatedGap += gap;
				}
				
				var paddingBottom = this.get("_defaultBottomPadding");
				childDimension.height += paddingBottom;

				//Center page
				var doc = $(".editorPanel")[0].getBoundingClientRect();
				if(childDimension.width < doc.width){
					childDimension.left = (doc.width - childDimension.width)/2;
				}else{
					childDimension.left = 10;
				}

				this.updateStyleByObject(childDimension);
			}
			if(this.hasChanged("pageWidth")){
				// This is only applyed to the child elements
			}
			if(this.hasChanged("zoom")){
				// This method resize child elements
				if($(".document").length == 0){
					console.warn("Page fail to update its contents since document was unawailable on DOM");
					 return;
				}
				var prev = this.previousAttributes();
				var zoom = this.get("zoom");

				/* User zoomed document
					1. Resize child page width based on pageWidth on MultipageModel
					2. Resize child page height based on pageHeight on PageModel
					3. Recalculate page top with new page heights
				*/


				// Previos values
				var width = parseFloat(this.get("style").width);
				// Prepare new width
				var pageWidth = parseFloat(this.get("pageWidth"));
				var newWidth = pageWidth * zoom;
				var ratio = {
					xFactor : 1,
					yFactor : 1
				}

				for(var i = 0; i < this.get("children").length; i++){
					var page = this.get("children")[i];
					// Previos values
					var prevPageHeight = parseFloat(page.get("style").height);
					var prevPageWidth = parseFloat(page.get("style").width);
					//Prepare new height
					var pageHeight = parseFloat(page.get("pageHeight"));
					var newHeight = pageHeight * zoom;

					//CSS change on page
					var obj = {};

					if(prevPageHeight != newHeight){
						obj.height = newHeight;
					}
					if(prevPageWidth != newWidth){
						obj.width = newWidth;
					}
					page.updateStyleByObject(obj);
					//page.updateStyleByObject(obj);

					//dimention change in ratio
					var newX = newWidth / prevPageWidth;
					var newY = newHeight / prevPageHeight;

					
					ratio.yFactor = newY;
					ratio.xFactor = newX;
					for(var j = 0; j < page.get("children").length; j++){
						var child = page.get("children")[j];
						//child.resizeRelatively(ratio);
					}
					console.log(ratio);
				}


				// call children change handler will take care of the MultipageModel and PageModel top and left
				// CSS
				var childDimension = {
					width : 0,
					height: 0
				}
				var accumuatedGap = 0;
				var gap = this.get("_defaultPageGap");
				for(var i = 0; i < this.get("children").length; i++){
					var page = this.get("children")[i];
					// Fist update current child's location
					page.updateStyleByObject({
						top : childDimension.height + accumuatedGap
					});
					var pageStyle = page.get("style");
					childDimension.width = Math.max(parseFloat(pageStyle.width), childDimension.width);
					childDimension.height += parseFloat(pageStyle.height) + accumuatedGap;
					accumuatedGap += gap;
				}
				
				var paddingBottom = this.get("_defaultBottomPadding");
				childDimension.height += paddingBottom;

				//Center page
				var doc = $(".editorPanel")[0].getBoundingClientRect();
				if(childDimension.width < doc.width){
					childDimension.left = (doc.width - childDimension.width)/2;
				}else{
					childDimension.left = 10;
				}

				this.updateStyleByObject(childDimension, true);

				for(var i = 0; i < this.get("children").length; i++){
					var page = this.get("children")[i];
					for(var j = 0; j < page.get("children").length; j++){
						var child = page.get("children")[j];
						child.resizeRelatively(ratio);
					}
				}

				
				/*
				if(zoomFactorWidth == "a" || zoomFactorWidth == "b" ){
					var docRect = $(".document")[0].getBoundingClientRect();
					var docWidth = docRect.width  - (docRect.width % 4);
					newWidth = docWidth;
					newHeight = pageHeight * docWidth / pageWidth;
				}
				

				

				//CSS change on page
				var obj = {
					width : 1,
					height : 1
				}
				if(prev.height != height){
					obj.height = newHeight;
				}
				if(prev.width != width){
					obj.width = newWidth;
				}
				//Calculate available space on document space
				var doc = $(".document")[0].getBoundingClientRect();
				if(obj.width < doc.width){
					obj.left = (doc.width - obj.width)/2;
				}else{
					obj.left = 10;
				}
				*/
				
			}
		});
	},
	swapChildrenAtIndex(index1, index2) {

	}
});
/*
	Page is the parent of all elements. Everything outside of page boundaries would be hidden,
	except selected item's resize handlers.
*/   
var PageModel = Backbone.Model.extend({
	defaults : function(){
		return { 
			id : 0,
			type : undefined, 
			// Ordered list of elements, zIndex depends on childs position on this array
			children : [],
		}
	},
	updateStyle(key, value){
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		object[key] = value;
		this.set("style", object);
	},
	updateStyleByObject(newStyles, isSilent) {
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		var newstyles = Object.getOwnPropertyNames(newStyles);
		for (var i = newstyles.length - 1; i >= 0; i--) {
			var newStylesKey = newstyles[i];
			var newStylesValue = newStyles[newStylesKey];
			object[newStylesKey] = newStylesValue;
		}
		this.set("style", object, {silent : isSilent});
	},
	addComponent(model, isSilent){
		var elementModel = this.get("children")[0].get("children")[0];
		if(!elementModel.get("children")){
			elementModel.set("children", {});
		}
		if(model.type == ModelClassNames.fixedCollageContainer.type){
			//Show warning
			var hasFixedCollageContainer = false;
			var array = new Array;
			for(var i = 0; i < elementModel.get("children").length; i++){
				var child = elementModel.get("children")[i];
				if(child.get("type") == ModelClassNames.fixedCollageContainer.type){
					hasFixedCollageContainer = true;
				}else{
					array.push(child);
				}
			}

			if(hasFixedCollageContainer){
				var callback = function(e){
					array.unshift(modelWalkRecursive([model]));
					elementModel.set("children", array, {silent : isSilent});
					e.target.removeEventListener("click", callback);
					$(".confirmation").modal("hide");
				}.bind(this);
				$(".confirmation .modal-title").text("Warning!");
				$(".confirmation .modal-body").text("This will replace your existing frame and its content. Would you like to preceed?");
				$(".confirmation .save-changes")[0].addEventListener("click", callback);
				$(".confirmation").modal("show");
				$(".confirmation").on("hide.bs.modal", function(e){
					$(this).unbind();
				});

			}else{
				array.unshift(modelWalkRecursive([model]));
				elementModel.set("children", array, {silent : isSilent});
			}
			
		}else {
			var children = elementModel.get("children");
			var arr = _.clone(children);
			arr.push(modelWalkRecursive([model]));

			elementModel.set("children", arr, {silent : isSilent});
		}
		
	},
	getView() {
		return $("div[data-id='" + this.cid +"']");
	},
	initialize() { 
		this.on("change", function(){
			console.log("Suppress Page changes..===================")
			return;
			/*if(this.hasChanged("width") || this.hasChanged("height")){
				var prev = this.previousAttributes();
				var height = this.get("height");
				var width = this.get("width");
				var obj = {
					width : 1,
					height : 1
				}
				if(prev.height != height){
					obj.height = height / prev.height;
				}
				if(prev.width != width){
					obj.width = width / prev.width;
				}
				console.log(obj);
			}*/
			if(this.hasChanged("pageWidth") || this.hasChanged("pageHeight") || this.hasChanged("zoomFactorWidth") || this.hasChanged("zoomFactorHeight")){
				if($(".document").length == 0){
					console.warn("Page fail to update its contents since document was unawailable on DOM");
					 return;
				}
				var prev = this.previousAttributes();
				var zoomFactorWidth = this.get("zoomFactorWidth");
				var zoomFactorHeight = this.get("zoomFactorHeight");

				var pageHeight = this.get("pageHeight");
				var pageWidth = this.get("pageWidth");

				var newHeight = pageHeight * zoomFactorHeight;
				var newWidth = pageWidth * zoomFactorWidth;

				if(zoomFactorWidth == "a" || zoomFactorWidth == "b" ){
					var docRect = $(".document")[0].getBoundingClientRect();
					var docWidth = docRect.width  - (docRect.width % 4);
					newWidth = docWidth;
					newHeight = pageHeight * docWidth / pageWidth;
				}

				var height = parseFloat(this.get("style").height);
				var width = parseFloat(this.get("style").width);

				//CSS change on page
				var obj = {
					width : 1,
					height : 1
				}
				if(prev.height != height){
					obj.height = newHeight;
				}
				if(prev.width != width){
					obj.width = newWidth;
				}
				//Calculate available space on document space
				var doc = $(".document")[0].getBoundingClientRect();
				if(obj.width < doc.width){
					obj.left = (doc.width - obj.width)/2;
				}else{
					obj.left = 10;
				}
				this.updateStyleByObject(obj);
				//dimention change in ratio
				var newX = newWidth / width;
				var newY = newHeight / height;

				var ratio = {
					xFactor : 1,
					yFactor : 1
				}
				ratio.yFactor = newY;
				ratio.xFactor = newX;
				for(var i = 0; i < this.get("children").length; i++){
					var child = this.get("children")[i];
					child.resizeRelatively(ratio);
				}
				
				console.log(ratio);
			}
		});
	},
	swapChildrenAtIndex(index1, index2) {

	}
});


var ElementsModel = Backbone.Model.extend({
	defaults : function(){
		return {
			id : 0,
			type : undefined,
			children : [],
			callbackArray : [],
		}
	},
	updateStyle(key, value){
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		object[key] = value;
		this.set("style", object);
	},
	updateStyleByObject(newStyles, isSilent) {
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		var newstyles = Object.getOwnPropertyNames(newStyles);
		for (var i = newstyles.length - 1; i >= 0; i--) {
			var newStylesKey = newstyles[i];
			var newStylesValue = newStyles[newStylesKey];
			object[newStylesKey] = newStylesValue;
		}
		this.set("style", object, {silent : isSilent, validate : true});
	},
	resizeRelatively(zoomFactorObject){
		var style = this.get("style") || {};
		var styleProperties = Object.getOwnPropertyNames(style);
		var object = {};
		for(var i = 0; i < styleProperties.length; i++){
			var styleProperty = styleProperties[i];
			if(styleProperty == "top" && zoomFactorObject.yFactor){
				object.top = parseFloat(style.top) * zoomFactorObject.yFactor;
			}else if(styleProperty == "left" && zoomFactorObject.xFactor){
				object.left = parseFloat(style.left) * zoomFactorObject.xFactor;
			}else if(styleProperty == "width" && zoomFactorObject.xFactor){
				object.width = parseFloat(style.width) * zoomFactorObject.xFactor;
			}else if(styleProperty == "height" && zoomFactorObject.yFactor){
				object.height = parseFloat(style.height) * zoomFactorObject.yFactor;
			}else if(styleProperty == "transform"){
				var transformMatrix = transformMatrixDecode(style.transform);
				if(zoomFactorObject.xFactor){
					transformMatrix.tx = transformMatrix.tx * zoomFactorObject.xFactor;
				}
				if(zoomFactorObject.yFactor){
					transformMatrix.ty = transformMatrix.ty * zoomFactorObject.yFactor;
				}
				object.transform = transformMatrixToString(transformMatrix);
			}
		}
		//Apply page resize to this
		this.updateStyleByObject(object, true);
		// Pass page resize to children
		for(var i = 0; i < this.get("children").length; i++){
			var child = this.get("children")[i];
			if(child.resizeRelatively) child.resizeRelatively(zoomFactorObject);
		}
	},
	addChildren(child) {
		var clonedChildren = _.clone(this.get("children"));
		clonedChildren.push(child);
		this.set("children", clonedChildren);
	},
	addCallbackArray(callback) {
		var clonedCallbackArray = _.clone(this.get("callbackArray"));
		clonedCallbackArray.push(callback);
		this.set("callbackArray", clonedCallbackArray);
	},
	getView() {
		return $("div[data-id='" + this.cid +"']");
	},
	initialize() { 
		this.on("change", function(){
			console.log("Changed: ElementsModels->callbackArray");

		});
	},
});
var ElementModel = Backbone.Model.extend({
	defaults : function(){
		return {
			id : 0,
			type : undefined,
			children : [],
			callbackArray : [],
		}
	},
	updateStyle(key, value){
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		object[key] = value;
		this.set("style", object);
	},
	updateStyleByObject(newStyles, isSilent) {
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		var newstyles = Object.getOwnPropertyNames(newStyles);
		for (var i = newstyles.length - 1; i >= 0; i--) {
			var newStylesKey = newstyles[i];
			var newStylesValue = newStyles[newStylesKey];
			object[newStylesKey] = newStylesValue;
		}
		this.set("style", object, {silent : isSilent, validate : true});
	},
	resizeRelatively(zoomFactorObject){
		var style = this.get("style") || {};
		var styleProperties = Object.getOwnPropertyNames(style);
		var object = {};
		for(var i = 0; i < styleProperties.length; i++){
			var styleProperty = styleProperties[i];
			if(styleProperty == "top" && zoomFactorObject.yFactor){
				object.top = parseFloat(style.top) * zoomFactorObject.yFactor;
			}else if(styleProperty == "left" && zoomFactorObject.xFactor){
				object.left = parseFloat(style.left) * zoomFactorObject.xFactor;
			}else if(styleProperty == "width" && zoomFactorObject.xFactor){
				object.width = parseFloat(style.width) * zoomFactorObject.xFactor;
			}else if(styleProperty == "height" && zoomFactorObject.yFactor){
				object.height = parseFloat(style.height) * zoomFactorObject.yFactor;
			}else if(styleProperty == "transform"){
				var transformMatrix = transformMatrixDecode(style.transform);
				if(zoomFactorObject.xFactor){
					transformMatrix.tx = transformMatrix.tx * zoomFactorObject.xFactor;
				}
				if(zoomFactorObject.yFactor){
					transformMatrix.ty = transformMatrix.ty * zoomFactorObject.yFactor;
				}
				object.transform = transformMatrixToString(transformMatrix);
			}
		}
		//Apply page resize to this
		this.updateStyleByObject(object, true);
		// Pass page resize to children
		for(var i = 0; i < this.get("children").length; i++){
			var child = this.get("children")[i];
			if(child.resizeRelatively) child.resizeRelatively(zoomFactorObject);
		}
	},
	addChild(child) {
		var clonedChildren = _.clone(this.get("children"));
		clonedChildren.push(child);
		this.set("children", clonedChildren);
	},
	addCallback(callback) {
		var clonedCallbackArray = _.clone(this.get("callbackArray"));
		clonedCallbackArray.push(callback);
		this.set("callbackArray", clonedCallbackArray);
	},
	getView() {
		return $("div[data-id='" + this.cid +"']");
	},
	getToolbarButtons(){
		
	},
	initialize() { 
		this.on("change", function(){
			console.log("Changed: ElementsModel->callbackArray");

		});
	},
});
var FixedCollageContainerModel = Backbone.Model.extend({
	defaults : function(){
		return {
			id : 0,
			type : undefined,
			children : [],
			style : {
				left : 0,
				right :0 ,
				top: 0,
				bottom: 0,
				borderRadius :0,
			}
		}
	},
	updateStyle(key, value){
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		object[key] = value;
		this.set("style", object);
	},
	validate: function( attributes ){
		if( attributes.style.width && (parseFloat(attributes.style.width) <= 10 || parseFloat(attributes.style.height) <= 10)){
			return "Width and height cannot be zero.";
		}
	},
	updateStyleByObject(newStyles, isSilent) {
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		var newstyles = Object.getOwnPropertyNames(newStyles);
		for (var i = newstyles.length - 1; i >= 0; i--) {
			var newStylesKey = newstyles[i];
			var newStylesValue = newStyles[newStylesKey];
			object[newStylesKey] = newStylesValue;
		}
		this.set("style", object, {silent : isSilent, validate : true});
	},
	resizeRelatively(zoomFactorObject){
		var style = this.get("style") || {};
		var styleProperties = Object.getOwnPropertyNames(style);
		var object = {};
		for(var i = 0; i < styleProperties.length; i++){
			var styleProperty = styleProperties[i];
			if(styleProperty == "top" && zoomFactorObject.yFactor){
				object.top = parseFloat(style.top) * zoomFactorObject.yFactor;
			}else if(styleProperty == "left" && zoomFactorObject.xFactor){
				object.left = parseFloat(style.left) * zoomFactorObject.xFactor;
			}else if(styleProperty == "width" && zoomFactorObject.xFactor){
				object.width = parseFloat(style.width) * zoomFactorObject.xFactor;
			}else if(styleProperty == "height" && zoomFactorObject.yFactor){
				object.height = parseFloat(style.height) * zoomFactorObject.yFactor;
			}else if(styleProperty == "transform"){
				var transformMatrix = transformMatrixDecode(style.transform);
				if(zoomFactorObject.xFactor){
					transformMatrix.tx = transformMatrix.tx * zoomFactorObject.xFactor;
				}
				if(zoomFactorObject.yFactor){
					transformMatrix.ty = transformMatrix.ty * zoomFactorObject.yFactor;
				}
				object.transform = transformMatrixToString(transformMatrix);
			}
		}
		
		//Apply page resize to this
		this.updateStyleByObject(object, true);
		// Pass page resize to children
		for(var i = 0; i < this.get("children").length; i++){
			var child = this.get("children")[i];
			if(child.resizeRelatively) child.resizeRelatively(zoomFactorObject);
		}
		var pages = backboneModelHelper.findModelsByType(ModelRegistry.page);
		var borderWidth = parseFloat(backboneModelHelper.getAllModelsOfAModelByType(pages[0].cid, ModelRegistry.cellContent)[0].get("style").top);
		object = {
			borderWidth : borderWidth,
		}
		//Apply border resize to this
		this.updateStyleByObject(object, true);
	},
	getView() {
		return $("div[data-id='" + this.cid +"']");
	},
	getToolbarButtons(isSmallScreen, eventType){
		if(eventType == MOUSE_EVENTS.DBLCLICK){

		}else{
			var cellContentChildren = backboneModelHelper.getAllModelsOfAModelByType(this.cid, ModelRegistry.cellContent);
			var button = new MenuButton("collageBackgroundColor", "<img class='toolbar-button-image' src='images/pallet_48.png'/>");
			button.addImageClass();
			var colorpicker = new ColorPicker(this.get("style").backgroundColor, "Background color");
			button.addMenuItem(colorpicker);

			colorpicker.addEventListener((function(e){
				var color = rgbaObjectToCSSRGBAColorString(e.color.toRGB());
				var object = {
					backgroundColor: color,
					borderColor: color,
				}
				this.updateStyleByObject(object, false);
			}).bind(this));


			var button1 = new MenuButton("spacing", "Spacing");
			var seekbar = new Seekbar(parseFloat(cellContentChildren[0].get("style").left), 100, "Border spacing" ,"%",400);
			button1.addMenuItem(seekbar);
			seekbar.addEventListener((function(e, ui){
				var value = ui.value;
				var object = {
					left: value,
					right: value,
					top: value,
					bottom: value,
				}
				var children = backboneModelHelper.getAllModelsOfAModelByType(this.cid, ModelRegistry.cellContent);
				for(var i = 0; i < children.length; i++){
					var child = children[i];
					if(child.updateStyleByObject) child.updateStyleByObject(object, false);
				}
				
				var page = backboneModelHelper.findParentPageOfModelByCID(this.cid);
				var pageStyle = page.get("style");
				object = {
					borderWidth : value,
					//top: value,
					//left: value,
					//width: parseFloat(pageStyle.width) - 2 * value,
					//height: parseFloat(pageStyle.height) - 2 * value,
				}
				this.updateStyleByObject(object);

			}).bind(this));
			var seekbar = new Seekbar(parseFloat(cellContentChildren[0].get("style").borderRadius), 100, "Border radius" ,"%",400);
			button1.addMenuItem(seekbar);
			seekbar.addEventListener((function(e, ui){
				var value = ui.value;
				var object = {
					borderRadius: value,
					borderTopLeftRadius: value,
					borderTopRightRadius: value,
					borderBottomRightRadius: value,
					borderBottomLeftRadius: value,
				}
				var children = backboneModelHelper.getAllModelsOfAModelByType(this.cid, ModelRegistry.cellContent);
				for(var i = 0; i < children.length; i++){
					var child = children[i];
					if(child.updateStyleByObject) child.updateStyleByObject(object, false);
				}
				var children = backboneModelHelper.getAllModelsOfAModelByType(this.cid, ModelRegistry.cellImage);
				for(var i = 0; i < children.length; i++){
					var child = children[i];
					if(child.updateStyleByObject) child.updateStyleByObject(object, false);
				}				
			}).bind(this));


			var button2 = new MenuButton("dimension", "Dimension");
			var textItem = new TextItem("Fit to editor");
			button2.addMenuItem(textItem);
			textItem.addEventListener((function(e){
				var model = backboneModelHelper.findParentModelOfTypeOfModelByCID(this.cid, ModelRegistry.page);
				var object = {};
				object.width = model.get("style").width;
				object.height = model.get("style").height;
				object.transform = "translate(0px,0px)"
				this.updateStyleByObject(object);
			}).bind(this));

			var button3 = new Button("delete", '<i class="material-icons">delete_forever</i>');
			button3.addIconClass();
			button3.addEventListener((function(e){
				var parentModel = backboneModelHelper.findParentOfModelByCID(this.cid);
				var children = parentModel.get("children");
				console.log(children.indexOf(this));
				var index = children.indexOf(this);
				if(index >= 0){
					
					var newChildren = [];
					for(var i = 0; i < children.length; i++){
						newChildren.push(children[i]);
					}
					newChildren.splice(index, 1);
					parentModel.set("children", newChildren);
				}
			}).bind(this));

			if(isSmallScreen){
				var buttonGroup = new GroupedButtonTab("buttonGroup", "Edit Frame");
				buttonGroup.addButton(button).addButton(button1).addButton(button2).addButton(button3);
				return [buttonGroup];
			}else{
				return [button, button1, button2, button3];
			}
		}
	},
	initialize() { 
		this.on("change", function(){
			if(debug.trace) console.log("Changed: FixedCollageContainer");
			var style = this.get("style");
			var newWidth = parseFloat(style.width);
			var newHeight = parseFloat(style.height);
			if(dataModel){
				var cellContentChildren = backboneModelHelper.getAllModelsOfAModelByType(this.cid, ModelRegistry.cellContent);
				var pageModel = backboneModelHelper.findParentPageOfModelByCID(this.cid);
				if(pageModel){
					if(debug.trace) console.log(pageModel.get("style"));
					newWidth = parseFloat(pageModel.get("style").width) ;// - parseFloat(cellContentChildren[0].get("style").top * 2)
					newHeight = parseFloat(pageModel.get("style").height) ;// - parseFloat(cellContentChildren[0].get("style").top * 2)
				}
				
			}
			if(this.hasChanged("style")){
				var prev = this.previousAttributes();
				
				var width = parseFloat(prev.style.width);
				var height = parseFloat(prev.style.height);
				
				var obj = {};
				obj.xFactor = 1;
				obj.yFactor = 1;
				obj.dx = 0;
				obj.dy = 0;
				if(width != newWidth){
					obj.xFactor = newWidth/width;
					obj.dx = newWidth - width;
				}
				if(height != newHeight){
					obj.yFactor = newHeight/height;
					obj.dy = newHeight - height;
				}
				obj.dx = 2 * (parseFloat(prev.style.borderWidth) - parseFloat(style.borderWidth));
				obj.dy = obj.dx;
				if(obj.dy != 0 || obj.dx != 0){
					if(backboneModelHelper){
						//var imageModels = backboneModelHelper.getAllLeafModelsWithImageOfAModelByModelAndCID(this, this.cid);
						if(this.get("children")){
							for(var i = 0; i < this.get("children").length; i++){
								var child = this.get("children")[i];
								child.expand(obj);
							}
						}
					}
				}
			}
		});
	},
});
var CollageContainerModel = Backbone.Model.extend({
	defaults : function(){
		return {
			id : 0,
			type : undefined,
			children : [],
			style : {
				left : 0,
				right :0 ,
				top: 0,
				bottom: 0,
				borderRadius :0,
			}
		}
	},
	updateStyle(key, value){
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		object[key] = value;
		this.set("style", object);
	},
	validate: function( attributes ){
		if( parseFloat(attributes.style.width) <= 10 || parseFloat(attributes.style.height) <= 10 ){
			return "Width and height cannot be zero.";
		}
	},
	updateStyleByObject(newStyles, isSilent) {
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		var newstyles = Object.getOwnPropertyNames(newStyles);
		for (var i = newstyles.length - 1; i >= 0; i--) {
			var newStylesKey = newstyles[i];
			var newStylesValue = newStyles[newStylesKey];
			object[newStylesKey] = newStylesValue;
		}
		this.set("style", object, {silent : isSilent, validate : true});
	},
	resizeRelatively(zoomFactorObject){
		var style = this.get("style") || {};
		var styleProperties = Object.getOwnPropertyNames(style);
		var object = {};
		for(var i = 0; i < styleProperties.length; i++){
			var styleProperty = styleProperties[i];
			if(styleProperty == "top" && zoomFactorObject.yFactor){
				object.top = parseFloat(style.top) * zoomFactorObject.yFactor;
			}else if(styleProperty == "left" && zoomFactorObject.xFactor){
				object.left = parseFloat(style.left) * zoomFactorObject.xFactor;
			}else if(styleProperty == "width" && zoomFactorObject.xFactor){
				object.width = parseFloat(style.width) * zoomFactorObject.xFactor;
			}else if(styleProperty == "height" && zoomFactorObject.yFactor){
				object.height = parseFloat(style.height) * zoomFactorObject.yFactor;
			}else if(styleProperty == "transform"){
				var transformMatrix = transformMatrixDecode(style.transform);
				if(zoomFactorObject.xFactor){
					transformMatrix.tx = transformMatrix.tx * zoomFactorObject.xFactor;
				}
				if(zoomFactorObject.yFactor){
					transformMatrix.ty = transformMatrix.ty * zoomFactorObject.yFactor;
				}
				object.transform = transformMatrixToString(transformMatrix);
			}
		}
		
		//Apply page resize to this
		this.updateStyleByObject(object, true);
		// Pass page resize to children
		for(var i = 0; i < this.get("children").length; i++){
			var child = this.get("children")[i];
			if(child.resizeRelatively) child.resizeRelatively(zoomFactorObject);
		}
	},
	getView() {
		return $("div[data-id='" + this.cid +"']");
	},
	getToolbarButtons(isSmallScreen, eventType){
		if(eventType == MOUSE_EVENTS.DBLCLICK){

		}else{
			var cellContentChildren = backboneModelHelper.getAllModelsOfAModelByType(this.cid, ModelRegistry.cellContent);
			var button = new MenuButton("collageBackgroundColor", "Background");
			var colorpicker = new ColorPicker(this.get("style").backgroundColor, "Background color");
			button.addMenuItem(colorpicker);

			colorpicker.addEventListener((function(e){
				var color = rgbaObjectToCSSRGBAColorString(e.color.toRGB());
				var object = {
					backgroundColor: color
				}
				this.updateStyleByObject(object, false);
			}).bind(this));


			var button1 = new MenuButton("spacing", "Spacing");
			var seekbar = new Seekbar(parseFloat(cellContentChildren[0].get("style").left), 100, "Border spacing" ,"%",400);
			button1.addMenuItem(seekbar);
			seekbar.addEventListener((function(e, ui){
				var value = ui.value;
				var object = {
					left: value,
					right: value,
					top: value,
					bottom: value,
				}
				var children = backboneModelHelper.getAllModelsOfAModelByType(this.cid, ModelRegistry.cellContent);
				for(var i = 0; i < children.length; i++){
					var child = children[i];
					if(child.updateStyleByObject) child.updateStyleByObject(object, false);
				}
				
			}).bind(this));
			var seekbar = new Seekbar(parseFloat(cellContentChildren[0].get("style").borderRadius), 100, "Border radius" ,"%",400);
			button1.addMenuItem(seekbar);
			seekbar.addEventListener((function(e, ui){
				var value = ui.value;
				var object = {
					borderRadius: value,
				}
				var children = backboneModelHelper.getAllModelsOfAModelByType(this.cid, ModelRegistry.cellContent);
				for(var i = 0; i < children.length; i++){
					var child = children[i];
					if(child.updateStyleByObject) child.updateStyleByObject(object, false);
				}
				
			}).bind(this));


			var button2 = new MenuButton("dimension", "Dimension");
			var textItem = new TextItem("Fit to editor");
			button2.addMenuItem(textItem);
			textItem.addEventListener((function(e){
				var model = backboneModelHelper.findParentModelOfTypeOfModelByCID(this.cid, ModelRegistry.page);
				var object = {};
				object.width = model.get("style").width;
				object.height = model.get("style").height;
				object.transform = "translate(0px,0px)"
				this.updateStyleByObject(object);
			}).bind(this));

			var button3 = new Button("delete", "Delete");
			button3.addEventListener((function(e){
				var parentModel = backboneModelHelper.findParentOfModelByCID(this.cid);
				var children = parentModel.get("children");
				console.log(children.indexOf(this));
				var index = children.indexOf(this);
				if(index >= 0){
					
					var newChildren = [];
					for(var i = 0; i < children.length; i++){
						newChildren.push(children[i]);
					}
					newChildren.splice(index, 1);
					parentModel.set("children", newChildren);
				}
			}).bind(this));

			if(isSmallScreen){
				var buttonGroup = new GroupedButtonTab("buttonGroup", "Edit Container");
				buttonGroup.addButton(button).addButton(button2).addButton(button3);
				return [buttonGroup];
			}else{
				return [button, button2, button3];
			}
		}
	},
	initialize() { 
		this.on("change", function(){
			console.log("Changed: CollageContainer");
				if(this.hasChanged("style")){
				var prev = this.previousAttributes();
				var style = this.get("style");
				var width = parseFloat(prev.style.width);
				var newWidth = parseFloat(style.width);
				var height = parseFloat(prev.style.height);
				var newHeight = parseFloat(style.height);
				var obj = {};
				obj.xFactor = 1;
				obj.yFactor = 1;
				obj.dx = 0;
				obj.dy = 0;
				if(width != newWidth){
					obj.xFactor = newWidth/width;
					obj.dx = newWidth - width;
				}
				if(height != newHeight){
					obj.yFactor = newHeight/height;
					obj.dy = newHeight - height;
				}
				if(obj.xFactor != 1 || obj.yFactor != 1){
					if(backboneModelHelper){
						var imageModels = backboneModelHelper.getAllLeafModelsWithImageOfAModelByCID(this.cid);
						for(var i = 0; i < imageModels.length; i++){
							var imageModel = imageModels[i];
							imageModel.expand(obj);
						}
					}
				}
			}
		});
	},
});
var RowModel = Backbone.Model.extend({
	defaults : function(){
		return {
			id : 0,
			type : undefined,
			children : []
		}
	},
	updateStyle(key, value){
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		object[key] = value;
		this.set("style", object);
	},
	updateStyleByObject(newStyles, isSilent) {
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		var newstyles = Object.getOwnPropertyNames(newStyles);
		for (var i = newstyles.length - 1; i >= 0; i--) {
			var newStylesKey = newstyles[i];
			var newStylesValue = newStyles[newStylesKey];
			object[newStylesKey] = newStylesValue;
		}
		this.set("style", object, {silent : isSilent, validate : true});
	},
	resizeRelatively(zoomFactorObject){
		
		// Pass page resize to children
		for(var i = 0; i < this.get("children").length; i++){
			var child = this.get("children")[i];
			if(child.resizeRelatively) child.resizeRelatively(zoomFactorObject);
		}
	},
	getView() {
		return $("div[data-id='" + this.cid +"']");
	},
	expand(obj){
		if(this.get("children")){
			for(var i = 0; i < this.get("children").length; i++){
				var child = this.get("children")[i];
				child.expand(obj);
			}
		}
	},
	initialize() { 
		this.on("change", function(){
			//console.log("Changed: RowModel");
		});
	},
});
var ColumnModel = Backbone.Model.extend({
	defaults : function(){
		return {
			id : 0,
			type : undefined,
			children : []
		}
	},
	updateStyle(key, value){
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		object[key] = value;
		this.set("style", object);
	},
	updateStyleByObject(newStyles, isSilent) {
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		var newstyles = Object.getOwnPropertyNames(newStyles);
		for (var i = newstyles.length - 1; i >= 0; i--) {
			var newStylesKey = newstyles[i];
			var newStylesValue = newStyles[newStylesKey];
			object[newStylesKey] = newStylesValue;
		}
		this.set("style", object, {silent : isSilent, validate : true});
	},
	resizeRelatively(zoomFactorObject){
		
		// Pass page resize to children
		for(var i = 0; i < this.get("children").length; i++){
			var child = this.get("children")[i];
			if(child.resizeRelatively) child.resizeRelatively(zoomFactorObject);
		}
	},
	getView() {
		return $("div[data-id='" + this.cid +"']");
	},
	expand(obj){
		if(this.get("children")){
			for(var i = 0; i < this.get("children").length; i++){
				var child = this.get("children")[i];
				child.expand(obj);
			}
		}
	},
	initialize() { 
		this.on("change", function(){
			//console.log("Changed: ColumnModel");
		});
	},
});
var CellModel = Backbone.Model.extend({
	defaults : function(){
		return {
			id : 0,
			type : undefined,
			children : []
		}
	},
	updateStyle(key, value){
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		object[key] = value;
		this.set("style", object);
	},
	updateStyleByObject(newStyles, isSilent) {
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		var newstyles = Object.getOwnPropertyNames(newStyles);
		for (var i = newstyles.length - 1; i >= 0; i--) {
			var newStylesKey = newstyles[i];
			var newStylesValue = newStyles[newStylesKey];
			object[newStylesKey] = newStylesValue;
		}
		this.set("style", object, {silent : isSilent, validate : true});
	},
	resizeRelatively(zoomFactorObject){
		
		// Pass page resize to children
		for(var i = 0; i < this.get("children").length; i++){
			var child = this.get("children")[i];
			if(child.resizeRelatively) child.resizeRelatively(zoomFactorObject);
		}
	},
	updateStyle(key, value){
		//
		console.log("No configurable style on CellModel");
		return;
	},
	getView() {
		return $("div[data-id='" + this.cid +"']");
	},
	expand(obj){
		if(this.get("children")){
			for(var i = 0; i < this.get("children").length; i++){
				var child = this.get("children")[i];
				child.expand(obj);
			}
		}
	},
	initialize() { 
		this.on("change", function(){
			//console.log("Changed: CellModel");
		});
	},
});
var CellContentModel = Backbone.Model.extend({
	defaults : function(){
		return {
			id : 0,
			type : undefined,
			children : [],
			style : {
				left: 4,
			    right: 4,
			    top: 4,
			    bottom: 4,
			    borderRadius: "0",
			}
		}
	},
	updateStyle(key, value){
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		object[key] = value;
		this.set("style", object);
	},
	updateStyleByObject(newStyles, isSilent) {
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		var newstyles = Object.getOwnPropertyNames(newStyles);
		for (var i = newstyles.length - 1; i >= 0; i--) {
			var newStylesKey = newstyles[i];
			var newStylesValue = newStyles[newStylesKey];
			object[newStylesKey] = newStylesValue;
		}
		this.set("style", object, {silent : isSilent, validate : true});
	},
	resizeRelatively(zoomFactorObject){
		var style = this.get("style");
		var object = {};
		object.left = Math.ceil(style.left * zoomFactorObject.xFactor);
		object.right = Math.ceil(style.right * zoomFactorObject.xFactor);
		object.top = Math.ceil(style.top * zoomFactorObject.xFactor);
		object.bottom = Math.ceil(style.bottom * zoomFactorObject.xFactor);
		object.borderRadius = Math.ceil(style.borderRadius * zoomFactorObject.xFactor);
		this.updateStyleByObject(object);

		// Pass page resize to children
		for(var i = 0; i < this.get("children").length; i++){
			var child = this.get("children")[i];
			if(child.resizeRelatively) child.resizeRelatively(zoomFactorObject);
		}
	},
	getImageDetails(){
		var imageModel = backboneModelHelper.getAllLeafModelsWithImageOfAModelByCID(this.cid)[0];
		
		var imageElement = $("img[data-id=" + imageModel.cid + "]")[0];
		var parentElement = $("div[data-id=" + this.cid + "]")[0];
		var data = {
			isWidthBounded : false,
			currentZoom : 1,
			width: imageElement.getClientRects()[0].width,
			height: imageElement.getClientRects()[0].height,
			topleft : {
				tx : 0,
				ty : 0
			}
		};
		/*
			isWidthBounded : If you were to fill parent with this image. then image's
				width need zoom until it reaches parent width. Width hit the parent boundaries last
			
		*/
		var imageStyle = imageModel.get("style");
		var transformedMatrix = transformMatrixDecode(imageStyle.transform);
		var rot = Math.round(Math.sin(transformedMatrix.rotate * Math.PI / 180));
		if(rot == 0){
			if(imageElement.naturalWidth / imageElement.naturalHeight < parentElement.getBoundingClientRect().width / parentElement.getBoundingClientRect().height){
				data.isWidthBounded = true;
			}
			if(data.isWidthBounded){
				data.currentZoom = parseFloat($(imageElement).width()) / parentElement.getBoundingClientRect().width;
			}else{
				data.currentZoom = parseFloat($(imageElement).height()) / parentElement.getBoundingClientRect().height;
			}
			data.topleft.tx = (parseFloat($(imageElement).width()) - parseFloat($(imageElement).height()))/ 2;
			data.topleft.ty = (parseFloat($(imageElement).height()) - parseFloat($(imageElement).width()))/ 2;

		}else {
			if(imageElement.naturalHeight / imageElement.naturalWidth < parentElement.getBoundingClientRect().width / parentElement.getBoundingClientRect().height){
				data.isWidthBounded = true;
			}
			if(data.isWidthBounded){
				data.currentZoom = parseFloat(imageElement.getBoundingClientRect().width) / parentElement.getBoundingClientRect().width;
			}else{
				data.currentZoom = parseFloat(imageElement.getBoundingClientRect().height) / parentElement.getBoundingClientRect().height;
			}
			// tx and ty at 0,0
		}
		
		return data;
	},
	getView() {
		return $("div[data-id='" + this.cid +"']");
	},
	getToolbarButtons(isSmallScreen, eventType, callbackOne, callbackTwo){
		if(eventType == MOUSE_EVENTS.DBLCLICK){
			var button = new Button("save", "Save");
			button.addEventListener(function(){
				var transform = $('.cropBox').find("img")[0].style.transform;
				backboneModelHelper.findChildImageOfModelByCID(this.cid).updateStyleByObject({transform : transform});
				console.log("saved");
				callbackOne();
			}.bind(this));
			var button2 = new Button("cancel", "Cancel");
			button2.addEventListener(function(){
				console.log("cancel");
				callbackTwo();
			}.bind(this));
			/*if(isSmallScreen){
				var buttonGroup = new GroupedButtonTab("buttonGroup", "Edit Circle");
				buttonGroup.addButton(button).addButton(button2);
				return [buttonGroup];
			}else{
				return [button, button2];
			}*/
			return [button, button2];
		}else{
			var button = new MenuButton("color", "<img class='toolbar-button-image' src='images/pallet_48.png'/>");
			button.addImageClass();
			var colorpicker = new ColorPicker(this.get("style").backgroundColor, "Cell background color");
			button.addMenuItem(colorpicker);

			colorpicker.addEventListener((function(e){
				var color = rgbaObjectToCSSRGBAColorString(e.color.toRGB());
				var object = {
					backgroundColor: color
				}
				this.updateStyleByObject(object, false);
			}).bind(this));

			var button1 = new MenuButton("zoom", "Zoom image");
			
			var currentZoom = 0; // This is dynamic, in sense that it change with dimention of parent image container
			
			
			var seekbar = new Seekbar(parseFloat(this.getImageDetails().currentZoom * 100 - 100), 400, "Zoom in/out image" ,"%",400);
			button1.addMenuItem(seekbar);
			seekbar.addEventListener((function(e, ui){
				
				var ratio = (ui.value / 100 + 1) / this.getImageDetails().currentZoom;
				// When zoom hits 0, image should best fit to parent container. Either left and right or top and bottom 
				// should touch the respective sides of the parent container
				var imageModel = backboneModelHelper.getAllLeafModelsWithImageOfAModelByCID(this.cid)[0];
				var prevZoom = parseFloat(imageModel.get("zoom"));
				var imageStyle = imageModel.get("style");
				var transformedMatrix = transformMatrixDecode(imageStyle.transform);

				transformedMatrix.tx = parseFloat(transformedMatrix.tx) * ratio;
				transformedMatrix.ty = parseFloat(transformedMatrix.tx) * ratio;
				var transform = transformMatrixToString(transformedMatrix);
				object = {};
				object.transform = transform;
				object.width = parseFloat(imageStyle.width) * ratio;
				object.height = parseFloat(imageStyle.height) * ratio;
				
				imageModel.updateStyleByObject(object);

				//Fake expand to fix image position
				var obj = {};
				obj.xFactor = 1;
				obj.yFactor = 1;
				obj.dx = 0;
				obj.dy = 0;
				this.expand(obj);
			}).bind(this));

			var button2 = new MenuButton("filter", "Filter");
			var filterPane = new EmptyMenuItem();
			button2.addMenuItem(filterPane);
			button2.addEventListener(function(filterParentContainer, e){
				var filterContainer = filterParentContainer.getHTMLNode();
				var imageModel = backboneModelHelper.getAllLeafModelsWithImageOfAModelByCID(this.cid)[0];
				var url = imageModel.get("url");
				var filters = ["nofilter", "xpro2", "willow", "walden", "valencia", "toaster", "sutro", "sierra", "rise", "nashville", "mayfair", "lofi", "kelvin", "inkwell", "hudson", "earlybird", "brannan", "amaro", "1977"];
				for(var i = 0; i < filters.length; i++){
					var className = "ig-" + filters[i];
					var image = $("<img />").attr("src", url).addClass("filter").addClass("ig-filter").addClass(className);
					image.click(function(className, e){
						imageModel.updateStyleByObject({
							"WebkitFilter" : $("img." + className).css("filter"),
							"Filter" : $("img." + className).css("filter"),
						});
					}.bind(this, className));
					filterContainer.append(image);
				}
				var filterRect = filterContainer.closest(".toolbar-item").get(0).getBoundingClientRect(); 
				var parentRect = $(".document").get(0).getBoundingClientRect();
				var left = parentRect.left - filterRect.left;
				var width = parentRect.width;
				filterContainer.parent().parent().css("left", left).css("width", width).css("overflow", "auto");
				
			}.bind(this, filterPane));
			var button3 = new Button("rotate", "Rotate image");
			button3.addEventListener(function(){
				var imageModel = backboneModelHelper.getAllLeafModelsWithImageOfAModelByCID(this.cid)[0];
				var imageStyle = imageModel.get("style");
				var imageRect = $('img[data-id=' + imageModel.cid + ']')[0].getBoundingClientRect();
				var parentRect = this.getView()[0].getBoundingClientRect();
				var transformedMatrix = transformMatrixDecode(imageStyle.transform);
				
				if(!Number.isFinite(transformedMatrix.rotate)){
					transformedMatrix.rotate = 90;
				}else{
					transformedMatrix.rotate += 90;
				}

				//START
				object = {};
				// Fix tx and ty
				if(Math.round(Math.sin(transformedMatrix.rotate * Math.PI / 180)) == 1){
					transformedMatrix.tx = (parseFloat(imageStyle.height) - parseFloat(imageStyle.width))/ 2;
					transformedMatrix.ty = (parseFloat(imageStyle.width) - parseFloat(imageStyle.height))/ 2;
					// Fix width and height
					
					if(imageRect.width / parentRect.height > imageRect.height / parentRect.width){
						// width in control of fill of parent with image
						// implies that if width aleady statisfies parent width, then height exceed parent height
						// NOTE: image is 0 or 180 rotated 
						if(parseFloat(imageStyle.height) < parentRect.width){
							object.height = parentRect.width;
							object.width = parseFloat(imageStyle.width) * parseFloat(parentRect.width) / parseFloat(imageStyle.height);
						}
					}else{ 
						if(parseFloat(imageStyle.width) < parentRect.height){
							object.width = parentRect.width;
							object.height = parseFloat(imageStyle.height) * parseFloat(parentRect.height) /parseFloat(imageStyle.width);
						}
					}
				}else{
					transformedMatrix.tx = 0;
					transformedMatrix.ty = 0;
					// Fix width and height
					if(imageRect.height / parentRect.height > imageRect.width / parentRect.width){
						// width in control of fill of parent with image
						// implies that if width aleady statisfies parent width, then height exceed parent height
						// NOTE: image is 0 or 180 rotated
						if(parseFloat(imageStyle.width) < parentRect.width){
							object.width = parentRect.width;
							object.height = parseFloat(imageStyle.height) * parseFloat(imageStyle.width) / parentRect.width;
						}
					}else{
						if(parseFloat(imageStyle.height) < parentRect.height){
							object.height = parentRect.height;
							object.width = parseFloat(imageStyle.width) * parseFloat(imageStyle.height) / parentRect.height;
						}
					}
				}
				

				// Second run on x and y position
				if(object.width && object.height){
					if(Math.abs(Math.round(Math.sin(transformedMatrix.rotate * Math.PI / 180))) == 1){
						transformedMatrix.tx = (parseFloat(object.height) - parseFloat(object.width))/ 2;
						transformedMatrix.ty = (parseFloat(imageStyle.width) - parseFloat(object.height))/ 2;
					}else{
						transformedMatrix.tx = 0;
						transformedMatrix.ty = 0;
					}
				}
				
				//END

				var transform = transformMatrixToString(transformedMatrix);
				
				object.transform = transform;

				imageModel.updateStyleByObject(object);

			}.bind(this));

			var imageModel = backboneModelHelper.getAllLeafModelsWithImageOfAModelByCID(this.cid)[0];
			if(isSmallScreen){
				var buttonGroup = null;
				if(imageModel.get("url")){
					buttonGroup = new GroupedButtonTab("buttonGroup", "Edit Image");
					buttonGroup.addButton(button).addButton(button1).addButton(button2).addButton(button3); 
				}else{
					buttonGroup = new GroupedButtonTab("buttonGroup", "Edit Cell");
					buttonGroup.addButton(button); 
				}
				// .addButton(button2)
				return [buttonGroup];
			}else{
				if(imageModel.get("url")){
					return [button,button1, button2,button3]; // , button2
				}else{
					return [button]; // , button2
				}
			}
		}
	},
	expand(obj){
		if(this.get("children")){
			for(var i = 0; i < this.get("children").length; i++){
				var child = this.get("children")[i];
				child.expand(obj);
			}
		}
	},
	initialize() { 
		this.on("change", function(){
			if(debug.trace) console.log("Changed: CellContentModel");
			if(this.hasChanged("style")){
				var prevBorderSize = parseFloat(this.previousAttributes().style.left);
				var nextBorderSize = parseFloat(this.changed.style.left);

				if(prevBorderSize < nextBorderSize){
					// image may be under flowing since available space increase as border thinnens 

				}
			}
		});
	},
});
var CellImageModel = Backbone.Model.extend({
	defaults : function(){
		return {
			id : 0,
			type : undefined,
			children : []
		}
	},
	validate: function( attributes ){
		if(Number.isNaN(attributes.style.height) || Number.isNaN(attributes.style.width) || parseFloat(attributes.style.width) <= 10 || parseFloat(attributes.style.height) <= 10 ){
			return "Width and height cannot be zero.";
		}
	},
	updateStyle(key, value){
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		object[key] = value;
		this.set("style", object);
	},
	updateStyleByObject(newStyles, isSilent) {
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		var newstyles = Object.getOwnPropertyNames(newStyles);
		for (var i = newstyles.length - 1; i >= 0; i--) {
			var newStylesKey = newstyles[i];
			var newStylesValue = newStyles[newStylesKey];
			object[newStylesKey] = newStylesValue;
		}
		this.set("style", object, {silent : isSilent, validate : true});
	},
	/**
	 * Takes cares of the image position when page resize. This is a important function as it
	 * provide consistance way to resize the container proportionally. This function provides a consistant 
	 * way in terms that it guarantees view of image before and after stay the same by zooming in/out image. 
	 * This function proportiabally resize the image thus when we print the Page by changing width and height by
	 * a single constant, image view stays the same. 
	 * @param {*} zoomFactorObject zoomFactorObject.xFactor and zoomFactorObject.yFactor can be different
	 * 				I.e. 500x400px Page can be scalled up by factor of 2. Which cause xFactor to be 2 and 
	 * 				yFactor to be 2
	 */
	resizeRelatively(zoomFactorObject){
		var style = this.get("style") || {};
		var styleProperties = Object.getOwnPropertyNames(style);
		var object = {};

		// This is simply expanding
		var imageParentRect = $("img[data-id=" + this.cid + "]").parent()[0].getBoundingClientRect();
		var transform = transformMatrixDecode(style.transform);
		if(zoomFactorObject.xFactor > zoomFactorObject.yFactor){
			// Width in control. set height relative to width
			object.width = parseFloat(style.width) * zoomFactorObject.xFactor;
			object.height = parseFloat(style.height) * zoomFactorObject.xFactor;

			transform.tx *=  zoomFactorObject.xFactor;
			transform.ty *=  zoomFactorObject.xFactor;
		}else{
			object.width = parseFloat(style.width) * zoomFactorObject.yFactor;
			object.height = parseFloat(style.height) * zoomFactorObject.yFactor;

			transform.tx *=  zoomFactorObject.yFactor;
			transform.ty *=  zoomFactorObject.yFactor;
		}
		object.transform = transformMatrixToString(transform);
		//Apply page resize to this
		this.updateStyleByObject(object, true);
		// Pass page resize to children
		for(var i = 0; i < this.get("children").length; i++){
			var child = this.get("children")[i];
			if(child.resizeRelatively) child.resizeRelatively(zoomFactorObject);
		}
		return;
		/* OLD */

		for(var i = 0; i < styleProperties.length; i++){
			var styleProperty = styleProperties[i];
			if(styleProperty == "top" && zoomFactorObject.yFactor){
				object.top = parseFloat(style.top) * zoomFactorObject.yFactor;
			}else if(styleProperty == "left" && zoomFactorObject.xFactor){
				object.left = parseFloat(style.left) * zoomFactorObject.xFactor;
			}else if(styleProperty == "width" && zoomFactorObject.xFactor){
				object.width = parseFloat(style.width) * zoomFactorObject.xFactor;
			}else if(styleProperty == "height" && zoomFactorObject.yFactor){
				object.height = parseFloat(style.height) * zoomFactorObject.yFactor;
			}else if(styleProperty == "transform"){
				var transformMatrix = transformMatrixDecode(style.transform);
				if(zoomFactorObject.xFactor){
					transformMatrix.tx = transformMatrix.tx * zoomFactorObject.xFactor;
				}
				if(zoomFactorObject.yFactor){
					transformMatrix.ty = transformMatrix.ty * zoomFactorObject.yFactor;
				}
				object.transform = transformMatrixToString(transformMatrix);
			}
		}
		
	},
	/**
	 * Call when image container dimension change independent of Page, i.e. user increase/decrease border size.
	 * Therefore placement of image after parent resize does not need to gurentee the image dimention 
	 * or position stay intact.
	 * 
	 * @param {*} expandFators 
	 */
	expand(expandFators) {
		var chain = this.getParentChain();
		var element = this.getParentElement();
		var image = $("img[data-id=" + this.cid + "]")[0];
		var imageRect = $("img[data-id=" + this.cid + "]")[0].getBoundingClientRect();
		var imageParentRect = $("img[data-id=" + this.cid + "]").parent()[0].getBoundingClientRect();
		// Parents bounds
		var parentElementWidth = this.getParent().getView().width();
		var parentElementHeight = this.getParent().getView().height();

		var toggle = false;
		var percentageX = 1;
		var percentageY = 1;

		for(var i = 0; i < chain.length; i++){
			var el = chain[i];
			if(el == element || toggle){
				toggle = true;
				if(el.get("style")){
					if(el.get("style").width && typeof el.get("style").width == "string" &&
						el.get("style").width.indexOf("%") >= 0){
						var floatWidth = parseFloat(el.get("style").width)/100;
						percentageX *= floatWidth;
					}
					if(el.get("style").height && typeof el.get("style").height == "string" &&
						el.get("style").height.indexOf("%") >= 0){
						var floatHeight = parseFloat(el.get("style").height)/100;
						percentageY *= floatHeight;
					}
				} 
			}
		}
		
		var deltaPixelX = expandFators.xFactor;
		var deltaPixelY = expandFators.yFactor;
		//console.log(percentageX + ":" + percentageY);

		var delta = deltaPixelX == 1 ? deltaPixelY : deltaPixelX;
		var object = {};

		var style = this.get("style") || {};
		style.width = parseFloat(style.width);
		style.height = parseFloat(style.height);

		var styleTransformMatrix = transformMatrixDecode(style.transform);
		if(delta > 2){
			console.log("large");
		}
		//Validate
		console.log("Request to fix.");
		var fix = false;

		/*
			Cases:
			1. Image width underflow or image x position > parent x position
				a. Can shift image to the right and try to fix it.
				b. Can expand image 
			2. Image height underflow or image y position > parent y position
				a. Can push image to down and try to fix it.
				b. Can expand image 
		*/
		/**/
		if(Math.round(Math.sin(styleTransformMatrix.rotate * Math.PI / 180)) == 0){
			var changed = 0;
			if(styleTransformMatrix.tx > 0){
				// Only option is to set it to 0
				styleTransformMatrix.tx = 0;
				changed = 1;
				console.log("\tfix: left");
			}
			if((style.width + styleTransformMatrix.tx) < (imageParentRect.width + expandFators.dx)){
				var gapOnRightside = (imageParentRect.width + expandFators.dx) - (style.width + styleTransformMatrix.tx);
				if(gapOnRightside + styleTransformMatrix.tx <= 0){
					// We can just shift image to right to fix this issue
					styleTransformMatrix.tx += gapOnRightside; 
					changed = 2;
					console.log("\tfix: left 1");
				}else{
					var excessGap = gapOnRightside + styleTransformMatrix.tx;
					styleTransformMatrix.tx = 0;
					object.width = imageParentRect.width + expandFators.dx;
					object.height = style.height + excessGap * image.naturalHeight/image.naturalWidth;
					changed = 3;
					console.log("\tfix: left and width");
				}
				
			}
			// Height stuff
			if(styleTransformMatrix.ty > 0){
				// Only option is to set it to 0
				styleTransformMatrix.ty = 0;
				changed = 4;
				console.log("\tfix: top");
			}
			if((style.height + styleTransformMatrix.ty) < (imageParentRect.height + expandFators.dx)){
				var gapOnRightside = (imageParentRect.height + expandFators.dx) - (style.height + styleTransformMatrix.ty);
				if(gapOnRightside + styleTransformMatrix.ty <= 0){
					// We can just shift image to right to fix this issue
					styleTransformMatrix.ty += gapOnRightside; 
					changed = 5;
					console.log("\tfix: top 1");
				}else{
					var excessGap = gapOnRightside + styleTransformMatrix.ty;
					styleTransformMatrix.ty = 0;
					var tempHeight = object.height;
					object.height = style.height + excessGap;
					console.log("\tfix: height 2");
					if(tempHeight > object.height){
						object.height = tempHeight;
						console.log("\tfix: height 2 reversed");
					}else{
						object.width = style.width + excessGap * image.naturalWidth/image.naturalHeight;
						console.log("\tfix: height 2 commited top");
					}
					
					changed = 6;
				}
				
			}
		}else{
			/*
				Create pr, parentRect, object and ir,imageRect, object. Commit new values to object itself
				- Fit image to width if smaller
				1.	if pr.left < ir.left, then move ir to the left. commit ir.left
				2.	if pr.right > ir.right
						if pr.left > ir.left && pr.left - ir.left > pr.right - ir.right

			*/
			var changed = 0;
			var _maxTx = ((style.height - style.width) / 2 - expandFators.dx/2); //this is the tx = 0 position if this was 0* rotated
			var maxTx = (expandFators.dx < 0) ? Math.ceil(_maxTx):Math.floor(_maxTx);
			if(styleTransformMatrix.tx > maxTx){
				// Only option is to set it to 0
				styleTransformMatrix.tx = maxTx;
				changed = 1;
				console.log("\tfix: left");
			}
			object.height = style.height;
			object.width = style.width;
			var newParentWidth = imageParentRect.width + expandFators.dx;
			var gapBetweenTxToTopLeftConer = maxTx - styleTransformMatrix.tx;
			if((style.height - gapBetweenTxToTopLeftConer) < newParentWidth){
				var gapOnRightside = newParentWidth - (style.height + styleTransformMatrix.tx);
				// if tx lays before origin top left and subtracting rightside gap doesnt put it after origin top left
				if(styleTransformMatrix.tx < maxTx && gapOnRightside + styleTransformMatrix.tx <= maxTx){
					// We can just shift image to right to fix this issue
					styleTransformMatrix.tx += gapOnRightside; 
					changed = 2;
					console.log("\tfix: left 1");
				}else{
					var excessGap = gapOnRightside + maxTx;
					styleTransformMatrix.tx = maxTx;
					object.height = imageParentRect.width + expandFators.dx;
					object.width = object.height * image.naturalWidth/image.naturalHeight;
					changed = 3;
					console.log("\tfix: left and width");
				}
			}

			// Height stuff
			var _maxTy = (( imageRect.height - imageRect.width ) / 2 ); //this is the tx = 0 position if this was 0* rotated
			var maxTy = (expandFators.dy < 0) ? Math.ceil(_maxTy) + expandFators.dy:Math.floor(_maxTy) - expandFators.dy;
			if(styleTransformMatrix.ty > maxTy){
				// Only option is to set it to 0
				styleTransformMatrix.ty = maxTy;
				changed = 1;
				console.log("\tfix: top");
			}
			var newParentHeight = imageParentRect.height + expandFators.dy;
			var gapBetweenTyToTopLeftConer = maxTy - styleTransformMatrix.ty;
			if((object.width - gapBetweenTyToTopLeftConer) < newParentHeight){
				var gapOnBottomside = newParentHeight - (object.width - gapBetweenTyToTopLeftConer);
				// if tx lays before origin top left and subtracting rightside gap doesnt put it after origin top left
				if(styleTransformMatrix.ty < maxTy && gapOnBottomside + styleTransformMatrix.ty <= maxTy){
					// We can just shift image to right to fix this issue
					styleTransformMatrix.ty += gapOnBottomside; 
					changed = 2;
					console.log("\tfix: top 1");
				}else{
					var excessGap = gapOnBottomside + maxTy;
					styleTransformMatrix.ty = maxTy;
					object.width = imageParentRect.height + expandFators.dy;
					object.height = object.width * image.naturalHeight/image.naturalWidth;
					changed = 3;
					console.log("\tfix: top and height");
				}
			}
			
/*

			if((style.width + styleTransformMatrix.tx) < (imageParentRect.width + expandFators.dx)){
				var gapOnRightside = (imageParentRect.width + expandFators.dx) - (style.width + styleTransformMatrix.tx);
				if(gapOnRightside + styleTransformMatrix.tx <= 0){
					// We can just shift image to right to fix this issue
					styleTransformMatrix.tx += gapOnRightside; 
					changed = 2;
					console.log("\tfix: left 1");
				}else{
					var excessGap = gapOnRightside + styleTransformMatrix.tx;
					styleTransformMatrix.tx = 0;
					object.width = imageParentRect.width + expandFators.dx;
					object.height = style.height + excessGap * image.naturalHeight/image.naturalWidth;
					changed = 3;
					console.log("\tfix: left and width");
				}
				
			}
			// Height stuff
			if(styleTransformMatrix.ty > 0){
				// Only option is to set it to 0
				styleTransformMatrix.ty = 0;
				changed = 4;
				console.log("\tfix: top");
			}
			if((style.height + styleTransformMatrix.ty) < (imageParentRect.height + expandFators.dx)){
				var gapOnRightside = (imageParentRect.height + expandFators.dx) - (style.height + styleTransformMatrix.ty);
				if(gapOnRightside + styleTransformMatrix.ty <= 0){
					// We can just shift image to right to fix this issue
					styleTransformMatrix.ty += gapOnRightside; 
					changed = 5;
					console.log("\tfix: top 1");
				}else{
					var excessGap = gapOnRightside + styleTransformMatrix.ty;
					styleTransformMatrix.ty = 0;
					var tempHeight = object.height;
					object.height = style.height + excessGap;
					console.log("\tfix: height 2");
					if(tempHeight > object.height){
						object.height = tempHeight;
						console.log("\tfix: height 2 reversed");
					}else{
						object.width = style.width + excessGap * image.naturalWidth/image.naturalHeight;
						console.log("\tfix: height 2 commited top");
					}
					
					changed = 6;
				}
				
			}
			*/
		}
		
		
		object.transform = transformMatrixToString(styleTransformMatrix);
		
		console.log(Object.assign({
			"Parent width" : (imageParentRect.width),
			"delta" : delta,
		}, expandFators, {
			diff: expandFators.dx 
		}));
		

		/*
		if(styleTransformMatrix.tx > 0 || style.width + styleTransformMatrix.tx < imageParent[0].getBoundingClientRect().width){
			// This can not happen. We need to resize the image, or move it to right
			if(styleTransformMatrix.tx < 0 &&
			 (imageParent[0].getBoundingClientRect().width - (style.width + styleTransformMatrix.tx)) >= 0){
				// tx is negative, thus we can shift it and try to fit the image fully on the frame
				styleTransformMatrix.tx += 2 * (imageParent[0].getBoundingClientRect().width - (style.width + styleTransformMatrix.tx));
				object.transform = transformMatrixToString(styleTransformMatrix);
				console.log("\tfix: 1");
				fix = true;
				window.start = true;
			}else if(styleTransformMatrix.tx >= 0){
				// Now we need to zoom in the image
				var requiredDeltaWidth = imageParent[0].getBoundingClientRect().width - (style.width + styleTransformMatrix.tx);
				//Width to height ratio
				var ratio = style.height / style.width;
				object.width = style.width + requiredDeltaWidth;
				object.height = style.width + requiredDeltaWidth * ratio;
				styleTransformMatrix.tx = 0;
				object.transform = transformMatrixToString(styleTransformMatrix);
				console.log("\tfix: 2");
				fix = true;
				window.start = true;
			}else{
				console.error("Something had gone wrong previously. Width underflow detected");
			}
			
		}
		if(!fix && window.start){
			console.log("Did not fix the error.");
		}
		
		if(style.height + styleTransformMatrix.ty < parentElementHeight){
			// This can not happen
			console.error("Something had gone wrong previously. Height underflow detected");
		}else if(delta * (style.width + styleTransformMatrix.tx) > parentElementWidth && 
				delta * (style.height + styleTransformMatrix.ty) > parentElementHeight){
			// is it possible to show the image without expanding

			if(expandFators.dx){
				object.width = style.width * delta;
				styleTransformMatrix.tx *= delta;
				object.height = delta * style.width * (this.get("image").naturalHeight / this.get("image").naturalWidth);
				styleTransformMatrix.ty *= delta * (this.get("image").naturalHeight / this.get("image").naturalWidth);
				object.transform = transformMatrixToString(styleTransformMatrix);
			}else{
				object.width = delta * style.height * (this.get("image").naturalWidth / this.get("image").naturalHeight);
				styleTransformMatrix.tx *= delta * (this.get("image").naturalWidth / this.get("image").naturalHeight);
				object.height = style.height * delta;
				styleTransformMatrix.ty *= delta;
				object.transform = transformMatrixToString(styleTransformMatrix);
			}
			
		}		
		*/
		this.updateStyleByObject(object, false);
	},
	getParent() {	
		return backboneModelHelper.findParentOfModelByCID(this.cid);
	},
	getParentElement() {
		return backboneModelHelper.findParentElementOfModelByCID(this.cid);
	},
	getParentChain(){
		return backboneModelHelper.findParentChainOfModelByCID(this.cid);
	},
	getToolbarButtons(){
		return [];
	},
	initialize() { 
		this.on("change", function(){
			if(this.hasChanged("url")){
				console.log("hasChanged: ImageModel URL");
				var image = new Image();
				image.onload = (function(imageClone, model){
					return function(){
						model.set("image", image);
						var obj = {};
						obj.transform = "translate(0px, 0px)";

						// Calculate parent width and height
						var parentModel = model.getParent();
						var parentRect = $("div[data-id=" + parentModel.cid + "]")[0].getBoundingClientRect();
						if(parentRect.width/parentRect.height < imageClone.naturalWidth/imageClone.naturalHeight){
							obj.height = parentRect.height;
							obj.width = parentRect.height * imageClone.naturalWidth / imageClone.naturalHeight;
						}else{
							obj.width = parentRect.width;
							obj.height = parentRect.width * imageClone.naturalHeight / imageClone.naturalWidth;
						}
						console.log(parentRect);
						model.updateStyleByObject(obj);
					}
				})(image, this);
				image.src = this.get("url");
			}
			if(this.hasChanged("style")){
				console.log(this.changed);
			}
		});
	},
});

var ShapeCircleModel = Backbone.Model.extend({
	defaults : function(){
		return {
			id : 0,
			type : undefined,
			children : [],
			policy : {
				selectionBox : {
					view : {
						tl : true, 
						tr : true,
						bl : true, 
						br : true,
						l : true, 
						t : true,
						b : true, 
						r : true,
						rotate : true,
					},
					expand : {
						keepRatio : false
					}
				},
			}
		}
	},
	validate: function( attributes ){
		if( parseFloat(attributes.style.width) <= 10 || parseFloat(attributes.style.height) <= 10 ){
			return "Width and height cannot be zero.";
		}
	},
	updateStyle(key, value){
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		object[key] = value;
		this.set("style", object);
	},
	updateStyle(key, value){
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		object[key] = value;
		this.set("style", object);
	},
	updateStyleByObject(newStyles, isSilent) {
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		var newstyles = Object.getOwnPropertyNames(newStyles);
		for (var i = newstyles.length - 1; i >= 0; i--) {
			var newStylesKey = newstyles[i];
			var newStylesValue = newStyles[newStylesKey];
			object[newStylesKey] = newStylesValue;
		}
		this.set("style", object, {silent : isSilent, validate : true});
	},
	resizeRelatively(zoomFactorObject){
		var style = this.get("style") || {};
		var styleProperties = Object.getOwnPropertyNames(style);
		var object = {};
		for(var i = 0; i < styleProperties.length; i++){
			var styleProperty = styleProperties[i];
			if(styleProperty == "top" && zoomFactorObject.yFactor){
				object.top = parseFloat(style.top) * zoomFactorObject.yFactor;
			}else if(styleProperty == "left" && zoomFactorObject.xFactor){
				object.left = parseFloat(style.left) * zoomFactorObject.xFactor;
			}else if(styleProperty == "width" && zoomFactorObject.xFactor){
				object.width = parseFloat(style.width) * zoomFactorObject.xFactor;
			}else if(styleProperty == "height" && zoomFactorObject.yFactor){
				object.height = parseFloat(style.height) * zoomFactorObject.yFactor;
			}else if(styleProperty == "transform"){
				var transformMatrix = transformMatrixDecode(style.transform);
				if(zoomFactorObject.xFactor){
					transformMatrix.tx = transformMatrix.tx * zoomFactorObject.xFactor;
				}
				if(zoomFactorObject.yFactor){
					transformMatrix.ty = transformMatrix.ty * zoomFactorObject.yFactor;
				}
				object.transform = transformMatrixToString(transformMatrix);
			}
		}
		//Apply page resize to this
		this.updateStyleByObject(object, true);
		// Pass page resize to children
		for(var i = 0; i < this.get("children").length; i++){
			var child = this.get("children")[i];
			if(child.resizeRelatively) child.resizeRelatively(zoomFactorObject);
		}
	},
	getToolbarButtons(isSmallScreen, eventType){
		if(eventType == MOUSE_EVENTS.DBLCLICK){

		}else{
			var button = new MenuButton("color", "Color");
			var colorpicker = new ColorPicker(this.get("style").backgroundColor, "Background color");
			button.addMenuItem(colorpicker);

			colorpicker.addEventListener((function(e){
				var color = rgbaObjectToCSSRGBAColorString(e.color.toRGB());
				var object = {
					backgroundColor: color
				}
				this.updateStyleByObject(object, false);
			}).bind(this));
			var button2 = new MenuButton("dimension", "Dimension");
			var textItem = new TextItem("Fit to editor");
			button2.addMenuItem(textItem);
			textItem.addEventListener((function(e){
				var model = backboneModelHelper.findParentModelOfTypeOfModelByCID(this.cid, ModelRegistry.page);
				var object = {};
				var max = Math.max(parseFloat(model.get("style").width), parseFloat(model.get("style").height));
				var min = Math.min(parseFloat(model.get("style").width), parseFloat(model.get("style").height));
				object.width = min;
				object.height = min;
				if(parseFloat(model.get("style").height) == min){
					object.transform = "translate(" + (max-min)/2 + "px,0px)";
				}else{
					object.transform = "translate(0px," + (max-min)/2 + "px)";
				}
				
				this.updateStyleByObject(object);
			}).bind(this));
			var button3 = new Button("delete", "Delete");
			button3.addEventListener((function(e){
				var parentModel = backboneModelHelper.findParentOfModelByCID(this.cid);
				var children = parentModel.get("children");
				console.log(children.indexOf(this));
				var index = children.indexOf(this);
				if(index >= 0){
					
					var newChildren = [];
					for(var i = 0; i < children.length; i++){
						newChildren.push(children[i]);
					}
					newChildren.splice(index, 1);
					parentModel.set("children", newChildren);
				}
			}).bind(this));
			if(isSmallScreen){
				var buttonGroup = new GroupedButtonTab("buttonGroup", "Edit Circle");
				buttonGroup.addButton(button).addButton(button2).addButton(button3);
				return [buttonGroup];
			}else{
				return [button, button2, button3];
			}
			
		}
	},
	initialize() { 
		this.on("change", function(){
			//console.log("Changed: ShapeCircleModel");
		});
	},
});

var EditableTextModel = Backbone.Model.extend({
	defaults : function(){
		return {
			id : 0,
			type : undefined,
			children : [],
			policy : { 
				selectionBox : {
					view : {
						l : true, 
						r : true,
					}
				},
			}
		}
	},
	validate: function( attributes ){
		if( parseFloat(attributes.style.width) <= 10 || parseFloat(attributes.style.height) <= 10 ){
			return "Width and height cannot be zero.";
		}
	},
	updateStyle(key, value){
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		object[key] = value;
		this.set("style", object);
	},
	updateStyle(key, value){
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		object[key] = value;
		this.set("style", object);
	},
	updateStyleByObject(newStyles, isSilent) {
		if(!this.get("style")){
			this.set("style", {});
		}
		// this will cause a on change event
		var style = this.get("style");
		var object = $.extend({}, style);
		var newstyles = Object.getOwnPropertyNames(newStyles);
		for (var i = newstyles.length - 1; i >= 0; i--) {
			var newStylesKey = newstyles[i];
			var newStylesValue = newStyles[newStylesKey];
			object[newStylesKey] = newStylesValue;
		}
		this.set("style", object, {silent : isSilent, validate : true});
	},
	resizeRelatively(zoomFactorObject){
		var style = this.get("style") || {};
		var styleProperties = Object.getOwnPropertyNames(style);
		var object = {};
		for(var i = 0; i < styleProperties.length; i++){
			var styleProperty = styleProperties[i];
			if(styleProperty == "top" && zoomFactorObject.yFactor){
				object.top = parseFloat(style.top) * zoomFactorObject.yFactor;
			}else if(styleProperty == "left" && zoomFactorObject.xFactor){
				object.left = parseFloat(style.left) * zoomFactorObject.xFactor;
			}else if(styleProperty == "width" && zoomFactorObject.xFactor){
				object.width = parseFloat(style.width) * zoomFactorObject.xFactor;
			}else if(styleProperty == "height" && zoomFactorObject.yFactor){
				object.height = parseFloat(style.height) * zoomFactorObject.yFactor;
			}else if(styleProperty == "transform"){
				var transformMatrix = transformMatrixDecode(style.transform);
				if(zoomFactorObject.xFactor){
					transformMatrix.tx = transformMatrix.tx * zoomFactorObject.xFactor;
				}
				if(zoomFactorObject.yFactor){
					transformMatrix.ty = transformMatrix.ty * zoomFactorObject.yFactor;
				}
				object.transform = transformMatrixToString(transformMatrix);
			}
		}
		object.fontSize = parseFloat(style.fontSize) * zoomFactorObject.xFactor;
		console.log("New font-size: " + object.fontSize);
		//Apply page resize to this
		this.updateStyleByObject(object);
		// Pass page resize to children
		for(var i = 0; i < this.get("children").length; i++){
			var child = this.get("children")[i];
			if(child.resizeRelatively) child.resizeRelatively(zoomFactorObject);
		}
	},
	getToolbarButtons(isSmallScreen, eventType){
		if(eventType == MOUSE_EVENTS.DBLCLICK){

		}else{
			// Background color
			var buttonTextBoxBackgroundColor = new MenuButton("color", "<img src='images/transparent.png'/>");
			buttonTextBoxBackgroundColor.addEmptySpaceClass();
			buttonTextBoxBackgroundColor.addBackgroundColorToItem(this.get("style").backgroundColor);
			var colorpicker = new ColorPicker(this.get("style").backgroundColor, "Background color");
			buttonTextBoxBackgroundColor.addMenuItem(colorpicker);

			colorpicker.addEventListener((function(e){
				var color = rgbaObjectToCSSRGBAColorString(e.color.toRGB());
				var object = {
					backgroundColor: color
				};
				this.updateStyleByObject(object, false);
				buttonTextBoxBackgroundColor.addBackgroundColorToItem(color);
			}).bind(this));
			// Text color
			var buttonTextColor = new MenuButton("text-color", "<img src='images/transparent.png'/>"); // <img class='toolbar-button-image' src='images/pallet_48.png'/>
			buttonTextColor.addEmptySpaceClass();
			buttonTextColor.addBackgroundColorToItem(this.get("style").color);
			var colorpicker = new ColorPicker(this.get("style").color, "Text color");
			buttonTextColor.addMenuItem(colorpicker);

			colorpicker.addEventListener((function(e){
				var color = rgbaObjectToCSSRGBAColorString(e.color.toRGB());
				var object = {
					color: color
				}
				buttonTextColor.addBackgroundColorToItem(color);
				this.updateStyleByObject(object, false);
			}).bind(this));
			// Dimension prefixes
			var button2 = new MenuButton("dimension", "Dimension");
			var textItem = new TextItem("Fit to editor");
			button2.addMenuItem(textItem);
			textItem.addEventListener((function(e){
				var model = backboneModelHelper.findParentModelOfTypeOfModelByCID(this.cid, ModelRegistry.page);
				var object = {};
				var max = Math.max(parseFloat(model.get("style").width), parseFloat(model.get("style").height));
				var min = Math.min(parseFloat(model.get("style").width), parseFloat(model.get("style").height));
				object.width = min;
				object.height = min;
				if(parseFloat(model.get("style").height) == min){
					object.transform = "translate(" + (max-min)/2 + "px,0px)";
				}else{
					object.transform = "translate(0px," + (max-min)/2 + "px)";
				}
				
				this.updateStyleByObject(object);
			}).bind(this));

			var button3 = new Button("delete", "Delete");
			button3.addEventListener((function(e){
				var parentModel = backboneModelHelper.findParentOfModelByCID(this.cid);
				var children = parentModel.get("children");
				console.log(children.indexOf(this));
				var index = children.indexOf(this);
				if(index >= 0){
					
					var newChildren = [];
					for(var i = 0; i < children.length; i++){
						newChildren.push(children[i]);
					}
					newChildren.splice(index, 1);
					parentModel.set("children", newChildren);
				}
			}).bind(this));
			if(isSmallScreen){
				var buttonGroup = new GroupedButtonTab("buttonGroup", "Edit Text");
				buttonGroup.addButton(buttonTextBoxBackgroundColor).addButton(buttonTextColor).addButton(button2).addButton(button3);
				return [buttonGroup];
			}else{
				return [buttonTextBoxBackgroundColor,buttonTextColor, button2, button3];
			}
		}
	},
	initialize() { 
		this.on("change", function(){
			//console.log("Changed: ShapeCircleModel");
		});
	},
});
//var page = new PageModel();
//var element = new ElementModel();
//page.get("children").push(element);

ModelRegistry.document = DocumentModel;
ModelRegistry.multipage = MultipageModel;
ModelRegistry.page = PageModel;
ModelRegistry.elements = ElementsModel;
ModelRegistry.element = ElementModel;
ModelRegistry.fixedCollageContainer = FixedCollageContainerModel;
ModelRegistry.collageContainer = CollageContainerModel;
ModelRegistry.row = RowModel;
ModelRegistry.column = ColumnModel;
ModelRegistry.cell = CellModel;
ModelRegistry.cellImage = CellImageModel;
ModelRegistry.cellContent = CellContentModel;

ModelRegistry.shapeCircle = ShapeCircleModel;
ModelRegistry.editableText = EditableTextModel;
/*
	Serialized model generated by parsing Backbone models and 
	saved on to DB for reloading workspace. A object can only contain
	one Backbone model

	Note: User only able configure style under each object. Any custom CSS applied though 
	DOM will not be save to model

*/
var Model = [{
	type : "document",
	document : [
		{
			type : "multipage",
			multipage : [
				{
					"type": "page",
					"page" : [
						{
							"type": "elements",
							"elements" : [
								{
									"type": "element",
									"element" : [
										/*{
											// collageContainer has a defined width and a height
											"type": "fixedCollageContainer",
											"fixedCollageContainer" : [
												{
													//Contaiers contents root is always a Row
													"type": "row",
													"row" : [
														{
															"type": "row",
															"row" : [
																{
																	"type": "column",
																	"column" : [
																		{
																			"type": "cell",
																			"cell" : [{
																				"type": "cellContent",
																				"cellContent" : [{
																					"type": "cellImage",
																					"cellImage" : [{
																								
																					}],
																					"url" : "http://localhost/images/2.jpg",
																					"style" : {
																						"transform": "translate(-49px,-53px)"
																					}
																				}],
																				"style" : {
																					backgroundColor : getRandomColor(),
																					left: 4,
																					right: 4,
																					top: 4,
																					bottom: 4,
																					borderRadius: "0",
																				}
																			}],
																			"style" : {
																				"padding" : "5px",
																			}
																		},
																	],
																	"style" : {
																		width : "33.33333%",
																		left : "0%",
																	},
																},
																{
																	"type": "column",
																	"column" : [
																		{	
																			"type": "row",
																			"row" : [
																				{
																					"type": "column",
																					"column" : [
																						{
																							"type": "row",
																							"row" : [
																								{
																									"type": "cell",
																									"cell" : [{
																										"type": "cellContent",
																										"cellContent" : [{
																											"type": "cellImage",
																											"cellImage" : [{
																														
																											}],
																											"url" : "http://localhost/images/2.jpg",
																											"style" : {
																												"transform": "translate(-49px,-53px)"
																											}
																										}],
																										"style" : {
																											backgroundColor : getRandomColor(),
																											left: 4,
																											right: 4,
																											top: 4,
																											bottom: 4,
																											borderRadius: "0",
																										}
																									}],
																									"style" : {
																										"padding" : "5px",
																									}
																								},
																							],
																							"style" : {
																								height : "50%",
																								top : "0%",
																							}
																							
																						},
																						{
																							"type": "row",
																							"row" : [
																								{
																									"type": "cell",
																									"cell" : [{
																										"type": "cellContent",
																										"cellContent" : [{
																											"type": "cellImage",
																											"cellImage" : [{
																														
																											}],
																											"url" : "http://localhost/images/2.jpg",
																											"style" : {
																												"transform": "translate(-49px,-53px)"
																											}
																										}],
																										"style" : {
																											backgroundColor : getRandomColor(),
																											left: 4,
																											right: 4,
																											top: 4,
																											bottom: 4,
																											borderRadius: "0",
																										}
																									}],
																									"style" : {
																										"padding" : "5px",
																									}
																								},
																							],
																							"style" : {
																								height : "50%",
																								top : "50%",
																							}
																							
																						}
																					],
																					"style" : {
																						width : "50%",
																						left : "0%",
																					}
																				},
																				{
																					"type": "column",
																					"column" : [
																						{
																							"type": "cell",
																							"cell" : [{
																								"type": "cellContent",
																								"cellContent" : [{
																									"type": "cellImage",
																									"cellImage" : [{
																												
																									}],
																									"url" : "http://localhost/images/2.jpg",
																									"style" : {
																										"transform": "translate(-49px,-53px)"
																									}
																								}],
																								"style" : {
																									backgroundColor : getRandomColor(),
																									left: 4,
																									right: 4,
																									top: 4,
																									bottom: 4,
																									borderRadius: "0",
																								}
																							}],
																							"style" : {
																								"padding" : "5px",
																							}
																						},
																					],
																					"style" : {
																						width : "50%",
																						left : "50%",
																					}
																					
																				}
																			],
																			"style" : {
																				height : "50%",
																				top : "0%",
																			}
																		},
																		{	
																			"type": "row",
																			"row" : [
																				{
																					"type": "cell",
																					"cell" : [{
																						"type": "cellContent",
																						"cellContent" : [{
																							"type": "cellImage",
																							"cellImage" : [{
																										
																							}],
																							"url" : "http://localhost/images/2.jpg",
																							"style" : {
																								"transform": "translate(-49px,-53px)"
																							}
																						}],
																						"style" : {
																							backgroundColor : getRandomColor(),
																							left: 4,
																							right: 4,
																							top: 4,
																							bottom: 4,
																							borderRadius: "0",
																						}
																					}],
																					"style" : {
																						"padding" : "5px",
																					}
																				},
																			],
																			"style" : {
																				height : "50%",
																				top : "50%",
																			}
																		}
																	],
																	"style" : {
																		width : "33.33333%",
																		left : "33.33333%",
																	}
																},
																{
																	"type": "column",
																	"column" : [
																		{
																			"type": "cell",
																			"cell" : [{
																				"type": "cellContent",
																				"cellContent" : [{
																					"type": "cellImage",
																					"cellImage" : [{
																								
																					}],
																					"url" : "http://localhost/images/2.jpg",
																					"style" : {
																						"transform": "translate(-49px,-53px)"
																					}
																				}],
																				"style" : {
																					backgroundColor : getRandomColor(),
																					left: 4,
																					right: 4,
																					top: 4,
																					bottom: 4,
																					borderRadius: "0",
																				}
																			}],
																			"style" : {
																				"padding" : "5px",
																			}
																		},
																	], 
																	"style" : {
																		width : "33.33333%",
																		left : "66.666667%",
																	}
																	
																}
															],
															"style" : {
																"height": "50%",
																"top": "0%",
															}
														},
														{
															"type": "row",
															"row" : [
																{
																	"type": "cell",
																	"cell" : [{
																		"type": "cellContent",
																		"cellContent" : [{
																			"type": "cellImage",
																			"cellImage" : [{
																						
																			}],
																			"url" : "http://localhost/images/2.jpg",
																			"style" : {
																				"transform": "translate(-49px,-53px)"
																			}
																		}],
																		"style" : {
																			backgroundColor : getRandomColor(),
																		}
																	}],
																	"style" : {
																		"padding" : "5px",
																	}
																},
															],
															"style" : {
																"height": "50%",
																"top": "50%",
															}
															
														}
													],
													"style" : {
														"width": "100%",
														"height": "100%",
													}
												}
											],
											"style" : {
												"width": "402px",
												"height": "403px",
												"transform": "translate(0px,0px)",
												"opacity": "1",
												"backgroundColor" : "#8bd1dc", 
											}
										},{
											"type": "shapeCircle",
											"shapeCircle" : [
												{
												}
											],
											"style" : {
												"backgroundColor" : "#8080bd",
												"borderRadius" : "0%",
												"transform": "translate(0px,0px)",
												"width": "180px", 
												"height": "180px",
											}
										},
										{
											"type": "editableText",
											"editableText" : [
												{
												}
											],
											"style" : {
												"backgroundColor" : "rgba(255, 255, 255, 0)",
												"borderRadius" : "0%",
												"transform": "translate( 100px, 100px) rotate(45deg)",
												"width": "180px",
												"height": "22px",
												"fontSize": "16px",
											}
										}*/
									]
								},

							]
						}
					],
					"style" : {
						width: "1000px", 
						height: "1000px",
						minWidth: "300px", 
						minHeight: "200px",
						backgroundColor: "#00bc8f",
					},
					zoomFactorWidth : 1,
					zoomFactorHeight : 1,
					pageHeight: 1000,
					pageWidth: 1000,
				},/*{
					"type": "page",
					"page" : [
						{
							"type": "elements",
							"elements" : [
								{
									"type": "element",
									"element" : [
										{
											// collageContainer has a defined width and a height
											"type": "collageContainer",
											"collageContainer" : [
												{
													//Contaiers contents root is always a Row
													"type": "row",
													"row" : [
														{
															"type": "row",
															"row" : [
																{
																	"type": "column",
																	"column" : [
																		{
																			"type": "cell",
																			"cell" : [{
																				"type": "cellContent",
																				"cellContent" : [{
																					"type": "cellImage",
																					"cellImage" : [{
																								
																					}],
																					"url" : "http://localhost/images/2.jpg",
																					"style" : {
																						"transform": "translate(-49px,-53px)"
																					}
																				}],
																				"style" : {
																					backgroundColor : getRandomColor(),
																					left: 4,
																					right: 4,
																					top: 4,
																					bottom: 4,
																					borderRadius: "0",
																				}
																			}],
																			"style" : {
																				"padding" : "5px",
																			}
																		},
																	],
																	"style" : {
																		width : "33.33333%",
																		left : "0%",
																	},
																},
																{
																	"type": "column",
																	"column" : [
																		{	
																			"type": "row",
																			"row" : [
																				{
																					"type": "column",
																					"column" : [
																						{
																							"type": "row",
																							"row" : [
																								{
																									"type": "cell",
																									"cell" : [{
																										"type": "cellContent",
																										"cellContent" : [{
																											"type": "cellImage",
																											"cellImage" : [{
																														
																											}],
																											"url" : "http://localhost/images/2.jpg",
																											"style" : {
																												"transform": "translate(-49px,-53px)"
																											}
																										}],
																										"style" : {
																											backgroundColor : getRandomColor(),
																											left: 4,
																											right: 4,
																											top: 4,
																											bottom: 4,
																											borderRadius: "0",
																										}
																									}],
																									"style" : {
																										"padding" : "5px",
																									}
																								},
																							],
																							"style" : {
																								height : "50%",
																								top : "0%",
																							}
																							
																						},
																						{
																							"type": "row",
																							"row" : [
																								{
																									"type": "cell",
																									"cell" : [{
																										"type": "cellContent",
																										"cellContent" : [{
																											"type": "cellImage",
																											"cellImage" : [{
																														
																											}],
																											"url" : "http://localhost/images/2.jpg",
																											"style" : {
																												"transform": "translate(-49px,-53px)"
																											}
																										}],
																										"style" : {
																											backgroundColor : getRandomColor(),
																											left: 4,
																											right: 4,
																											top: 4,
																											bottom: 4,
																											borderRadius: "0",
																										}
																									}],
																									"style" : {
																										"padding" : "5px",
																									}
																								},
																							],
																							"style" : {
																								height : "50%",
																								top : "50%",
																							}
																							
																						}
																					],
																					"style" : {
																						width : "50%",
																						left : "0%",
																					}
																				},
																				{
																					"type": "column",
																					"column" : [
																						{
																							"type": "cell",
																							"cell" : [{
																								"type": "cellContent",
																								"cellContent" : [{
																									"type": "cellImage",
																									"cellImage" : [{
																												
																									}],
																									"url" : "http://localhost/images/2.jpg",
																									"style" : {
																										"transform": "translate(-49px,-53px)"
																									}
																								}],
																								"style" : {
																									backgroundColor : getRandomColor(),
																									left: 4,
																									right: 4,
																									top: 4,
																									bottom: 4,
																									borderRadius: "0",
																								}
																							}],
																							"style" : {
																								"padding" : "5px",
																							}
																						},
																					],
																					"style" : {
																						width : "50%",
																						left : "50%",
																					}
																					
																				}
																			],
																			"style" : {
																				height : "50%",
																				top : "0%",
																			}
																		},
																		{	
																			"type": "row",
																			"row" : [
																				{
																					"type": "cell",
																					"cell" : [{
																						"type": "cellContent",
																						"cellContent" : [{
																							"type": "cellImage",
																							"cellImage" : [{
																										
																							}],
																							"url" : "http://localhost/images/2.jpg",
																							"style" : {
																								"transform": "translate(-49px,-53px)"
																							}
																						}],
																						"style" : {
																							backgroundColor : getRandomColor(),
																							left: 4,
																							right: 4,
																							top: 4,
																							bottom: 4,
																							borderRadius: "0",
																						}
																					}],
																					"style" : {
																						"padding" : "5px",
																					}
																				},
																			],
																			"style" : {
																				height : "50%",
																				top : "50%",
																			}
																		}
																	],
																	"style" : {
																		width : "33.33333%",
																		left : "33.33333%",
																	}
																},
																{
																	"type": "column",
																	"column" : [
																		{
																			"type": "cell",
																			"cell" : [{
																				"type": "cellContent",
																				"cellContent" : [{
																					"type": "cellImage",
																					"cellImage" : [{
																								
																					}],
																					"url" : "http://localhost/images/2.jpg",
																					"style" : {
																						"transform": "translate(-49px,-53px)"
																					}
																				}],
																				"style" : {
																					backgroundColor : getRandomColor(),
																					left: 4,
																					right: 4,
																					top: 4,
																					bottom: 4,
																					borderRadius: "0",
																				}
																			}],
																			"style" : {
																				"padding" : "5px",
																			}
																		},
																	], 
																	"style" : {
																		width : "33.33333%",
																		left : "66.666667%",
																	}
																	
																}
															],
															"style" : {
																"height": "50%",
																"top": "0%",
															}
														},
														{
															"type": "row",
															"row" : [
																{
																	"type": "cell",
																	"cell" : [{
																		"type": "cellContent",
																		"cellContent" : [{
																			"type": "cellImage",
																			"cellImage" : [{
																						
																			}],
																			"url" : "http://localhost/images/2.jpg",
																			"style" : {
																				"transform": "translate(-49px,-53px)"
																			}
																		}],
																		"style" : {
																			backgroundColor : getRandomColor(),
																		}
																	}],
																	"style" : {
																		"padding" : "5px",
																	}
																},
															],
															"style" : {
																"height": "50%",
																"top": "50%",
															}
															
														}
													],
													"style" : {
														"width": "100%",
														"height": "100%",
													}
												}
											],
											"style" : {
												"width": "402px",
												"height": "403px",
												"transform": "translate(0px,0px)",
												"opacity": "1",
												"backgroundColor" : "#8bd1dc", 
											}
										},{
											"type": "shapeCircle",
											"shapeCircle" : [
												{
												}
											],
											"style" : {
												"backgroundColor" : "#8080bd",
												"borderRadius" : "0%",
												"transform": "translate(0px,0px)",
												"width": "180px", 
												"height": "180px",
											}
										},
										{
											"type": "editableText",
											"editableText" : [
												{
												}
											],
											"style" : {
												"backgroundColor" : "rgba(255, 255, 255, 0)",
												"borderRadius" : "0%",
												"transform": "translate( 100px, 100px) rotate(45deg)",
												"width": "180px",
												"height": "22px",
												"fontSize": "16px",
											}
										}
									]
								},

							]
						}
					],
					"style" : {
						width: "500px", 
						height: "400px",
						minWidth: "300px", 
						minHeight: "200px",
						backgroundColor: "#00bc8f",
					},
					pageHeight: 400,
				},*/
			],
			"style" : {
				top: "58px",
				left: "10px",
			},
			zoomFactorWidth : 1,
			zoomFactorHeight : 1,
			zoom : 1,
			pageWidth: 1000, 
		}
	]
}];

var Model000 = [
	{
		"type": "page",
		"page" : [
			{
				"type": "elements",
				"elements" : [
					{
						"type": "element",
						"element" : [
							/*{
								// collageContainer has a defined width and a height
								"type": "collageContainer",
								"collageContainer" : [
									{
										//Contaiers contents root is always a Row
										"type": "row",
										"row" : [
											{
												"type": "row",
												"row" : [
													{
														"type": "column",
														"column" : [
															{
																"type": "cell",
																"cell" : [{
																	"type": "cellContent",
																	"cellContent" : [{
																		"type": "cellImage",
																		"cellImage" : [{
																					
																		}],
																		"url" : "http://localhost/images/2.jpg",
																		"style" : {
																			"transform": "translate(-49px,-53px)"
																		}
																	}],
																	"style" : {
																		backgroundColor : getRandomColor(),
																		left: 4,
																		right: 4,
																		top: 4,
																		bottom: 4,
																		borderRadius: "0",
																	}
																}],
																"style" : {
																	"padding" : "5px",
																}
															},
														],
														"style" : {
															width : "33.33333%",
															left : "0%",
														},
													},
													{
														"type": "column",
														"column" : [
															{	
																"type": "row",
																"row" : [
																	{
																		"type": "column",
																		"column" : [
																			{
																				"type": "row",
																				"row" : [
																					{
																						"type": "cell",
																						"cell" : [{
																							"type": "cellContent",
																							"cellContent" : [{
																								"type": "cellImage",
																								"cellImage" : [{
																											
																								}],
																								"url" : "http://localhost/images/2.jpg",
																								"style" : {
																									"transform": "translate(-49px,-53px)"
																								}
																							}],
																							"style" : {
																								backgroundColor : getRandomColor(),
																								left: 4,
																								right: 4,
																								top: 4,
																								bottom: 4,
																								borderRadius: "0",
																							}
																						}],
																						"style" : {
																							"padding" : "5px",
																						}
																					},
																				],
																				"style" : {
																					height : "50%",
																					top : "0%",
																				}
																				
																			},
																			{
																				"type": "row",
																				"row" : [
																					{
																						"type": "cell",
																						"cell" : [{
																							"type": "cellContent",
																							"cellContent" : [{
																								"type": "cellImage",
																								"cellImage" : [{
																											
																								}],
																								"url" : "http://localhost/images/2.jpg",
																								"style" : {
																									"transform": "translate(-49px,-53px)"
																								}
																							}],
																							"style" : {
																								backgroundColor : getRandomColor(),
																								left: 4,
																								right: 4,
																								top: 4,
																								bottom: 4,
																								borderRadius: "0",
																							}
																						}],
																						"style" : {
																							"padding" : "5px",
																						}
																					},
																				],
																				"style" : {
																					height : "50%",
																					top : "50%",
																				}
																				
																			}
																		],
																		"style" : {
																			width : "50%",
																			left : "0%",
																		}
																	},
																	{
																		"type": "column",
																		"column" : [
																			{
																				"type": "cell",
																				"cell" : [{
																					"type": "cellContent",
																					"cellContent" : [{
																						"type": "cellImage",
																						"cellImage" : [{
																									
																						}],
																						"url" : "http://localhost/images/2.jpg",
																						"style" : {
																							"transform": "translate(-49px,-53px)"
																						}
																					}],
																					"style" : {
																						backgroundColor : getRandomColor(),
																						left: 4,
																						right: 4,
																						top: 4,
																						bottom: 4,
																						borderRadius: "0",
																					}
																				}],
																				"style" : {
																					"padding" : "5px",
																				}
																			},
																		],
																		"style" : {
																			width : "50%",
																			left : "50%",
																		}
																		
																	}
																],
																"style" : {
																	height : "50%",
																	top : "0%",
																}
															},
															{	
																"type": "row",
																"row" : [
																	{
																		"type": "cell",
																		"cell" : [{
																			"type": "cellContent",
																			"cellContent" : [{
																				"type": "cellImage",
																				"cellImage" : [{
																							
																				}],
																				"url" : "http://localhost/images/2.jpg",
																				"style" : {
																					"transform": "translate(-49px,-53px)"
																				}
																			}],
																			"style" : {
																				backgroundColor : getRandomColor(),
																				left: 4,
																				right: 4,
																				top: 4,
																				bottom: 4,
																				borderRadius: "0",
																			}
																		}],
																		"style" : {
																			"padding" : "5px",
																		}
																	},
																],
																"style" : {
																	height : "50%",
																	top : "50%",
																}
															}
														],
														"style" : {
															width : "33.33333%",
															left : "33.33333%",
														}
													},
													{
														"type": "column",
														"column" : [
															{
																"type": "cell",
																"cell" : [{
																	"type": "cellContent",
																	"cellContent" : [{
																		"type": "cellImage",
																		"cellImage" : [{
																					
																		}],
																		"url" : "http://localhost/images/2.jpg",
																		"style" : {
																			"transform": "translate(-49px,-53px)"
																		}
																	}],
																	"style" : {
																		backgroundColor : getRandomColor(),
																		left: 4,
																		right: 4,
																		top: 4,
																		bottom: 4,
																		borderRadius: "0",
																	}
																}],
																"style" : {
																	"padding" : "5px",
																}
															},
														], 
														"style" : {
															width : "33.33333%",
															left : "66.666667%",
														}
														
													}
												],
												"style" : {
													"height": "50%",
													"top": "0%",
												}
											},
											{
												"type": "row",
												"row" : [
													{
														"type": "cell",
														"cell" : [{
															"type": "cellContent",
															"cellContent" : [{
																"type": "cellImage",
																"cellImage" : [{
																			
																}],
																"url" : "http://localhost/images/2.jpg",
																"style" : {
																	"transform": "translate(-49px,-53px)"
																}
															}],
															"style" : {
																backgroundColor : getRandomColor(),
															}
														}],
														"style" : {
															"padding" : "5px",
														}
													},
												],
												"style" : {
													"height": "50%",
													"top": "50%",
												}
												
											}
										],
										"style" : {
											"width": "100%",
											"height": "100%",
										}
									}
								],
								"style" : {
									"width": "402px",
									"height": "403px",
									"transform": "translate(0px,0px)",
									"opacity": "1",
									"backgroundColor" : "#8bd1dc", 
								}
							},*/{
								"type": "shapeCircle",
								"shapeCircle" : [
									{
									}
								],
								"style" : {
									"backgroundColor" : "#8080bd",
									"borderRadius" : "0%",
									"transform": "translate(0px,0px)",
									"width": "180px", 
									"height": "180px",
								}
							},
							{
								"type": "editableText",
								"editableText" : [
									{
									}
								],
								"style" : {
									"backgroundColor" : "rgba(255, 255, 255, 0)",
									"borderRadius" : "0%",
									"transform": "translate( 100px, 100px) rotate(45deg)",
									"width": "180px",
									"height": "22px",
									"fontSize": "16",
								}
							}
						]
					},

				]
			}
		],
		"style" : {
			top: "58px",
			left: "10px",
			width: "500px", 
			height: "400px",
			minWidth: "300px", 
			minHeight: "200px",
			backgroundColor: "#00bc8f",
		},
		zoomFactorWidth : 1,
		zoomFactorHeight : 1,
		pageHeight: 400,
		pageWidth: 500,
	},
];

/* JSON.stringify to Backbone Model */
function convert(object){
    var children = object.get("children");
    object.unset("children", {silent: true});
	// Initialize for Backbone object
	if(!children.length){
		var arr = [];
		object.set("children", arr, {silent: false});
	}
    for(var i = 0; i < children.length; i++) {
        var element = children[i];
        var arr = [];
        var bModel = null;
        if(object.get("children")){
            arr = object.get("children");
            bModel = new ModelRegistry[element.type](element, {silent: false});
        }else{
            bModel = new ModelRegistry[element.type](element, {silent: false});
        }
        arr.push(bModel);
        object.set("children", arr, {silent: false});
        convert(bModel);
    }
}



/* MODEL TO BACKBONEMODEL FROM TEMPLATE */
function getBackboneObjectFromModelObject(obj){
	var properties = Object.getOwnPropertyNames(obj);
	for(var j = 0; j < properties.length; j++){
		var property = properties[j];
		if(obj[property] instanceof Array){
			var el = new ModelRegistry[property]({}, {silent: false});
			try{
				for(var p = 0; p < properties.length; p++){
					if(properties[p] == "url"){
						// ERROR HERE
						el.set(properties[p], obj[properties[p]], {silent: false});
					}else if(properties[p] != property){
						if(el instanceof ModelRegistry.cellImage){
							el.set(properties[p], obj[properties[p]], {silent: true});
						}else{
							el.set(properties[p], obj[properties[p]], {silent: false});
						}
						
					}
				}
				el.set("modelRef", obj, {silent: true});
			}catch(e){
				console.log(e);
			}
			window.BackboneObjectMap.set(el.cid, el);
			return el;
		}
	}
}

function getBackboneModelNameFromModelObject(obj){
	var properties = Object.getOwnPropertyNames(obj);
	for(var j = 0; j < properties.length; j++){
		var property = properties[j];
		if(obj[property] instanceof Array){
			return property;
		}
	}
}
function _modelWalkRecursiveHelper(model, root){
	if(!model) return;
	for(var i = 0; i < model.length; i++){
		var obj = model[i];
		var bModel = getBackboneObjectFromModelObject(obj);
		if(bModel && root){
			var currentChildren = root.get("children");
			// Cause a model change event
			var childArray = new Array();
			var newArray = childArray.concat(currentChildren);
			newArray.push(bModel);
			if(bModel instanceof ModelRegistry.cellImage || bModel instanceof ModelRegistry.cellContent){
				root.set("children", newArray, {silent: false});
			}else{
				root.set("children", newArray, {silent: true});
			}
			
		}else{
			root = bModel;
		}
		_modelWalkRecursiveHelper(obj[getBackboneModelNameFromModelObject(obj)], bModel);
	};
	return root;
}
/*
	Model --> [{},{},{}]
*/
function modelWalkRecursive(model){
	var _root = null;
	_root = _modelWalkRecursiveHelper(model, _root)
	if(debug.trace){
		if(!_root) console.log("Error: modelWalkRecursive could not create a backbone model from given JSON model.");
	}
	return _root;
};

function checkCircles(model, map = new Map()){
	if(!map.get(model.cid)){
		map.set(model.cid, true);
		
		if(model.get("children")){
			for(var i = 0; i < model.get("children").length; i++){
				var element = model.get("children")[i];
				if(element){
					checkCircles(element, map);
				}
			}
		}
	}else{
		console.log("Cycle exist.");
		console.log(model);
		return;
	}
}

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return "rgb(15, 197, 224)";
}

function transformMatrixDecode(cssTranformAsAString){
	if(cssTranformAsAString.length == 0) {
		cssTranformAsAString = "translate(0px, 0px) rotate(0deg)";
		console.log("Argument to tranformMatrixDecode was an empty string. Make sure this is intentional.");
	}
	try{
		var value = cssTranformAsAString.match(/(\w+?)(\(.+?\)+)/ig);
		var object = {};
		for(var i = 0; i < value.length; i++){
			var match = value[i];
			if(match.match(/translate/)){
				var valueArray = match.match(/translate\((.+)\)/i)[1].split(",");
				object.tx = parseFloat(valueArray[0]);
				object.ty = parseFloat(valueArray[1]);
			}else if(match.match(/rotate/)){
				object.rotate = parseFloat(match.match(/rotate\((.*)deg\)/)[1]);
			}
		}
		if(!object.hasOwnProperty("rotate")){
			object.rotate = 0;
		}
		return object;
	}catch(e){
		console.log(e);
		console.log("tranformMatrixDecode called with a mulformed argument . Make sure this is intentional.");
		return {
			tx : 0,
			ty : 0,
			rotate: 0
		};
	}
}

function updateTransformMatrixValue(cssTranformAsAString, key, value){
	var matrix = transformMatrixDecode(cssTranformAsAString);
	matrix[key] = value;
	return matrix;
}
function accumulateTransformMatrixValue(cssTranformAsAString, key, value){
	var matrix = transformMatrixDecode(cssTranformAsAString);
	matrix[key] += value;
	return matrix;
}

function transformMatrixToString(matrix){
	return "translate(" + 
		matrix.tx +"px, " + 
		matrix.ty + 
	"px) rotate(" + (matrix.rotate ? matrix.rotate : 0) + "deg)";
}
