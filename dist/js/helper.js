/*******************************************************

	ToolbarHelper is a convinient class to add items to 
	Document's toolbar 

*******************************************************/

var BackboneModelHelper = function (backboneModel) {
	this.model = backboneModel;
};
BackboneModelHelper.prototype.findModelByCID = function (cid) {
	return this._findModelByCID(this.model, cid);
};
BackboneModelHelper.prototype._findModelByCID = function (model, cid) {
	if (model.cid == cid) {
		return model;
	} else {
		var children = model.get("children");
		for (var i = 0; i < children.length; i++) {
			var m = null;
			if (m = this._findModelByCID(children[i], cid)) {
				return m;
			}
		}
	}
};
BackboneModelHelper.prototype.getAllLeafModelsOfAModelByCID = function (cid) {
	return this._getAllLeafModelsOfAModelByCID(this._findModelByCID(this.model, cid), []);
};
BackboneModelHelper.prototype._getAllLeafModelsOfAModelByCID = function (model, arr) {
	if (model.get("children").length == 0 || model.get("children").length == 1 && Object.getOwnPropertyNames(model.get("children")[0]).length == 0) {
		return arr.push(model);
	} else {
		var children = model.get("children");
		for (var i = 0; i < children.length; i++) {
			this._getAllLeafModelsOfAModelByCID(children[i], arr);
		}
	}
	return arr;
};
BackboneModelHelper.prototype.getAllModelsOfAModelByType = function (cid, type) {
	return this._getAllModelsOfAModelByType(this._findModelByCID(this.model, cid), type, []);
};
BackboneModelHelper.prototype._getAllModelsOfAModelByType = function (model, type, arr) {
	if (model && model instanceof type) {
		return arr.push(model);
	} else {
		var children = model.get("children");
		for (var i = 0; i < children.length; i++) {
			this._getAllModelsOfAModelByType(children[i], type, arr);
		}
	}
	return arr;
};
BackboneModelHelper.prototype.getAllLeafModelsWithImageOfAModelByCID = function (cid) {
	return this._getAllLeafModelsWithImageOfAModelByCID(this._findModelByCID(this.model, cid), []);
};
BackboneModelHelper.prototype._getAllLeafModelsWithImageOfAModelByCID = function (model, arr) {
	if (model instanceof ModelRegistry.cellImage && (model.get("children").length == 0 || model.get("children").length == 1 && Object.getOwnPropertyNames(model.get("children")[0]).length == 0)) {
		arr.push(model);
	} else {
		var children = model.get("children");
		for (var i = 0; i < children.length; i++) {
			this._getAllLeafModelsWithImageOfAModelByCID(children[i], arr);
		}
	}
	return arr;
};
BackboneModelHelper.prototype.findParentOfModelByCID = function (cid) {
	return this._findParentOfModelByCID(this.model, cid, null);
};
BackboneModelHelper.prototype._findParentOfModelByCID = function (model, cid, parent) {
	if (model.cid == cid) {
		return parent;
	} else {
		var children = model.get("children");
		for (var i = 0; i < children.length; i++) {
			var m = null;
			if (m = this._findParentOfModelByCID(children[i], cid, model)) {
				return m;
			}
		}
	}
};
/*
	Does not include current model
*/
BackboneModelHelper.prototype.findParentChainOfModelByCID = function (cid) {
	return this._findParentChainOfModelByCID(this.model, cid);
};
BackboneModelHelper.prototype._findParentChainOfModelByCID = function (model, cid) {
	var parentChain = [];
	var m = undefined;
	while (m = this._findParentOfModelByCID(model, cid)) {
		parentChain.push(m);
		cid = m.cid;
	}
	return parentChain.reverse();
};

