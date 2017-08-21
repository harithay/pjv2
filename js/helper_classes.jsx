
var BackboneModelHelper  = function(backboneModel){
	this.model = backboneModel;
}
BackboneModelHelper.prototype.findModelByCID = function(cid){
	return this._findModelByCID(this.model, cid);
}
BackboneModelHelper.prototype._findModelByCID = function(model, cid){
	if(model.cid == cid){
		return model;
	}else{
		var children = model.get("children");
		for(var i = 0; i < children.length; i++){
			var m = null;
			if(m = this._findModelByCID(children[i], cid)){
				return m;
			}
		}
		
	}
}
BackboneModelHelper.prototype.findModelsByType = function(type){
	return this._findModelsByType(this.model, type);
}
BackboneModelHelper.prototype.findModelsByTypeString = function(typeString){
	return this._findModelsByType(this.model, ModelRegistry[typeString]);
}
BackboneModelHelper.prototype._findModelsByType = function(model, type){
	var children = model.get("children");
	var childrenArray = [];
	var ret = [];
	for(var i = 0; i < children.length; i++){
		childrenArray.push(children[i]);
	}
	while(m = childrenArray.pop()){
		if(m instanceof type){
			ret.push(m);
		}
		children = m.get("children");
		for(var i = 0; i < children.length; i++){
			childrenArray.push(children[i]);
		}
	}
	
	return ret;
}
BackboneModelHelper.prototype.getAllLeafModelsOfAModelByCID = function(cid){
	return this._getAllLeafModelsOfAModelByCID(this._findModelByCID(this.model, cid), []);
}
BackboneModelHelper.prototype._getAllLeafModelsOfAModelByCID = function(model, arr){
	if(model.get("children").length == 0 || (model.get("children").length == 1 && Object.getOwnPropertyNames(model.get("children")[0]).length == 0)){
		return arr.push(model);
	}else{
		var children = model.get("children");
		for(var i = 0; i < children.length; i++){
			this._getAllLeafModelsOfAModelByCID(children[i], arr);
		}
		
	}
	return arr;
}
BackboneModelHelper.prototype.getAllModelsOfAModelByType = function(cid, type){
	return this._getAllModelsOfAModelByType(this._findModelByCID(this.model, cid), type, []);
}
BackboneModelHelper.prototype._getAllModelsOfAModelByType = function(model, type, arr){
	if(model && model instanceof type){
		return arr.push(model);
	}else if(model){
		var children = model.get("children");
		for(var i = 0; i < children.length; i++){
			this._getAllModelsOfAModelByType(children[i], type, arr);
		}
		
	}
	return arr;
}
BackboneModelHelper.prototype.getAllLeafModelsWithImageOfAModelByModelAndCID = function(model,cid){
	return this._getAllLeafModelsWithImageOfAModelByCID(this._findModelByCID(model, cid), []);
};
BackboneModelHelper.prototype.getAllLeafModelsWithImageOfAModelByCID = function(cid){
	return this._getAllLeafModelsWithImageOfAModelByCID(this._findModelByCID(this.model, cid), []);
};
BackboneModelHelper.prototype._getAllLeafModelsWithImageOfAModelByCID = function(model, arr){
	if(model instanceof ModelRegistry.cellImage &&( model.get("children").length == 0 || (model.get("children").length == 1 && Object.getOwnPropertyNames(model.get("children")[0]).length == 0))){
		arr.push(model);
	}else{
		if(model){
			var children = model.get("children");
			for(var i = 0; i < children.length; i++){
				this._getAllLeafModelsWithImageOfAModelByCID(children[i], arr);
			}
		}
	}
	return arr;
}
BackboneModelHelper.prototype.findParentOfModelByCID = function(cid){
	return this._findParentOfModelByCID(this.model, cid, null);
}
BackboneModelHelper.prototype._findParentOfModelByCID = function(model, cid, parent){
	if(model.cid == cid){
		return parent;
	}else{
		var children = model.get("children");
		for(var i = 0; i < children.length; i++){
			var m = null;
			if(m = this._findParentOfModelByCID(children[i], cid, model)){
				return m;
			}
		}
		
	}
}
/*
	Does not include current model
*/
BackboneModelHelper.prototype.findParentChainOfModelByCID = function(cid){
	return this._findParentChainOfModelByCID(this.model, cid);
}
BackboneModelHelper.prototype._findParentChainOfModelByCID = function(model, cid){
	var parentChain = [];
	var m = undefined;
	while(m = this._findParentOfModelByCID(model, cid)){
		parentChain.push(m);
		cid = m.cid;
	}
	return parentChain.reverse();
}

BackboneModelHelper.prototype.findParentModelOfTypeOfModelByCID = function(cid, type){
	return this._findParentModelOfTypeOfModelByCID(this.model, cid, type);
}
BackboneModelHelper.prototype._findParentModelOfTypeOfModelByCID = function(model, cid, type){
	var parentChain = [];
	var m = undefined;
	while(m = this._findParentOfModelByCID(model, cid)){
		if(m instanceof type){
			return m;
		}
		cid = m.cid;
	}
	return null;
}
/*
	Parent Element is of type ModelRegistry.element
*/
BackboneModelHelper.prototype.findParentElementOfModelByCID = function(cid){
	var parents = this._findParentChainOfModelByCID(this.model, cid);
	parents.push(this.findModelByCID(cid));
	for (var i = parents.length - 1; i >= 0; i--) {
		var model = parents[i];
		if(model instanceof ModelRegistry.element){
			return model;
		}
	}
}
/*
	get Document
*/
BackboneModelHelper.prototype.getDocumentFromModelByCID = function(cid){
	var parents = this._findParentChainOfModelByCID(this.model, cid);
	parents.push(this.findModelByCID(cid));
	for (var i = parents.length - 1; i >= 0; i--) {
		var model = parents[i];
		if(model instanceof ModelRegistry.document){
			return model;
		}
	}
}
/*
	Childs Image is of type ModelRegistry.image
*/
BackboneModelHelper.prototype.findChildImageOfModelByCID = function(cid){
	var childrenModels = this.getAllLeafModelsWithImageOfAModelByCID(cid);
	childrenModels.push(this.findModelByCID(cid));
	for (var i = childrenModels.length - 1; i >= 0; i--) {
		var model = childrenModels[i];
		if(model instanceof ModelRegistry.cellImage){
			return model;
		}
	}
}
/*
	Parent Page is of type ModelRegistry.page
*/
BackboneModelHelper.prototype.findParentPageOfModelByCID = function(cid){
	var parents = this._findParentChainOfModelByCID(this.model, cid);
	parents.push(this.findModelByCID(cid));
	for (var i = parents.length - 1; i >= 0; i--) {
		var model = parents[i];
		if(model instanceof ModelRegistry.page){
			return model;
		}
	}
}
/*
	Parent Multipage is of type ModelRegistry.multipage
*/
BackboneModelHelper.prototype.findParentMultipageOfModelByCID = function(cid){
	var parents = this._findParentChainOfModelByCID(this.model, cid);
	parents.push(this.findModelByCID(cid));
	for (var i = parents.length - 1; i >= 0; i--) {
		var model = parents[i];
		if(model instanceof ModelRegistry.multipage){
			return model;
		}
	}
}
/*
	This is the firstChild of ModelRegistry.element which is an element "virtually"
*/
BackboneModelHelper.prototype.findMovableElementOfModelByCID = function(cid){
	var parents = this._findParentChainOfModelByCID(this.model, cid);
	parents.push(this.findModelByCID(cid));
	var prev = null;
	for (var i = parents.length - 1; i >= 0; i--) {
		var model = parents[i];
		if(model instanceof ModelRegistry.element){
			return prev;
		}
		prev = model;
	}
}
/*******************************************************

	ToolbarHelper is a convinient class to add items to 
	Document's toolbar 

*******************************************************/
class ToolbarHelper {
	constructor(){
		this.className = "toolbar";
		this.$el = $(".toolbar");
		this.registry = new Array;
		if(!$(".toolbar").length){
			console.error("Toolbar must be created inside DocumentView by ReactJS.");
			throw("Error: Toolbar creation failed.");
		}
		$(window).on("click", (function(e){
			if($(e.target).closest("." + this.className).length == 0){
				this.closeAllMenues();
			}
		}).bind(this));
	};
	clear(){
		this.$el.empty();
	};
	addButton(button){
		if(button instanceof GroupedButtonTab){
			button.render(this.$el);
		}else{
			//HPY DEBUG THIS. THIS JUST STARTED TO WORK  -->this.$el.append(button.getHTML());
			button.render(this.$el);
		}
		this.addItemToRegistry(button);
		button.setToolbar(this);
	};
	addSeperator(seperator){
		if(seperator) this.$el.append(seperator.getHTML());
		else{
			this.$el.append(new ToolbarItemSeperator().getHTML())
		}
	};
	getItemRegistry(){
		return this.registry;
	};
	addItemToRegistry(item){
		this.registry.push(item);
	};
	closeAllMenues(){
		for(var i = 0; i < this.registry.length; i++){
			var menu = this.registry[i];
			if(menu.close) menu.close();
		}
	};
	closeAllMenuesExcept(component){
		// Click on a plain Button without a menu
			// Need to implement
		// Click on a MenuButton
		if(component instanceof GroupedButtonTab){
			for(var i = 0; i < this.registry.length; i++){
				var groupedButton = this.registry[i];
				if(groupedButton == component){
					console.log("Skip");
				}else{
					groupedButton.close();
				}
			}
		}else {
			for(var i = 0; i < this.registry.length; i++){
				var menuitem = this.registry[i];
				var closeMenu = true;
				if(menuitem instanceof GroupedButtonTab){
					for(var j = 0; j < menuitem.getButtons().length; j++){
						var button = menuitem.getButtons()[j];
						if(component == button){
							closeMenu = false;
						}else{
							// Close all other MenuButton on this subnav
							if(button instanceof MenuButton && button.close) button.close();
						}
					}
				}else if(menuitem instanceof MenuButton && menuitem == component){
					closeMenu = false;
				}
				if(closeMenu && menuitem.close) menuitem.close();
			}
		}
	}
} 
class GroupedButtonTab {
	constructor(className, title){
		this.buttons = [];
		
		this.html = $('<div class="toolbar-item toolbar-grouped-button" data-toolbar-class=' + className + '>\
			<span class=" toolbar-item-text toolbar-tab" style="">' + title + '</span>\
			<div class="toolbar-tab-buttons items-hidden" style="">\
			</div>\
		');
		this.buttonText = $(this.html).find(".toolbar-item-text");
		this.buttonText[0].addEventListener("click",  (function(e){
			console.log("Button");
			this.getToolbar().closeAllMenuesExcept(this);
			if(this instanceof MenuButton){
				$(e.target).closest(".toolbar-item").find(".toolbar-item-text").toggleClass("active");
			} 
			$(e.target).closest(".toolbar-item").find(".toolbar-tab-buttons").toggleClass("items-shown");
			$(e.target).closest(".toolbar-item").find(".toolbar-tab-buttons").toggleClass("items-hidden");
		}).bind(this));
	};
	setToolbar(toolbar){
		this.toolBar = toolbar;
		for(var i = 0; i < this.buttons.length; i++){
			var button = this.buttons[i];
			button.setToolbar(toolbar);
		}
	};
	getToolbar(){
		return this.toolBar;
	};
	addButton(button){
		this.buttons.push(button);
		button.setParent(this);
		return this;
	};
	getButtons(){
		return this.buttons;
	};
	close(){
		$(this.html).closest(".toolbar-item").find(".toolbar-tab-buttons").removeClass("items-shown");
		$(this.html).closest(".toolbar-item").find(".toolbar-tab-buttons").addClass("items-hidden");
	};
	render(parent){
		parent.append(this.html);
		for(var i = 0; i < this.buttons.length; i++){
			var button = this.buttons[i];
			button.render(this.html.find(".toolbar-tab-buttons"));
		}
	}
}
/**
 * Class names:
 * 	toolbar-item :
 * 		Items visible on .toolbar. It can be a button or text.
 * 
 * 	toolbar-item-text :
 * 		Button it self. i.e MenuButton would have a Button and a menu attach to it. Button that displays on
 * 		toolbar has this class name.
 * 
 * 	dropdown :
 * 		This is the part that drops down when you click on the menu. It can be anything child class should
 * 		handle all the event on a dropdown. HTMLElement with class name dropdown is implemented by subclasses.
 */
class Button {
	constructor(className, text){

		this.html = $('<div class="toolbar-item" data-toolbar-class=' + className + 
				'><span class="toolbar-item-text button-hook">' + text + '</span></div>');
		
		this.buttonText = $(this.html).find(".toolbar-item-text");
		this.buttonText[0].addEventListener("click",  (function(e){
					console.log("Button");
					this.getToolbar().closeAllMenuesExcept(this);
					if(this instanceof MenuButton) $(e.target).closest(".toolbar-item").find(".toolbar-item-text").toggleClass("active");
					$(e.target).closest(".toolbar-item").find(".dropdown").toggleClass("items-shown");
					$(e.target).closest(".toolbar-item").find(".dropdown").toggleClass("items-hidden");
				}).bind(this));
		this.clickHandler = null;
		this.menuHTML = null;
		this.toolBar = null;
	};
	setParent(parent){
		this.parent = parent;
	};
	getParent(){
		return this;
	};
	setToolbar(toolbar){
		this.toolBar = toolbar;
	};
	getToolbar(){
		return this.toolBar;
	};
	getHTML() {
		return this.html;
	};
	render(parent) {
		parent.append(this.getHTML());
	};
	close(){
		$(this.html).find(".toolbar-item-text").removeClass("active");
	};
	addClass(targetElementClassName, className){
		$(this.html).find("." + targetElementClassName).addClass(className);
	};
	/**
	 * Add class to inner span
	 */
	addImageClass(){
		this.addClass("toolbar-item-text", "image-only");
	}; 
	addIconClass(){
		this.addClass("toolbar-item-text", "icon-only");
	};
	addEmptySpaceClass(){
		this.addClass("toolbar-item-text", "empty-space");
	};
	addBackgroundColorToItem(color){
		this.getHTML().find(".toolbar-item-text img").css("background-color", color)
	};
	addEventListener(handler) {
		this.clickHandler = handler;
		this.buttonText[0].addEventListener("click", this.clickHandler);	
	};
	removeEventListener() {
		this.buttonText[0].removeEventListener("click", this.clickHandler);
	};
}

class ToolbarItemSeperator {
	constructor(){
		this.html = $('<div class="toolbar-seperator"></div>');
	};
	getHTML() {
		return this.html;
	};
};


class MenuButton extends Button {
	constructor(className, title, isDisplayToLeft){
		super(className, title); 
		var displayPositionClassName = (isDisplayToLeft)?"align-item-right":"";
		this.menuItems = [];
		this.html.append($('<div class="dropdown-menu-outer dropdown items-hidden">\
				<div class="toolbar-menu-hinge">\
				</div>\
				<div class="toolbar-menu ' + displayPositionClassName + '">\
					<div class="toolbar-menu-item-container">\
						' +
					'</div>\
				</div>\
				</div>\
			'));
		this.menu = this.html.find(".toolbar-menu-item-container");
	};
	addMenuItem(item){
		this.menuItems.push(item);
	};
	render(parent) {
		parent.append(this.html);
		for(var i = 0; i < this.menuItems.length; i++){
			var item = this.menuItems[i];
			item.render(this.menu);
		}
	}
	close(){
		super.close();
		$(this.html).closest(".toolbar-item").find(".dropdown").removeClass("items-shown");
		$(this.html).closest(".toolbar-item").find(".dropdown").addClass("items-hidden");
	};
};