BackboneModelHelper.prototype.findParentModelOfTypeOfModelByCID = function (cid, type) {
	return this._findParentModelOfTypeOfModelByCID(this.model, cid, type);
};
BackboneModelHelper.prototype._findParentModelOfTypeOfModelByCID = function (model, cid, type) {
	var parentChain = [];
	var m = undefined;
	while (m = this._findParentOfModelByCID(model, cid)) {
		if (m instanceof type) {
			return m;
		}
		cid = m.cid;
	}
	return null;
};
/*
	Parent Element is of type ModelRegistry.element
*/
BackboneModelHelper.prototype.findParentElementOfModelByCID = function (cid) {
	var parents = this._findParentChainOfModelByCID(this.model, cid);
	parents.push(this.findModelByCID(cid));
	for (var i = parents.length - 1; i >= 0; i--) {
		var model = parents[i];
		if (model instanceof ModelRegistry.element) {
			return model;
		}
	}
};
/*
	Parent Element is of type ModelRegistry.element
*/
BackboneModelHelper.prototype.findParentPageOfModelByCID = function (cid) {
	var parents = this._findParentChainOfModelByCID(this.model, cid);
	parents.push(this.findModelByCID(cid));
	for (var i = parents.length - 1; i >= 0; i--) {
		var model = parents[i];
		if (model instanceof ModelRegistry.page) {
			return model;
		}
	}
};
/*
	This is the firstChild of ModelRegistry.element which is an element "virtually"
*/
BackboneModelHelper.prototype.findMovableElementOfModelByCID = function (cid) {
	var parents = this._findParentChainOfModelByCID(this.model, cid);
	parents.push(this.findModelByCID(cid));
	var prev = null;
	for (var i = parents.length - 1; i >= 0; i--) {
		var model = parents[i];
		if (model instanceof ModelRegistry.element) {
			return prev;
		}
		prev = model;
	}
};
/*******************************************************

	ToolbarHelper is a convinient class to add items to 
	Document's toolbar 

*******************************************************/
class ToolbarHelper {
	constructor() {
		this.className = "toolbar";
		this.$el = $(".toolbar");
		this.registry = new Array();
		if (!$(".toolbar").length) {
			console.error("Toolbar must be created inside DocumentView by ReactJS.");
			throw "Error: Toolbar creation failed.";
		}
		$(window).on("click", function (e) {
			if ($(e.target).closest("." + this.className).length == 0) {
				this.closeAllMenues();
			}
		}.bind(this));
	}
	clear() {
		this.$el.empty();
	}
	addButton(button) {
		this.$el.append(button.getHTML());
		this.addItemToRegistry(button);
		button.setToolbar(this);
	}
	addSeperator(seperator) {
		if (seperator) this.$el.append(seperator.getHTML());else {
			this.$el.append(new ToolbarItemSeperator().getHTML());
		}
	}
	getItemRegistry() {
		return this.registry;
	}
	addItemToRegistry(item) {
		this.registry.push(item);
	}
	closeAllMenues() {
		this.registry.forEach(menu => {
			if (menu.close) menu.close();
		});
	}
	closeAllMenuesExcept(menu) {
		this.registry.forEach(menuitem => {
			if (menu != menuitem && menuitem.close) menuitem.close();
		});
	}
}

class Button {
	constructor(className, text) {
		this.html = $('<div class="toolbar-item" data-toolbar-class=' + className + '><span class="toolbar-item-text button-hook">' + text + '</span></div>');
		this.buttonText = $(this.html).find(".toolbar-item-text");
		this.buttonText[0].addEventListener("click", function (e) {
			console.log("Button");
			this.getToolbar().closeAllMenuesExcept(this);
			if (this instanceof MenuButton) $(e.target).closest(".toolbar-item").find(".toolbar-item-text").toggleClass("active");
			$(e.target).closest(".toolbar-item").find(".dropdown").toggleClass("items-shown");
			$(e.target).closest(".toolbar-item").find(".dropdown").toggleClass("items-hidden");
		}.bind(this));
		this.clickHandler = null;
		this.menuHTML = null;
		this.toolBar = null;
	}
	setToolbar(toolbar) {
		this.toolBar = toolbar;
	}
	getToolbar() {
		return this.toolBar;
	}
	getHTML() {
		return this.html;
	}
	close() {
		$(this.html).find(".toolbar-item-text").removeClass("active");
	}
	addEventListener(handler) {
		this.clickHandler = handler;
		this.buttonText[0].addEventListener("click", this.clickHandler);
	}
	removeEventListener() {
		this.buttonText[0].removeEventListener("click", this.clickHandler);
	}
}
class ToolbarItemSeperator {
	constructor() {
		this.html = $('<div class="toolbar-seperator"></div>');
	}
	getHTML() {
		return this.html;
	}
};
class MenuButton extends Button {
	constructor(className, title) {
		super(className, title);
		this.html.append($('<div class="dropdown-menu-outer dropdown items-hidden"><div class="toolbar-menu-hinge">\
				</div>\
				<div class="toolbar-menu">\
					<div class="toolbar-menu-item-container">\
						' + '<div id="cp7" class="inl-bl"></div>' + '</div>\
				</div>\
				</div>\
			'));
		this.menu = this.html.find(".toolbar-menu-item-container");
	}
	addMenuItem(item) {
		this.menu.append(item.getHTMLNode());
	}
	close() {
		super.close();
		$(this.html).closest(".toolbar-item").find(".dropdown").removeClass("items-shown");
		$(this.html).closest(".toolbar-item").find(".dropdown").addClass("items-hidden");
	}
};
class MenuItem {
	constructor() {
		this.listeners = new Array();
		this.htmlNode = null;
	}
	getHTMLNode() {
		return this.htmlNode;
	}
	addEventListener(listener) {
		this.listeners.push(listener);
	}
}
class TextItem extends MenuItem {
	constructor(label) {
		super();
		this.htmlNode = $('<div class="textitem-container menu-item" style="display:block">\
				<div class="textitemLabel item-label"><span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span> ' + label + '</div>\
				</div>');
		this.htmlNode.on("click", function (e) {
			this.listeners.forEach(callback => {
				callback(e);
			});
		}.bind(this));
	}
}