class MenuItem {
	constructor(){
		this.listeners = new Array;
		this.htmlNode = null;
	};
	getHTMLNode(){
		return this.htmlNode;
	};
	addEventListener(listener){
		this.listeners.push(listener);
	}
	render(parent){
		parent.append(this.getHTMLNode());
	}
}
class TextItem extends MenuItem {
	constructor(label){
		super();
		this.htmlNode = $('<div class="textitem-container menu-item" style="display:block">\
				<div class="textitemLabel item-label"><span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span> ' + label + '</div>\
				</div>');
		this.htmlNode.on("click", (function(e){
			for(var i = 0; i < this.listeners.length; i++){
				var callback = this.listeners[i];
				callback(e); 
			}
        }).bind(this))
	}
}
class EmptyMenuItem extends MenuItem {
	constructor(){
		super();
		this.htmlNode = $('<div class="textitem-container menu-item" style="display:block">\
					<div class="textitemLabel item-label"></div>\
				</div>');
		this.htmlNode.on("click", (function(e){
			for(var i = 0; i < this.listeners.length; i++){
				var callback = this.listeners[i];
				callback(e); 
			}
        }).bind(this))
	}
}
class ColorPicker extends MenuItem {
	constructor(initialColor, label){
		super();
		if(label){
			this.htmlNode = $('<div class="colorpicker-container menu-item" style="display:block">\
				<div class="colorpickerLabel item-label">' + label + '<span class="colorpickerValue item-value">' +initialColor  + '</span></div>\
				<div class="colorpicker-element"></div>\
				</div>');
		}else{
			this.htmlNode = $('<div class="colorpicker-container menu-item">\
				<div class="colorpicker-element"></div>\
				<div class="colorpickerValue">' + initialColor + '</div></div>');
		}
		var picker = $('<div id="colorpicker" class="inl-bl"></div>');
		$(this.htmlNode.find(".colorpicker-element")).colorpicker({
            color: initialColor ? initialColor : '#ffFFFF',
            container: true,
            inline: true,
            format: "rgba",
            colorSelectors: {
                'black': '#000000',
                'white': '#ffffff',
                'red': '#FF0000',
                'default': '#777777',
                'primary': '#337ab7',
                'success': '#5cb85c',
                'info': '#5bc0de',
                'warning': '#f0ad4e',
                'danger': '#d9534f'
            }
        });
        this.htmlNode.find(".colorpicker-element").on("changeColor", (function(e){
        	this.getHTMLNode().find(".colorpickerValue").text(rgbaObjectToCSSRGBAColorString(e.color.toRGB()));
        	for(var i = 0; i < this.listeners.length; i++){
				var callback = this.listeners[i];
				callback(e);
			}
        }).bind(this))
	};
}
class Seekbar extends MenuItem {
	constructor(initialValue, maxValue, text, unit = '%', expectedWidth){
		super();
		this.unit = unit;
		if(text){
			this.htmlNode = $('<div class="seekbar-container menu-item" style="display:block">\
				<div class="seekbarLabel item-label">' + text + '<span class="seekbarValue  item-value">' +initialValue + '' + unit + '</span></div>\
				<div class="seekbar-element"></div>\
				</div>');
		}else{
			this.htmlNode = $('<div class="seekbar-container menu-item">\
				<div class="seekbar-element"></div>\
				<div class="seekbarValue">' + initialValue + '</div></div>');
		}
		$( this.htmlNode.find(".seekbar-element") ).slider(
			{
				slide : (this._handleSeekbarUpdates).bind(this),
				value: initialValue,
				max : maxValue
			}
		);
		$( this.htmlNode.find(".seekbar-element") ).css("minWidth", 400);
	};
	_handleSeekbarUpdates(e, ui){
		this.getHTMLNode().find(".seekbarValue").text(ui.value + "" + this.unit);
		for(var i = 0; i < this.listeners.length; i++){
			var callback = this.listeners[i];
			callback(e, ui); 
		}
	}
}


/*
var toolbar = new ToolbarHelper();
var button = new MenuButton("color", "Color");
var button1 = new MenuButton("spacing", "Spacing");
toolbar.addButton(button);
toolbar.addButton(button1);

var colorpicker = new ColorPicker('rgba(51,122,183,1)', "Background color");
button.addMenuItem(colorpicker);

colorpicker.addEventListener(function(e){
	console.log(rgbaObjectToCSSRGBAColorString(e.color.toRGB()));
});


var seekbar = new Seekbar(50, 100, "Border spacing" ,"%",400);
button1.addMenuItem(seekbar);
*/

/*

	Class name <dragging> added to moving element so that when mouse released React component can get
	what was moving by class <dragging>.

*/
function generateHTMLFromModel(modelObject){
	var type = modelObject["type"];
	var div = document.createElement("div");
	if(type == ModelClassNames.image.type){
		var img = document.createElement("img");
		img.src = modelObject["url"];
		div.appendChild(img);
		div.className = "imageContainer";
	}else{
		if(ModelClassNames[type]) div.className = ModelClassNames[type].type;
	}
	
	if(modelObject["style"]){
		var styles = Object.getOwnPropertyNames(modelObject["style"]);
		for(var i = 0; styles && i < styles.length; i++){
			var style = styles[i];
			div.style[style] = modelObject["style"][style];
		}
	}
	var children = modelObject[type];
	for(var i = 0; children && i < children.length; i++){
		div.appendChild(generateHTMLFromModel(children[i]));
	}
	return div;
}
/*
	CSS Class name uses:
		dragging : 	
			Added to the current dragging helper, this disable mouse event from shadowing. This makes
			MouseEvents to penatrates though helper HTMLElement
		 
		droppable :
			Added to the helper HTMLElement create by jQuery draggable so that when we drop, we can get the
			dropped element from the DOM
 */
window.droppableMap = new Map();
class DroppableComponent {
	constructor(model){
		this.mapKey = getRandomNumbers();
		this.model = model;
		this.element = this.generateHTMLFromModel(model);
		droppableMap.set(this.mapKey, btoa(JSON.stringify(model)));
		$(this.element).attr("data-droppableMap-search-key", this.mapKey).addClass("droppable").addClass("sidepanel-draggable-element");
		$(this.element).prepend($('<div class="showOverlayHelpText">Drag and drop to canvas</div>'));
		this.handleMousedownEvent = this.handleMousedownEvent.bind(this);
		this.handleMouseupEvent = this.handleMouseupEvent.bind(this);
		this.handleMousemoveEvent = this.handleMousemoveEvent.bind(this);
		this.element.addEventListener('grab', this.handleMousedownEvent);
		this.element.addEventListener('drop', this.handleMouseupEvent);
		this.element.addEventListener('move', this.handleMousemoveEvent);
	};
	addClass(className){
		$(this.element).addClass(className);
	};
	getJElement(){
		return $(this.element);
	};
	handleMousedownEvent(e,ui){
		this.activateAllDropZones();
		e.detail.nativeUI.helper.css("position", "absolute")
		.css("zIndex",9999999999999).css("pointerEvents", "none"); // .css("backgroundColor", "red")
		e.detail.nativeUI.helper.find(".showOverlayHelpText").hide();
		e.detail.nativeUI.helper.addClass("dragging");
		$(e.detail.nativeEvent.target).addClass("draggingSrc");
		$(e.detail.nativeUI.helper).addClass("draggingSrc");
	};
	handleMouseupEvent(e,ui){
		this.deactivateAllDropZones();
		e.detail.nativeUI.helper.removeClass("dragging");
		$(e.detail.nativeEvent.target).removeClass("draggingSrc");
		$(e.detail.nativeUI.helper).removeClass("draggingSrc");
		var type = this.model.type;
		var point = this.getEventClientPoint(e.detail.nativeEvent);
		if(type == ModelClassNames.image.type){
			var hoveringOverElement = this.getElementOfTypeByPoint(ModelClassNames.image, point.clientX, point.clientY);
			this.fireCustomEventOnElement(hoveringOverElement, this.createEvent("component-dropped", this.model, {e : e, ui : ui}));
		}else if(type == ModelClassNames.fixedCollageContainer.type){
			var hoveringOverElement = this.getElementOfTypeByPoint(ModelClassNames.fixedCollageContainer, point.clientX, point.clientY);
			this.fireCustomEventOnElement(hoveringOverElement, this.createEvent("component-dropped", this.model, {e : e, ui : ui}));
		}else if(type == ModelClassNames.editableText.type){
			var hoveringOverElement = this.getElementOfTypeByPoint(ModelClassNames.editableText, point.clientX, point.clientY);
			this.fireCustomEventOnElement(hoveringOverElement, this.createEvent("component-dropped", this.model, {e : e, ui : ui}));
		}else if(type == ModelClassNames.collageContainer.type){
			
		}else if(type == ModelClassNames.shapeCircle.type){
			var hoveringOverElement = this.getElementOfTypeByPoint(ModelClassNames.shapeCircle, point.clientX, point.clientY);
			this.fireCustomEventOnElement(hoveringOverElement, this.createEvent("component-dropped", this.model, {e : e, ui : ui}));
		}

	};
	/**
	 * Trigger a custom event on a given HTMLElement
	 * @param {HTMLElement} element 
	 * @param {CustomEvent} event 
	 */
	fireCustomEventOnElement(element, event){
		element.dispatchEvent(event);
	};
	/**
	 * Return the HTMLElement stack (Bottom up on DOM Tree) under a point identified by clientX and clientY
	 * @param {Number} clientX 
	 * @param {Number} clientY 
	 */
	getElementsStackFromPoint(clientX, clientY, selector){
		var tselector = selector ? selector: ".multipage";
		return elementsFromPoint(clientX, clientY, document, tselector);
	};
	/**
	 * Return the HTMLElement, if exist, under a point in client viewport
	 * @param {ModelClassNames} type : a model type defined on ModelClassNames object
	 * @param {Number} clientX 
	 * @param {Number} clientY 
	 */
	getElementOfTypeByPoint(type, clientX, clientY){
		var catcherClasses = "." + type.catchers.join(", .");
		var elStack = this.getElementsStackFromPoint(clientX, clientY);
		for(var i= 0; i < elStack.length; i++){
			if($(elStack[i]).is(catcherClasses)){
				return elStack[i];
			}
		}
		return null;
	}
	/*
		Events such as double tap are not actual events thus they are created as an artificial 
		event type and their naturalEvent contains the last touchend event.
	*/
	createEvent(eventType, model, other){
		var cevent = new CustomEvent(eventType, {detail : {
			model : model,
			other : other
		}})
		return cevent;
	};

	handleMousemoveEvent(e,ui){
		//console.log(e);
	};
	activateAllDropZones(){
		$(".dropzone").addClass("active");
	}
	deactivateAllDropZones(){
		$(".dropzone").removeClass("active");
	};
	setDeletable(isDeletable){
		if(isDeletable && $(this.element).find("deletable-delete-cross").length > 0){
			return;
		}else if(!isDeletable && $(this.element).find("deletable-delete-cross").length > 0){
			$(this.element).find("deletable-delete-cross").remove();
			return;
		}
		$(this.element).append("<span class='deletable-delete-cross'></span>");
		$(this.element).find(".deletable-delete-cross")[0].addEventListener("click", function(e){
			$(this.element).remove();
			var url = '//s3.photojoiner.net/PJ/file?action=delete&path=' + this.model.path;
			$.ajax({
				url : url,
			});
		}.bind(this));
	};
	getElement(){
		return this.element;
	};
	getEventClientPoint(event){
		if(event.type.match("touch")){
			return {
				clientX : event.changedTouches[0].clientX,
				clientY : event.changedTouches[0].clientY
			}
		}
		return {
			clientX : event.clientX,
			clientY : event.clientY
		}
	}
	generateHTMLFromModel(modelObject){
		var type = modelObject["type"];
		var div = document.createElement("div");
		if(type == ModelClassNames.image.type){
			var img = document.createElement("img");
			img.src = modelObject["url"];
			div.appendChild(img);
			div.className = "imageContainer";
		}else if(type == ModelClassNames.editableText.type){
			var span = document.createElement("span");
			span.textContent  = modelObject["sampleText"];
			div.appendChild(span);
			div.className = "textContainer";
		}else{
			div.className = ModelClassNames[type].type;
		}
		
		if(modelObject["style"]){
			var styles = Object.getOwnPropertyNames(modelObject["style"]);
			for(var i = 0; styles && i < styles.length; i++){
				var style = styles[i];
				div.style[style] = modelObject["style"][style];
			}
		}
		var children = modelObject[type];
		for(var i = 0; children && i < children.length; i++){
			div.appendChild(generateHTMLFromModel(children[i]));
		}
		return div;
	}
}
/*
	top : offset top in client area
*/
class MultipageEventProcess {
	constructor(multipageElement){
		/*
			Use this valiable to detect double tap. this is set and cleard by touchendHandler
		*/
		this.tapped = false;
		/*
			current attached element from touch start/end or mouse down/up
		*/
		this.startTarget = null;
		this.endTarget = null;
		this.path = null;
		
		//this.multipageElement = multipageElement;
		//this.documentElement = $(multipageElement).closest(".document");
		window.addEventListener("mousedown", this.mousedownHandler.bind(this));
		window.addEventListener("mouseup", this.mouseupHandler.bind(this));

		window.addEventListener("touchstart", this.touchstartHandler.bind(this));
		window.addEventListener("touchend", this.touchendHandler.bind(this));

		window.addEventListener("click", this.clickHandler.bind(this));
		window.addEventListener("dblclick", this.dblclickHandler.bind(this));

		this.top = 0
		this.left = 0
	};