class ColorPicker extends MenuItem {
	constructor(initialColor, label) {
		super();
		if (label) {
			this.htmlNode = $('<div class="colorpicker-container menu-item" style="display:block">\
				<div class="colorpickerLabel item-label">' + label + '<span class="colorpickerValue item-value">' + initialColor + '</span></div>\
				<div class="colorpicker-element"></div>\
				</div>');
		} else {
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
		this.htmlNode.find(".colorpicker-element").on("changeColor", function (e) {
			this.getHTMLNode().find(".colorpickerValue").text(rgbaObjectToCSSRGBAColorString(e.color.toRGB()));
			this.listeners.forEach(callback => {
				callback(e);
			});
		}.bind(this));
	}
}
class Seekbar extends MenuItem {
	constructor(initialValue, maxValue, text, unit = '%', expectedWidth) {
		super();
		this.unit = unit;
		if (text) {
			this.htmlNode = $('<div class="seekbar-container menu-item" style="display:block">\
				<div class="seekbarLabel item-label">' + text + '<span class="seekbarValue  item-value">' + initialValue + '' + unit + '</span></div>\
				<div class="seekbar-element"></div>\
				</div>');
		} else {
			this.htmlNode = $('<div class="seekbar-container menu-item">\
				<div class="seekbar-element"></div>\
				<div class="seekbarValue">' + initialValue + '</div></div>');
		}
		$(this.htmlNode.find(".seekbar-element")).slider({
			slide: this._handleSeekbarUpdates.bind(this),
			value: initialValue,
			max: maxValue
		});
		$(this.htmlNode.find(".seekbar-element")).css("minWidth", 400);
	}
	_handleSeekbarUpdates(e, ui) {
		this.getHTMLNode().find(".seekbarValue").text(ui.value + "" + this.unit);
		this.listeners.forEach(callback => {
			callback(e, ui);
		});
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
function generateHTMLFromModel(modelObject) {
	var type = modelObject["type"];
	var div = document.createElement("div");
	div.className = ModelClassNames[type];
	if (modelObject["style"]) {
		var styles = Object.getOwnPropertyNames(modelObject["style"]);
		for (var i = 0; styles && i < styles.length; i++) {
			var style = styles[i];
			div.style[style] = modelObject["style"][style];
		}
	}
	var children = modelObject[type];
	for (var i = 0; children && i < children.length; i++) {
		div.appendChild(generateHTMLFromModel(children[i]));
	}
	return div;
}

var properties = Object.getOwnPropertyNames(grids);

grids.forEach(m => {
	$('.layout-pane-content').append(generateHTMLFromModel(m));
});
//$('.layout-pane').perfectScrollbar();
//$('.editorPanel').perfectScrollbar();

class SideBarTabMenu {
	constructor(initialTabId) {
		this.currentItemID = initialTabId;
		this.tabCount = $("menu .menu-tab").length;
		//Hide all panes initially
		var tempCount = this.tabCount;
		this.currentPane = $("div[data-pane=" + this.currentItemID + "]");
		this.currentPane.addClass("active");
	}
	showTab(tabID) {
		if (tabID <= 0 || this.tabCount < tabID) {
			console.log("Invalid tab. tabID: " + tabID);
			return;
		}
		if (tabID != this.currentItemID) {
			$(".sidemenu-content-pane").removeClass("active");
			this.currentPane = $("div[data-pane=" + tabID + "]");
			var topPercent = this.currentPane.data("pane") * -100 + 100 + "%";
			var topPixel = 40 * (this.currentPane.data("pane") - 1) + "px";
			this.currentPane[0].style.top = "calc(" + topPercent + " - " + topPixel + ")";
			this.currentPane.addClass("active");
			this.currentItemID = tabID;

			//Reset tabs top
			var tempCount = this.tabCount;
			while (tempCount) {
				if (tabID != tempCount) {
					$("div[data-pane=" + tempCount + "]")[0].style.top = "0%";
				}
				tempCount--;
			}
		}
	}
}