	mousedownHandler(event){
		this.saveEventDetails(event);
		console.log(event);
	};
	mouseupHandler(event){
		this.clearEventDetails();
		console.log(event);
	};
	touchstartHandler(event){
		this.saveEventDetails(event);
		console.log(event);
	};
	touchendHandler(event){
		this.clearEventDetails();
		console.log(event);
		if(this.tapped){
			var customEvent = this.createEvent(event, "dblclick", "Double tap occered");
			var clientX = event.changedTouches[0].clientX;
			var clientY = event.changedTouches[0].clientY;
			this.fireCustomEventOnElement(this.getHTMLElementUnderPoint(clientX, clientY), customEvent);
		}
		setTimeout(function(e){
			this.tapped = false;
		}.bind(this), 500);
		this.tapped = true;
	};
	clickHandler(event){
		this.saveEventDetails(event);
		console.log(event);
	};
	dblclickHandler(event){
		this.saveEventDetails(event);
		console.log(event);
	};
	saveEventDetails(event){
		this.path = _.clone(event.path);

		this.target = this.getHTMLElementUnderPoint(this.getEventClientPoint(event).clientX, this.getEventClientPoint(event).clientY)
		console.log(this.target);
	};
	clearEventDetails(){
		this.path = null;
		this.target = null;
	};
	getEventClientPoint(event){
		if(event.type.match("touch")){
			return {
				clientX : event.changedTouches[0].clientX,
				clientY : event.changedTouches[0].clientY
			}
		}
		return {
			clientX : event.clientX,
			clientY : event.clientY
		}
	}
	isEventWithinVisibleDocument(e){
		console.log(e);
	};
	isEventWithinVisiblePotionOfElementByClassName(e, className){
		var el = $("." + className)[0];
		el.getBoundingClientRect()
		console.log(e);
	};
	getRect(element){
		return {
			top : element.getBoundingClientRect().top,
			left : element.getBoundingClientRect().left,
			width : element.getBoundingClientRect().width,
			height : element.getBoundingClientRect().height,
			right : element.getBoundingClientRect().right,
			bottom : element.getBoundingClientRect().bottom,
		}
	};
	getHTMLElementUnderPoint(clientX, clientY){
		return document.elementFromPoint(clientX, clientY);
	};
	fireCustomEventOnElement(element, event){
		console.log({msg : "Fired custom event", element : element, event: event})
		element.dispatchEvent(event);
	};
	/*
		Events such as double tap are not actual events thus they are created as an artificial 
		event type and their naturalEvent contains the last touchend event.
	*/
	createEvent(event, eventType, eventMSG){
		var cevent = new CustomEvent(eventType, {detail : {
			nativeEvent : event,
			eventMSG : eventMSG
		}})
		return cevent;
	};
	isPointWithInRectangle(point, rectangle){
		return this.isPointCoordinatesWithInRectangleCoordinates(point.x,point.y,rectangle.left,rectangle.top,rectangle.width,rectangle.height);
	};

	isPointCoordinatesWithInRectangleCoordinates(pointX,pointY, RectX, RectY, RectW,RectH){
		if((pointX > RectX && pointX < (RectX + RectW)) && (pointY > RectY && pointY < (RectY + RectH))){
			return true;
		}
		return false;
	};
}




function getAllHTMLElementOfMultipageUnderAPoint(clientX, clientY){
	varmultipagedoc = document.getElementsByClassName("multipage")[0];
	var queue = new Array();
	queue.push(multipage);
	for(var i = 0; i < queue.length; i++){
		var element = queue.pop();
		for(var j = 0; j < element.children.length; j++){
			var childElement = element.children[j];
			queue.push(childElement);
		}
		var rect = element.getBoundingClientRect();
	}
}

var UploadedFile = Backbone.Model.extend({
	defaults : {

	},
	initialize() {
		this.on("change", function(){
			console.log("UploadedFile model changed.");
		});
	} 
});

var UploadedFileLibrary = Backbone.Collection.extend({
	model: UploadedFile,
	modelId: function(attrs) {
    	return attrs.f_id;
  	},
	addItemByJSONObject(fileModel){
		var droppableComponent = new DroppableComponent(fileModel);
		droppableComponent.addClass("image");
		droppableComponent.addClass("user-image");
		droppableComponent.addClass("deletable-content");
		droppableComponent.setDeletable(true);
		droppableComponent.getJElement().attr("data-fid", fileModel.f_id);
		var uploadedFile = new UploadedFile({
			f_id : fileModel.f_id,
			droppableComponent : droppableComponent,
		});
		this.add(uploadedFile);
		
	},
	initialize(){
		this.on("add", function(file) {
			console.log(file);
			$('.uploads-pane-content').append(file.get("droppableComponent").getJElement());
			file.get("droppableComponent").getJElement().draggable(draggableInput);
		});
	}
});



var fileLibrary = new UploadedFileLibrary();

var draggableInput = {
	containment: "body", 
	scroll: false,
	appendTo: "body",
	helper: "clone",
	addClasses : false,
	start : function(e, ui){
		var customEvent = new CustomEvent('grab', {detail : { 'nativeEvent': e, 'nativeUI': ui, 'target' : e.target }});
		// Dispatch the event.
		e.target.dispatchEvent(customEvent);
		
		 
	},
	stop : function(e, ui){
		var customEvent = new CustomEvent('drop', {detail : { 'nativeEvent': e, 'nativeUI': ui, 'target' : e.target }});
		// Dispatch the event.
		e.target.dispatchEvent(customEvent);
	},
	drag : function(e, ui){
		var customEvent = new CustomEvent('move', {detail : { 'nativeEvent': e, 'nativeUI': ui, 'target' : e.target }});
		// Dispatch the event.
		e.target.dispatchEvent(customEvent);
	}
};
for(var i = 0; i < grids.length; i++){
	var m = grids[i];
	var frame = new DroppableComponent(m);
	frame.addClass("frame");
	frame.addClass("fill-container");
	$('.layout-pane-content').append(frame.getElement());
	frame.getJElement().draggable(draggableInput);
}


// add layout search function
$(".layoutSearchBox").keyup(function(e){
	var number = parseInt($(e.target).val()) || 0;
	if(number){
		var frames = $(".frame");
		for(var i = 0; i < frames.length; i++){
			var frame = frames[i];
			if($(frame).find(".collageCell").length == number){
				$(frame).fadeIn();
			}else{
				$(frame).fadeOut();
			}
		}
	}else{
		$(".frame").fadeIn();
	}
});

/********************************************************
 * 			TEXT ELEMENTS
 *******************************************************/

for(var i = 0; i < texts.length; i++){
	var m = texts[i];
	var frame = new DroppableComponent(m);
	frame.addClass("frame");
	frame.addClass("fill-container");
	$('.text-pane-content').append(frame.getElement());
	frame.getJElement().draggable(draggableInput);
}
/********************************************************
 * 			SHAPE ELEMENTS
 *******************************************************/

for(var i = 0; i < elements.length; i++){
	var m = elements[i];
	var frame = new DroppableComponent(m);
	frame.addClass("frame");
	frame.addClass("fill-container");
	$('.shapes-pane-content').append(frame.getElement());
	frame.getJElement().draggable(draggableInput);
}

var url = '//s3.photojoiner.net/PJ/file?action=list';
$.ajax({
	url : url,
	dataType: 'json',
	success : function(result){
		if(result instanceof Array && result.length){
			for(var i = 0; i < result.length; i++){
				var model = result[i];
				fileLibrary.addItemByJSONObject(model);
			}
		}else{
			for(var i = 0; i < images.length; i++){
				var m = images[i];
				var droppableComponent = new DroppableComponent(m);
				droppableComponent.addClass("image");
				droppableComponent.addClass("user-image");
				droppableComponent.addClass("deletable-content");
				droppableComponent.setDeletable(true);
				droppableComponent.getJElement().attr("data-fid", m.f_id);
				var uploadedFile = new UploadedFile({
					f_id : m.f_id,
					droppableComponent : droppableComponent,
				});
				fileLibrary.add(uploadedFile);
			}
		}
	}
});


//$('.layout-pane').perfectScrollbar();
//$('.editorPanel').perfectScrollbar();

class SideBarTabMenu {
	constructor(initialTabId){
		this.currentItemID = initialTabId;
		this.tabCount = $("menu .menu-tab").length;
		//Hide all panes initially
		var tempCount = this.tabCount;
		this.currentPane = $("div[data-pane="+ this.currentItemID + "]");
		this.currentPane.addClass("active");
	}
	showTab(tabID){
		if(tabID <= 0 || this.tabCount < tabID){
			console.log("Invalid tab. tabID: " + tabID)
			return;
		}
		if(tabID != this.currentItemID){
			$(".sidemenu-content-pane").removeClass("active");
			this.currentPane = $("div[data-pane="+ tabID + "]");
			var topPercent = ((this.currentPane.data("pane") * -100) + 100) + "%";
			var topPixel = (40 * (this.currentPane.data("pane") - 1)) + "px";
			// topPixel set to zero with new layout with display: absolute removed from scaletton
			topPixel= "0px";
			this.currentPane[0].style.top = "calc(" + topPercent + " - " + topPixel + ")";
			this.currentPane.addClass("active");
			this.currentItemID = tabID;

			//Reset tabs top
			var tempCount = this.tabCount;
			while(tempCount){
				if(tabID != tempCount){
					$("div[data-pane="+ tempCount + "]")[0].style.top = "0%";
					
				}
				tempCount--;
			}
		}
		
	}
}
var sideBarTabMenu = new SideBarTabMenu(1);

/**
 * Editable textbox
 */
class InputHandler {
	constructor(editor){
		this.editor = editor;
		window.editor = this.editor;
		var selObj = window.getSelection();
		var range	= {};
		try{
			range	= selObj.getRangeAt(0);
		}catch(e){
			console.log("Range is not available on selection.")
		}
		selObj.range = range;
		this.selection = selObj;
		window.selObj = selObj;
	};
	isCursorWithinAElement(){
		if(!this.selection.anchorNode){
			this.placeCursorAt(this.editor.children[0],0);
		}
		if(this.editor.isSameNode(this.selection.anchorNode) || (this.selection.anchorNode && this.selection.anchorNode.nodeName.match(/div/i))){
			return false;
		}else{
			return true;
		}
	};
	deleteSelection(){
		var startOffset = this.selection.range.startOffset;
		var startContainer = this.selection.range.startContainer;
		var endOffset = this.selection.range.endOffset;
		var endContainer = this.selection.range.endContainer;
		var returnVal = true; 
		try{
			if(endContainer.isSameNode(startContainer) && startOffset == endContainer){
				returnVal = true;
			}else {
				returnVal = false;
			}
		}catch(e){
			console.log("Could not remove the selection.");
		}
		this.selection.deleteFromDocument();
		return returnVal;
	};
	concatinateTextNodeWithinElements(element){
		var children = element.children;
		for(var i = 0; i < children.length; i++){
			var child = children[i];
			if(!!child.nodeName.match(/span/i)){
				// Concatinate all adjacent text nodes
				var childNodes = child.childNodes;
			}
		}
	}
	clean(){
		var childNodes = this.editor.childNodes;
		var invalidParentElements = [];
		for(var i = 0; i < childNodes.length; i++){
			var childNode = childNodes[i];
			if(!childNode.nodeName.match(/span/i)){
				// Concatinate all adjacent text nodes
				invalidParentElements.push(childNode);
			}
		}
		for(var i = 0; i < invalidParentElements.length; i++){
			var el = invalidParentElements[i];
			$(el).remove();
		}
		var childNodes = this.editor.childNodes;
		if(childNodes.length == 1 && childNodes[0].nodeName.match(/br/i)){
			childNodes[0].insertAdjacentHTML("<span>&nbsp;</span>");
			$(childNodes[0]).remove();
		}
		console.log("Cleaned.");
	};
	isEditorEmpty(){
		if(editor.children.length) return false;
		return true;
	};
	getNextSiblingElement(){
		if(this.editor.isSameNode(this.selection.focusNode)){
			// We need to go though chilren of editor and check previous index
			if(this.selection.focusOffset < this.editor.children.length){
				var nodeMatch = this.editor.children[this.selection.focusOffset];
				if(nodeMatch){
					return this.editor.children[this.selection.focusOffset];
				}
			}else{
				return null;
			}
		}else{
			return this.selection.focusNode.nextElementSibling;
		}
	};
	getPreviousSiblingElement(){
		if(this.editor.isSameNode(this.selection.focusNode)){
			// We need to go though chilren of editor and check previous index
			if(this.selection.focusOffset - 2 >= 0){
				var nodeMatch = this.editor.children[this.selection.focusOffset - 2];
				if(nodeMatch){
					return this.editor.children[this.selection.focusOffset - 2];
				}
			}else{
				return null;
			}
		}else{
			return this.selection.focusNode.previousElementSibling;
		}
	};
	placeCursorAt(startNode,startOffset){
		var sel = window.getSelection();
		sel.collapse(startNode, startOffset);
	};
	isEditorContainASpan(){
		for(var i = 0; i < editor.children.length; i++){
			if(editor.children[i].nodeName.match(/span/i)){
				return true;
			}
		}
		return false;
	};
	removePrevious(){
		console.log("Request to remove previous by pressing backspace.");
		if(!this.deleteSelection()){
			if(this.selection.anchorNode.nodeName.match(/span/i) || this.selection.anchorNode.nodeName.match(/br/i)){
				console.log("\tCursor is not in a TEXT_NODE. Moving the cursor to previus node and calling forwardDelete");
				this.placeCursorAt(this.selection.anchorNode.childNodes[this.selection.anchorOffset-1]);
				document.execCommand("forwardDelete");
			}else if(this.selection.anchorNode.nodeType == Node.TEXT_NODE){
				console.log("\tCursor is in a TEXT_NODE. Moving the cursor to previus node and calling forwardDelete");
				if(this.selection.anchorOffset != 0){
					this.placeCursorAt(this.selection.anchorNode, this.selection.anchorOffset - 1);
					document.execCommand("forwardDelete");
				}else{
					var previousSibling = this.selection.anchorNode.previousSibling;
					if(previousSibling){
						this.placeCursorAt(previousSibling, previousSibling.length);
						document.execCommand("forwardDelete");
					}
				}
			}
		}else{
			console.log("\tDetected a range selection. Deleted range.");
		}
	};
	removeNext(){
		console.log("Request to remove next by pressing delete.");
		if(!this.deleteSelection()){
			document.execCommand("forwardDelete");
		}else{
			console.log("\tDetected a range selection. Deleted range.");
		}
	};
	insertNewline(){
		// delete selection
		this.deleteSelection();
		console.log("Request a newline.");
		// insert BR
		if(this.selection.anchorNode.nodeName.match(/span/i)){
			console.log("\tCursor in parent span.");
			var newNode = document.createElement("br");
			this.selection.range.insertNode(newNode);
			this.placeCursorAt(newNode.nextSibling,0);
		}else{
			console.log("\tCursor is not in parent span.");
			if(this.selection.anchorNode.nodeName.match(/br/i)){
				var newNode = document.createElement("br");
				this.selection.anchorNode.insertAdjacentElement("afterend", newNode);
				this.placeCursorAt(newNode,0);
			}else if(this.selection.anchorNode.nodeType == Node.TEXT_NODE){
				console.log("\t\tCursor in a TEXT_NODE.");
				if(this.selection.anchorNode.textContent.length == this.selection.anchorOffset){
					console.log("\t\t\tCursor at end of TEXT_NODE.");
					var newNode = document.createElement("br");
					this.selection.anchorNode.after(newNode);
					newNode.insertAdjacentHTML("afterend", "&nbsp;");
					this.placeCursorAt(newNode.nextSibling,0);
				}else if(this.selection.anchorOffset == 0){
					var newNode = document.createElement("br");
					this.selection.anchorNode.before(newNode);
				}else{
					var newNode = document.createElement("br");
					this.selection.range.insertNode(newNode);
					this.placeCursorAt(newNode.nextSibling,0);
				}
			}
			console.log(this.selection);
		}
	};
	insertText(text){
		if(this.isCursorWithinAElement()){
			
			console.log(this.selection);
			console.log("Cursor with in a element.");
			this.deleteSelection();
			if(this.selection.anchorNode.nodeType == Node.TEXT_NODE){
				console.log("\tElement == TEXT_NODE.");
				this.selection.anchorNode.insertData(this.selection.anchorOffset, text);
				//Move cursor forward
				this.selection.collapse(this.selection.anchorNode,	this.selection.anchorOffset + text.length);
			}else if(this.selection.anchorNode.nodeName.match(/span/i) && this.selection.anchorNode.childNodes.length && this.selection.anchorNode.childNodes[this.selection.anchorOffset]){
				console.log("\tInside a SPAN that has children. Proceeding to check offset node.");
				var offsetNode = this.selection.anchorNode.childNodes[this.selection.anchorOffset];
				if(offsetNode && offsetNode.nodeType == Node.TEXT_NODE){
					console.log("\t\tOffset was a Text node. Inserting data into TextNode.");
					offsetNode.insertData(0, text);
					//Move cursor forward
					this.selection.collapse(offsetNode,	1);
				}else{
					console.log("\t\tOffset was not a Text node. Inserting a new TextNode.");
					var textNode = document.createTextNode(text);
					this.selection.anchorNode.insertBefore(textNode, offsetNode);
					this.placeCursorAt(textNode,	text.length);
				}
			}else if (this.selection.anchorNode.nodeName.match(/br/i)){
					var textNode = document.createTextNode(text);
					this.selection.anchorNode.after(textNode);
					this.placeCursorAt(textNode,	text.length);
				}else{
				console.log("\tElement not a text node.");
				var textNode = document.createTextNode(text);
				this.selection.anchorNode.insertBefore(textNode, this.selection.anchorNode.children[this.selection.anchorOffset - 1]);
				this.selection.collapse(this.selection.anchorNode, this.selection.anchorOffset + text.length);
			}
		}else{
			if(this.isEditorEmpty()){
				//Case 1:
				var span = document.createElement("span");
				span.innerText = text;
				this.editor.appendChild(span);
			}else if((this.getNextSiblingElement())){
				// Insert at the beggining of the next span
				var sibling = this.getNextSiblingElement();
				var textNode = document.createTextNode(text);
				if(sibling.children){
					sibling.insertBefore(textNode, sibling.firstChild);
					console.log("Sibling has children.");
					this.placeCursorAt(sibling, textNode.length);
				}else{
					sibling.appendChild(textNode);
					this.placeCursorAt(sibling, textNode.length);
					console.log("Sibling doesnt have children.")
				}
				console.log("Has next sibling");
			}else if((this.getPreviousSiblingElement())){
				// Insert at the end of the previous span
				var sibling = this.getPreviousSiblingElement();
				
				console.log("Has previous sibling");
			}else
				log("Cursor is not within a element.");
		}
	};
	isImmidiateSiblingToTheLeftSpan(){
		var node = "";
		if(this.editor.isSameNode(this.selection.anchorNode)){
			var anchorNode = this.selection.anchorNode;
			node = anchorNode.children[this.selection.anchorOffset];
		}else{
			//Current node is a TEXT_NODE
			if(this.selection.anchorNode.nodeType == Node.TEXT_NODE){
				//If TEXT_NODE's parent is the editor itself
				if(this.selection.anchorNode.parentNode.isSameNode(this.editor)){
				
				}
				//if parent is a span a SPAN
				else if(this.selection.anchorNode.parentNode.match(/span/i)){
					
				}
			}
			if(this.selection.anchorNode.nodeName.match(/span/i)){
				
			}
		}
		
		console.log(node);
	};
}


class SquareProfile {
    constructor(){
        // rotation angle in reference to origin coordinates
        this.theta_s = 0;	// in [rad] units
        // x and y coordinates of the square in reference to origin coordinates
        this.x_so = 0;
        this.y_so = 0;
        // width and height of the square
        this.w_s = 0;
        this.h_s = 0;		// NOTE: not used after initialization...
                            //		may be removed if not needed for other features
        // below holds the eight point positions relative to square coordinates
        this.x_s = [];
        this.y_s = [];
        // below holds the eight point positions relative to global origin
        this.x_i = [];
        this.y_i = [];
        for(var i = 0; i < 8; i++){
            this.x_s.push(0);
            this.y_s.push(0);
            this.x_i.push(0);
            this.y_i.push(0);
        }
        // below is the transformation matrix going from origin to square coordinates, T_s
        this.T_s = [];	// this is a 3x3 transformation matrix in reality
        for(var i = 0; i < 2; i++){
            this.T_s.push([]);
            for(var j = 0; j < 3; j++){
                this.T_s[i].push(0);
            }
        }
    }
};
window.loggerTemp = [];
class SquareTransform {
    main(X_MOUSE_TEST, Y_MOUSE_TEST,
    POINT_TEST,INIT_THETA_DEG, INIT_X_POS, INIT_Y_POS, INIT_WIDTH, INIT_HEIGHT){
		var Square = new SquareProfile();
		var test = {};
        test.input = (X_MOUSE_TEST + " : " + Y_MOUSE_TEST + " : " +
    POINT_TEST + " : " +INIT_THETA_DEG + " : " + INIT_X_POS + " : " + INIT_Y_POS + " : " + INIT_WIDTH + " : " + INIT_HEIGHT);
        
        // NOTE: refer to the document for different 'PHASE x' explanations
        // PHASE 1: initialization
        this.InitSquare(Square, INIT_THETA_DEG, INIT_X_POS, INIT_Y_POS, INIT_WIDTH, INIT_HEIGHT);
        var DEBUG_OUT = false;
		var TOTAL_PNTS_SQR = 8;
		var log = "";
        if(DEBUG_OUT){
            //--- FOR DEBUGGING PURPOSES ---/
            // print the initial x and y coordinates relative to square
            console.log("\n\ninitial coordinates relative to the square:");
			log = "";
			for (var i = 0; i < TOTAL_PNTS_SQR; i++) {
                log += (Square.x_s[i] + "\t");
			}
            console.log("\nx_s[] = " + log);
			log = "";
			for (var i = 0; i < TOTAL_PNTS_SQR; i++) {
                log += (Square.y_s[i] + "\t");
			}
            console.log("\ny_s[] = " + log);
            // print the initial x and y coordinates relative to global origin
            console.log("\n" );
			log = "";
			for (var i = 0; i < TOTAL_PNTS_SQR; i++) {
                log += (Square.x_i[i] + "\t");
			}
            console.log("\nx_i[] = " + log);
			log = "";
			for (var i = 0; i < TOTAL_PNTS_SQR; i++) {
                log += (Square.y_i[i] + "\t");
			}
            console.log("\ny_i[] = " + log);
        }


        // PHASE 2: graph the initial square on the screen using x_i[] and y_i[]
        // do nothing for now in this C program...
            
            
        //--- this is where you would enter the main loop to run the algorithm ---/
        // PHASE 3: grab the delta mouse vector (dx_m, dy_m) and point on the square (p_s) [1:8] that was chosen
        var dx_m = X_MOUSE_TEST;
        var dy_m = Y_MOUSE_TEST;
        var p_s = POINT_TEST;			// ranges from [1:8]
        // below variables hold the mouse delta values relative to square coordinates
        var dx_m_s
        var dy_m_s;
        
        
        // PHASE 4: transform the mouse vector from relative to origin to relative to square coordinates
        var output = this.TransToSquareCoord(Square, dx_m, dy_m, true, true);
        dx_m_s = output.x_out;
        dy_m_s = output.y_out;
        if(DEBUG_OUT){
            //--- FOR DEBUGGING PURPOSES ---/
            // print the transformed mouse delta values
            console.log("\n\ndx_m_s = " + dx_m_s + ", dy_m_s = " + dy_m_s);
        }
        
        
        // PHASE 5: update the position of the new selected point on the square using the mouse delta values
        Square.x_s[p_s-1] += dx_m_s;
        Square.y_s[p_s-1] += dy_m_s;
        
        
        // PHASE 6: update x- and y- axes
        // update the x-axis
        if ((p_s >= 2) && (p_s <= 4)) {
            for (var i = 1; i < 4; i++) {
                if (i == p_s-1) {
                    // do nothing...
                }
                else {
                    Square.x_s[i] = Square.x_s[p_s-1];
                }
            }
        }
        else if ((p_s >= 6) && (p_s <= 8)) {
            for (var i = 5; i < 8; i++) {
                if (i == p_s-1) {
                    // do nothing...
                }
                else {
                    Square.x_s[i] = Square.x_s[p_s-1];
                }
            }
        }
        // NOTE: below accounts for the fact that points 1 and 5 can only move in relative y-axis and cannot be moved in x-axis
        Square.x_s[0] = (Square.x_s[7] + Square.x_s[1]) / 2.0;
        Square.x_s[4] = (Square.x_s[5] + Square.x_s[3]) / 2.0;
        // update the y-axis
        if ((p_s == 1) || (p_s == 2) || (p_s == 8)) {
            // NOTE: can't use a for loop since not continuously numbered
            Square.y_s[0] = Square.y_s[p_s-1];
            Square.y_s[1] = Square.y_s[p_s-1];
            Square.y_s[7] = Square.y_s[p_s-1];
        }
        else if ((p_s >= 4) && (p_s <= 6)) {
            for (var i = 5; i < 8; i++) {
                if (i == p_s-1) {
                    // do nothing...
                }
                else {
                    Square.y_s[i] = Square.y_s[p_s-1];
                }
            }
        }
        // NOTE: below accounts for the fact that points 3 and 7 can only move in relative x-axis and cannot be moved in y-axis
        Square.y_s[2] = (Square.y_s[1] + Square.y_s[3]) / 2.0;
        Square.y_s[6] = (Square.y_s[7] + Square.y_s[5]) / 2.0;
        if(DEBUG_OUT){
            //--- FOR DEBUGGING PURPOSES ---/
            // print the new x and y coordinates relative to square
            console.log("\n\nnew coordinates relative to the square with mouse delta values:");
			log = "";
            for (var i = 0; i < TOTAL_PNTS_SQR; i++) {
                log +=  (Square.x_s[i] + "\t");
			}
			console.log("\nx_s[] = " + log);
			log = "";
            for (var i = 0; i < TOTAL_PNTS_SQR; i++) {
                log += (Square.y_s[i] + "\t");
			}
			console.log("\ny_s[] = " + log);

			
        }
        
        
        // PHASE 7: transform the eight point positions from relative to square coordiantes to relative to global origin
        for (var i = 0; i < TOTAL_PNTS_SQR; i++) {
            var output = this.TransToSquareCoord(Square, Square.x_s[i], Square.y_s[i], false, false);
            Square.x_i[i] = output.x_out;
            Square.y_i[i] = output.y_out;
        }
        if(DEBUG_OUT){
            //--- FOR DEBUGGING PURPOSES ---/
            // print the new x and y coordinates relative to global origin
            console.log("\n\nnew coordinates relative to the global origin with mouse delta values:");
			log = "";
			for (var i = 0; i < TOTAL_PNTS_SQR; i++) {
                log += (Square.x_i[i] + "\t");
			}
            console.log("\nx_i[] = " + log);
			log = "";
            for (var i = 0; i < TOTAL_PNTS_SQR; i++) {
                log += (Square.y_i[i] + "\t");
            }
			console.log("\ny_i[] = " + log);
			
			log = "";
			for (var i = 0; i < TOTAL_PNTS_SQR; i++) {
                log += ("(" + Square.x_s[i] + ", " + Square.y_s[i] + "), \t");
			}
			log += " : ";
			for (var i = 0; i < TOTAL_PNTS_SQR; i++) {
                log += ("(" + Square.x_i[i] + ", " + Square.y_i[i] + "), \t");
			}
			console.log("\nGraph = " + log);
		}
		log = "";
			for (var i = 0; i < TOTAL_PNTS_SQR; i++) {
                log += ("(" + Square.x_s[i] + ", " + Square.y_s[i] + "), \t");
			}
			test.center = (log.substring(0, log.length - 2 ));
			log = "";
			for (var i = 0; i < TOTAL_PNTS_SQR; i++) {
                log += ("(" + Square.x_i[i] + ", " + Square.y_i[i] + "), \t");
			}
			console.log("\nGraph = " + log);
			test.global = (log.substring(0, log.length - 2 ));
			loggerTemp.push(test);
        // PHASE 8: graph the newly transformed square using the new x_i and y_i point positions on the square
        
        
        // PHASE 9: wait for next user input and loop back to step 3 when user input is provided
        
            
        return Square;
    };


    InitSquare(Sqr, INIT_THETA_DEG, INIT_X_POS, INIT_Y_POS, INIT_WIDTH, INIT_HEIGHT){
        // initialize rotation angle in reference to origin coordinates
        Sqr.theta_s = INIT_THETA_DEG * (Math.PI / 180.0);
        
        // initialize x and y coordinates of the square in reference to origin coordinates
        Sqr.x_so = INIT_X_POS;
        Sqr.y_so = INIT_Y_POS;
        
        // initialize width and height of the square
        Sqr.w_s = INIT_WIDTH;
        Sqr.h_s = INIT_HEIGHT;
        
        // initialize the square transfomation matrix elements
        Sqr.T_s[0][0] = Math.cos(Sqr.theta_s);
        Sqr.T_s[1][0] = Math.sin(Sqr.theta_s);
        Sqr.T_s[0][1] = -Sqr.T_s[1][0];
        Sqr.T_s[1][1] = Sqr.T_s[0][0];
        Sqr.T_s[0][2] = Sqr.x_so;
        Sqr.T_s[1][2] = Sqr.y_so;
        
        // initialize the eight point positions on the square (both relative to square and global origin)
        var tempX = [0.0, -Sqr.w_s/2.0, -Sqr.w_s/2.0, -Sqr.w_s/2.0, 0.0, Sqr.w_s/2.0, Sqr.w_s/2.0, Sqr.w_s/2.0];
        var tempY = [Sqr.h_s/2.0, Sqr.h_s/2.0, 0.0, -Sqr.h_s/2.0, -Sqr.h_s/2.0, -Sqr.h_s/2.0, 0.0, Sqr.h_s/2.0];
        for (var i = 0; i < 8; i++) {
            Sqr.x_s[i] = tempX[i];
			Sqr.y_s[i] = tempY[i];
			
            var output = this.TransToSquareCoord(Sqr, Sqr.x_s[i], Sqr.y_s[i], false, false);
            Sqr.x_i[i] = output.x_out;
            Sqr.y_i[i] = output.y_out;
        }
        
        return;
    }
    TransToSquareCoord(Sqr, x_in, y_in, IsInverse, IsVector){
        var output = {
            x_out : 0,
            y_out : 0,
        }
        // compelte regular transformation if trans mat is not inversed
        if (!IsInverse) {
            output.x_out = Sqr.T_s[0][0]*x_in + Sqr.T_s[0][1]*y_in + Sqr.T_s[0][2];
            output.y_out = Sqr.T_s[1][0]*x_in + Sqr.T_s[1][1]*y_in + Sqr.T_s[1][2];
        }
        // complete transformation with inversed matrix
        else {
            output.x_out = Sqr.T_s[0][0]*x_in + Sqr.T_s[1][0]*y_in - (!IsVector)*(Sqr.T_s[0][0]*Sqr.T_s[0][2] + Sqr.T_s[1][0]*Sqr.T_s[1][2]);
            output.y_out = Sqr.T_s[0][1]*x_in + Sqr.T_s[1][1]*y_in - (!IsVector)*(Sqr.T_s[0][1]*Sqr.T_s[0][2] + Sqr.T_s[1][1]*Sqr.T_s[1][2]);
        }
        
        return output;
    }
}

