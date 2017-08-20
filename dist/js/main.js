/*
	CSS Class name uses:
		catcher : 	
			HTMLElements with this class can catch other elements and do stuff with them.
			Used when we want to catch a dropped DroppableComponent.

		imageCatcher : 	
			These HTMLElements can catch droped image of type DroppableComponent.

		selectableParent : 
			Top most container of any components. This is the HTMLElement that get selected
			upon cliking or tapping on top of element.

		rotatable : 
			These HTMLElements can be rotated and they shows a rotate handler when selected.

		resizable : 
			HTMLElements displays resize handlers when selected and can be resized.

		movable :
			These HTMLElements can be moved freely around a page but not accross pages.


 */

Editor = Draft.Editor;
EditorState = Draft.EditorState;
window.debug = {
	trace: false
};
window.KEYS = {
	ENTER: 13,
	SHIFT: 16,
	CTRL: 17,
	ALT: 18,
	DELETE: 46
};
class ContentEditableView extends React.Component {}
class EditableTextView extends React.Component {
	constructor(props) {
		super(props);
		this.state = { editorState: EditorState.createEmpty() };
		this.onChange = editorState => this.setState({ editorState });

		this.touchstarted = false;
		this.onDoubleClick = this.onDoubleClick.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);

		this.control = this.control.bind(this);
		this.addDataToEditor = this.addDataToEditor.bind(this);

		this.insertData = this.insertData.bind(this);
		this.backspaceKey = this.backspaceKey.bind(this);
		this.deleteKey = this.deleteKey.bind(this);
		this.enterKey = this.enterKey.bind(this);

		this.innerContent = this.innerContent.bind(this);
	}
	componentWillMount() {
		this.props.data.on("change", $.proxy(function () {
			if (debug.trace) {
				console.log("EditableTextView: force updating");
			}
			this.forceUpdate();
		}, this));
	}

	componentDidMount() {
		console.log("Text component mounted");
		var div = $(ReactDOM.findDOMNode(this)).find(".editableContainer")[0];
		var span = $(ReactDOM.findDOMNode(this)).find("span")[0];
		//Add saved html to inner span
		var data = this.props.data.get("data") != "" ? this.props.data.get("data") : this.props.data.get("sampleText");
		span.innerHTML = data;

		var divRect = div.getBoundingClientRect();
		var style = this.props.data.get("style");
		if (parseInt(style.width) != parseInt(divRect.width) || parseInt(style.height) != parseInt(divRect.height)) {
			this.props.data.updateStyleByObject({
				width: divRect.width,
				height: divRect.height
			});
		}

		var editDiv = $(ReactDOM.findDOMNode(this)).find(".editableContainer");
		editDiv.on("paste", function (e) {
			this.addDataToEditor(e, e.originalEvent.clipboardData.getData("Text"));
		}.bind(this));

		//Load saved data
		if (this.props.data.get("data") == "") {} else {}
		//div.firstElementChild.innerHTML = this.props.data.get("data"); 

		/*
  */
	}
	componentWillUpdate(nextProps) {}
	/*shouldComponentUpdate(nextProps, nextState){
 	
 	console.log("shouldComponentUpdate");
 	var div = $(ReactDOM.findDOMNode(this)).find(".editableContainer")[0];
 	var spanRect = div.getBoundingClientRect();
 	var style = this.props.data.get("style");
 	console.log(style);
 	if(parseInt(style.width) != parseInt(spanRect.width) || parseInt(style.height) != parseInt(spanRect.height)){
 		this.props.data.updateStyleByObject({
 			width : spanRect.width,
 			height : spanRect.height,
 		});
 	}
 	if(div.getAttribute("contenteditable") == "true"){
 		console.log(e);
 	}
 	
 };*/
	handleFocus(event) {
		window.addEventListener("blur", this.handleBlur);
		console.log("%cAdded on blue event handler", "color:blue;font-size:18px");
	}

	handleBlur(event) {
		$(ReactDOM.findDOMNode(this)).find(".editableContainer").attr("contentEditable", "false");
		window.removeEventListener("blur", this.handleBlur);
		console.log("%cRemoved on blue event handler", "color:blue;font-size:18px");
	}
	// Handle changes to text container. IE add new text
	handleInput(event) {
		console.log("INPUTTED");
		$(ReactDOM.findDOMNode(this)).find(".editableContainer");
	}
	// Handle changes to text container. IE add new text
	handleChange(event) {
		console.log("CHANGED");
	}
	handleTouchStart(event) {
		if (this.touchstarted) {
			this.onDoubleClick();
		}
		this.touchstarted = true;
		setTimeout(function () {
			this.touchstarted = false;
		}.bind(this), 100);
	}
	handleTouchEnd(event) {}
	handleClick(event) {
		//var div = $("div[data-id=c22]").find(".editableContainer")[0];
		//setCaret(div);
		event.stopPropagation();
		//event.preventDefault();
		if ($(ReactDOM.findDOMNode(this)).find(".editableContainer").attr("contentEditable") == "true") {

			console.log(event);
		} else {
			this.props.handleChildElementClickEvent(event.currentTarget, event.nativeEvent, event, this.props.data);
		}
		//Check if user clicked on the element or did he drag the element.
		console.log("EditableTextView: handleClick");
	}
	handleMouseDown(event) {
		event.stopPropagation();
		//event.preventDefault();
		if ($(ReactDOM.findDOMNode(this)).find(".editableContainer").attr("contentEditable") == "true") {

			console.log(event);
		} else {
			event.stopPropagation();
			event.preventDefault();
			console.log("EditableTextView: handleMouseDown");
			this.props.handleChildElementMousedownEvent(event.currentTarget, event.nativeEvent, event, this.props.data);
		}
	}
	defautStyles() {
		return {
			"position": "absolute",
			"outline": "1px dashed transparent",
			"cursor": "move",
			"wordBreak": "break-word"
		};
	}
	styles() {
		var object = $.extend({}, this.props.data.get("style"), this.defautStyles());
		return {
			style: object,
			editableContainer: {
				"outline": "-webkit-focus-ring-color auto 0px",
				"wordBreak": "break-word",
				"overflowWrap": "break-word",
				"width": "100%",
				"height": "100%"
			}
		};
	}
	onDoubleClick() {
		$(ReactDOM.findDOMNode(this)).find(".editableContainer").attr("contenteditable", true);
		$(ReactDOM.findDOMNode(this)).find(".editableContainer").focus();
	}
	onKeyPress() {
		console.log("Key pressed.");
	}
	insertData1(e, data, isHTML) {
		var event = e.nativeEvent || e;
		event.preventDefault();
		event.stopPropagation();
		//Ignore events
		if (event.type == "keyup") {
			return;
		}
		var element = $(ReactDOM.findDOMNode(this)).find(".editableContainer");

		var selObj = window.getSelection();
		var range = selObj.getRangeAt(0);
		var startOffset = range.startOffset;
		var startContainer = selObj.focusNode;
		var newNode = "";
		if (isHTML) {
			newNode = $.parseHTML(data)[0];
		} else {
			// insert text at the cursor
			newNode = data;
		}
		/*
  	<span>My name is <br>Haritha<span>
  	Constraints:
  		1. Can not have empty <span></span>
  		2. Text can not reside outside of a <span>. Empty span must be deleted
  	
  	//Legends
  	[] <-- editor, X <-- cursor position
  	Cases table
  		1: [X] --> Nothing on the editor. 
  		2: [<span>aX</span>] --> One charactor on the editor
  		3: [<span>a</span>X</br>] --> Cursor before BR
  		4: [<span>a</span></br>X] or [<span>a</span></br>X</br>] --> Cursor after BR with nothing after it
  		5: [<span>a</span></br>X<span>a</span>] --> Cursor after a BR but before a SPAN
  	Note: Its easier to handle BACKSPACE, DELETE and ENTER, when we have specific cases
  	Cases in detail: 
  	Case 1: [X]
  		Nothing on the editor. 
  		Event:
  			1. Input plain text
  				Steps:
  				a) Create a SPAN
  				b) inset text on to new span
  				b) Place cursor at the end of SPAN
  			2. Input new line
  				Steps:
  				a) Create a BR 
  				b) Insert new BR
  				c) Place cursor at the end of BR
  			Case 2: [<span>aX</span>]
  		One charactor on the editor
  		Event:
  			1. Input plain text
  				Steps:
  				a) Add text to cursor location ( within existing span )
  			2. BACKSPACE
  				Steps:
  				a. Delete SPAN
  			3. ENTER
  				Steps:
  				a) Insert BR as next sibling
  				b) Place cursor at the end of BR
  	
  	Case 3: [<span>a</span>X</br>]
  		Cursor before BR
  		Event:
  			1. Input plain text
  				Steps:
  				a) if previous sibling is SPAN, add text to span
  				b) else create a SPAN and add text to it
  			2. BACKSPACE
  				a) if previous is BR, remove it
  				b) if previous SPAN only have one charactor, remove it
  				c) if previus is SPAN, remove last charactor
  			3. DELETE
  				a) remove current BR
  			Case 4: [<span>a</span></br>X] or [<span>a</span></br>X</br>]
  		Cursor after BR with nothing after it. No previous or next SPAN
  		Event:
  			1. Input plain text
  				a) Create new Span and add text to it.
  				b) Place cursor at the end of new span
  			2. BACKSPACE
  				a) Remove BR
  				b) If span exist, place cursor at the end of it.
  			3. DELETE
  				a) Remove BR if exist
  			3. ENTER
  				a) Insert a new BR
  				b) Place a cursor at the end of it
  			Case 5: [<span>a</span></br>X<span>a</span>]
  		Cursor after a BR but before a SPAN
  		Event:
  			1. Input plain text
  				a) Insert text at the beggining of the next sibling SPAN
  				c) place cursor after new text
  			2. BACKSPACE
  				a) Remove BR
  				b) Merge SPANs
  				c) Place cursor at the merged index
  			3. DELETE
  				a) Delete first charactor in the span
  				b) If SPAN is empty, remove it.
  			4. ENTER
  				a) Add a BR at the cursor 
  				b) Move cursor to the beggining of the new BR
  			General functions
  		1. isCursorWithinAElement()
  			Return false if cursor on an immidiate child of .editorContainer
  				else return the immidiate child that is parent to current cursor location
  		2. getCursorPositionWithinAElement(element)
  			Return index of cursor within a element.Ignores empty textNodes
  		3. getCurrentLeafElement() : returns leaf element that cursor is in
  		4. hasNextSibiling(element)
  		5. hasPrevSibiling(element)
  		6. getNextSibiling(element) : returns next sibiling
  		7. getPrevSibiling(element) : returns prev sibiling
  */

		var joinTextNodes = function (textNodeArray, from, to) {};
		var splitTextNodeAt = function (textNode, index) {};
	}
	addDataToEditor(e, data, isHTML) {
		var event = e.nativeEvent || e;
		event.preventDefault();
		event.stopPropagation();
		//Ignore events
		if (event.type == "keyup") {
			return;
		}
		var newNode = "";
		if (isHTML) {
			newNode = document.createElement(data);
		} else {
			newNode = document.createTextNode(data);
		}
		console.log("Event type: " + e.type + " : Data: " + data);
		var element = $(ReactDOM.findDOMNode(this)).find(".editableContainer");
		var selObj = window.getSelection();
		var range = selObj.getRangeAt(0);
		var startOffset = range.startOffset;
		var startContainer = selObj.focusNode;
		var dataLength = newNode.textContent.length;
		range.insertNode(newNode);
		selObj.extend(newNode, 1);
		selObj.collapse(newNode, 1);
		startContainer = newNode;
		// Find all textNodes
		var textNodes = function (parentEl, textArray) {
			if (parentEl.childNodes) {
				var i = 0;
				for (; i < parentEl.childNodes.length; i++) {
					var childEl = parentEl.childNodes[i];
					if (childEl.nodeType == Node.TEXT_NODE) {
						textArray.push(childEl);
					} else if (childEl.nodeType == Node.ELEMENT_NODE) {
						textNodes(childEl, textArray);
					}
				}
			}
		}.bind(this);
		var textArray = [];
		textNodes(element[0], textArray);
		var contentArray = textArray.filter(el => {
			if (el.textContent == "") {
				return false;
			}return true;
		});
		var text = "";
		var i = 0;
		var offset = 0;
		var endOffset = 0;
		var toggle = true;
		for (; i < contentArray.length; i++) {
			if (contentArray[i].isSameNode(selObj.focusNode)) {
				console.log("same node found at " + i);
			}
			text += contentArray[i].textContent;
		}

		//Find new offset
		for (i = 0; i < contentArray.length; i++) {
			if (startContainer.isSameNode(contentArray[i])) {
				endOffset += dataLength;
				break;
			} else {
				endOffset += contentArray[i].textContent.length;
			}
		}

		// Insert back
		//&#160;
		var newNode = document.createTextNode(text.replace(/ /ig, '\u0020'));
		selObj.selectAllChildren(element[0]);
		selObj.deleteFromDocument();
		selObj.getRangeAt(0).insertNode(newNode);
		selObj.collapse(element[0].firstChild, endOffset);
		//range.insert
	}
	insertData(e) {
		var editor = $(ReactDOM.findDOMNode(this)).find(".editableContainer")[0];
		var inputHandler = new InputHandler(editor);
		if (e.key.length == 1) {
			inputHandler.insertText(e.key);
		}
		inputHandler.clean();
	}
	backspaceKey() {
		var editor = $(ReactDOM.findDOMNode(this)).find(".editableContainer")[0];
		var inputHandler = new InputHandler(editor);
		inputHandler.removePrevious();
		inputHandler.clean();
	}
	deleteKey() {
		var editor = $(ReactDOM.findDOMNode(this)).find(".editableContainer")[0];
		var inputHandler = new InputHandler(editor);
		inputHandler.removeNext();
		inputHandler.clean();
	}
	enterKey() {
		var editor = $(ReactDOM.findDOMNode(this)).find(".editableContainer")[0];
		var inputHandler = new InputHandler(editor);
		inputHandler.insertNewline();
		inputHandler.clean();
	}
	control(e) {
		var debug = 2;
		var prevent = true;
		if (this.previousEvent == e) {
			this.previousEvent == e;
		}
		if (e.type == "drop") {} else if (e.key.length == 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
			this.insertData(e, e.key, false);
		} else if (e.key == "Enter") {
			this.enterKey();
		} else if (e.key == "Backspace") {
			this.backspaceKey();
		} else if (e.key == "Delete") {
			this.deleteKey();
		} else if (e.key.indexOf("rrow")) {
			prevent = false;
			var inputHandler = new InputHandler();
			inputHandler.isCursorWithinAElement();
			console.log(inputHandler.selection);
		}
		if (prevent) {
			e.preventDefault();
			e.stopPropagation();
		}
		// update parent height
		var editorSpan = $(ReactDOM.findDOMNode(this)).find(".editableContainer")[0].firstElementChild;
		var rect = editorSpan.getBoundingClientRect();
		var style = this.props.data.get("style");
		if (style.height != rect.height && rect.height > 10) {
			this.props.data.updateStyleByObject({ height: rect.height });
			console.log("EditableText: Parent height updated.");
		}
		// Save innerHTML
		this.props.data.set("data", editorSpan.innerHTML);
		//Update the selectionbox
		var event = new Event('keydown');

		//this.props.onElementSelectionCallback(ReactDOM.findDOMNode(this), event,event,this.props.data);
	}
	componentDidUpdate(prevProps, prevState) {
		//console.log("Editable Text updated");
		// Check if innerSpan within the bounds of parent div
		var jelement = $(ReactDOM.findDOMNode(this));
		var element = jelement.get(0);
		var span = jelement.find("span")[0];
		try {
			var elementBound = element.getBoundingClientRect();
			var spanBound = span.getBoundingClientRect();
			if (elementBound.bottom - elementBound.top != spanBound.bottom - spanBound.top) {
				// update height of parent to height of span
				this.props.data.updateStyleByObject({ height: Math.abs(spanBound.bottom - spanBound.top) });
			}
		} catch (e) {
			console.log(e);
		}
	}
	innerContent() {
		var data = this.props.data.get("data") != "" ? this.props.data.get("data") : this.props.data.get("sampleText");
		return { __html: data };
	}
	render() {
		return React.createElement("div", { "data-id": this.props.data.cid, className: "element editableText selectableParent selectable movable resizable  rotatable hasColor", style: this.styles().style,
			onDoubleClick: this.onDoubleClick,
			onKeyPress: this.onKeyPress,

			onClick: this.handleClick,
			// Call the parent callbacks to handle move events of element
			onMouseDown: this.handleMouseDown,
			onTouchStart: this.handleMouseDown,

			onChange: this.handleChange,
			onInput: this.handleInput

		}, React.createElement("div", { className: "editableContainer", onChange: this.control, style: this.styles().editableContainer,
			onCopy: this.control,
			onCut: this.control,
			onPaste: this.control,
			onCompositionEnd: this.control,
			onCompositionStart: this.control,
			onCompositionUpdate: this.control,
			//onKeyDown = {this.control}
			onKeyDown: this.control,
			onDrop: this.control
			//onKeyUp = {this.control}
		}, React.createElement("span", { style: { "outline": "0px solid transparent" }

		})));
	}
}
//<div className="editableContainer" contentEditable="false" editorState={this.state.editorState} onChange={this.handleChange} >
//	Write Something</div>
class ShapeCircleView extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleDropEvent = this.handleDropEvent.bind(this);
	}
	componentWillMount() {
		this.props.data.on("change", $.proxy(function () {
			if (debug.trace) console.log("ShapeCircleView: force updating");
			this.forceUpdate();
		}, this));
	}
	handleClick(event) {
		//Check if user clicked on the element or did he drag the element.
		console.log("ShapeCircleView: handleClick");
		this.props.handleChildElementClickEvent(event.currentTarget, event.nativeEvent, event, this.props.data);
	}
	handleMouseDown(event) {
		event.stopPropagation();
		event.preventDefault();
		console.log("ShapeCircleView: handleMouseDown");
		this.props.handleChildElementMousedownEvent(event.currentTarget, event.nativeEvent, event, this.props.data);
	}
	handleDropEvent(event) {
		console.log(event);
	}
	defautStyles() {
		return {
			"position": "absolute",
			"outline": "1px dashed transparent",
			"cursor": "move"
		};
	}
	styles() {
		var object = $.extend({}, this.props.data.get("style"), this.defautStyles());
		return {
			style: object
		};
	}
	render() {
		return React.createElement("div", { "data-id": this.props.data.cid, className: "element shape circle selectableParent selectable movable resizable  rotatable hasColor", style: this.styles().style, onClick: this.handleClick,
			// Call the parent callbacks to handle move events of element
			onClick: this.handleClick,
			onMouseDown: this.handleMouseDown,
			onTouchStart: this.handleMouseDown,
			onMouseUp: this.handleDropEvent
		}, this.props.data.get("children").map((element, key, index) => {
			var cid = element.cid;
			var Type = ViewRegistry[element.get("type")];
			return React.createElement(Type, { key: cid, data: element,
				//Channel to update Document state
				onElementSelectionCallback: this.props.onElementSelectionCallback,
				handleChildElementClickEvent: this.props.handleChildElementClickEvent,
				handleChildElementMousedownEvent: this.props.handleChildElementMousedownEvent });
		}));
	}
}
class ContainerView extends React.Component {
	defautStyles() {
		return {
			"position": "absolute",
			"left": "0",
			"top": "0",
			"width": "100%",
			"height": "100%"
		};
	}
	styles() {
		var object = $.extend({}, this.defautStyles(), this.props.data.get("style"));
		return {
			style: object
		};
	}
	componentWillMount() {
		this.props.data.on("change", $.proxy(function () {
			if (debug.trace) console.log("ContainerView: force updating");
			this.forceUpdate();
		}, this));
	}
	render() {
		return React.createElement("div", { "data-id": this.props.data.cid, className: "collageRow", style: this.styles().style }, this.props.data.get("children").map((element, key) => {
			var cid = element.cid;
			var Type = ViewRegistry[element.get("type")];
			return React.createElement(Type, { key: cid, data: element,
				//Channel to update Document state
				onElementSelectionCallback: this.props.onElementSelectionCallback,
				handleChildElementClickEvent: this.props.handleChildElementClickEvent,
				handleChildElementMousedownEvent: this.props.handleChildElementMousedownEvent });
		}));
	}
}
class RowView extends React.Component {
	defautStyles() {
		return {
			"position": "absolute",
			"left": "0",
			"top": "0",
			"width": "100%",
			"height": "100%"
		};
	}
	styles() {
		var object = $.extend({}, this.defautStyles(), this.props.data.get("style"));
		return {
			style: object
		};
	}
	componentWillMount() {
		this.props.data.on("change", $.proxy(function () {
			if (debug.trace) console.log("RowView: force updating");
			this.forceUpdate();
		}, this));
	}
	render() {
		return React.createElement("div", { "data-id": this.props.data.cid, className: "collageRow", style: this.styles().style }, this.props.data.get("children").map((element, key) => {
			var cid = element.cid;
			var Type = ViewRegistry[element.get("type")];
			return React.createElement(Type, { key: cid, data: element,
				//Channel to update Document state
				onElementSelectionCallback: this.props.onElementSelectionCallback,
				handleChildElementClickEvent: this.props.handleChildElementClickEvent,
				handleChildElementMousedownEvent: this.props.handleChildElementMousedownEvent });
		}));
	}
}
class ColumnView extends React.Component {
	defautStyles() {
		return {
			"position": "absolute",
			"left": "0",
			"top": "0",
			"width": "100%",
			"height": "100%"
		};
	}
	styles() {
		var object = $.extend({}, this.defautStyles(), this.props.data.get("style"));
		return {
			style: object
		};
	}
	componentWillMount() {
		this.props.data.on("change", $.proxy(function () {
			if (debug.trace) console.log("ColumnView: force updating");
			this.forceUpdate();
		}, this));
	}
	render() {
		return React.createElement("div", { "data-id": this.props.data.cid, className: "collageColumn", style: this.styles().style }, this.props.data.get("children").map((element, key) => {
			var cid = element.cid;
			var Type = ViewRegistry[element.get("type")];
			return React.createElement(Type, { key: cid, data: element,
				//Channel to update Document state
				onElementSelectionCallback: this.props.onElementSelectionCallback,
				handleChildElementClickEvent: this.props.handleChildElementClickEvent,
				handleChildElementMousedownEvent: this.props.handleChildElementMousedownEvent });
		}));
	}
}
class CellView extends React.Component {
	constructor(props) {
		super(props);
		this.handleDoubleClick = this.handleDoubleClick.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleChildImageReconfiguration = this.handleChildImageReconfiguration.bind(this);
	}
	handleDoubleClick(event) {
		console.log("CellView: handleDoubleClick");
		this.props.onElementSelectionCallback(event.currentTarget, this.handleChildImageReconfiguration, event, this.props.data);
		//ReactDOM.findDOMNode(event.currentTarget).getElementsByClassName("imageContainerCell")[0].classList.add("active");
	}
	handleChildImageReconfiguration(event, targetElement, jCropBox, para_three, para_four) {
		// TargetElement is this element
		console.log("CropBoxView Called" + jCropBox.find("img")[0].style.transform);
		var model = backboneModelHelper.findModelByCID($(targetElement).find("img").data("id"));
		var obj = {};
		obj.width = jCropBox.find("img").css("width");
		obj.height = jCropBox.find("img").css("height");
		obj.transform = jCropBox.find("img")[0].style.transform;

		model.updateStyleByObject(obj);
		this.forceUpdate();

		$(".cropBox").css("display", "none");
	}
	handleClick(event) {
		event.stopPropagation();

		console.log("CellView: handleClick");
		// For further processing
		this.props.handleChildElementClickEvent(event.currentTarget, event.nativeEvent, event, this.props.data);
	}
	defautStyles() {
		return {
			"position": "absolute",
			"bottom": "0px",
			"left": "0px",
			"right": "0px",
			"top": "0",
			"overflow": "hidden",
			"width": "auto",
			"height": "auto",
			"boxSizing": "border-box"
		};
	}
	styles() {
		var object = $.extend({}, this.defautStyles(), this.props.data.get("style"));
		return {
			style: object
		};
	}
	componentWillMount() {
		this.props.data.on("change", $.proxy(function () {
			if (debug.trace) console.log("CellView: force updating");
			this.forceUpdate();
		}, this));
	}
	render() {
		return React.createElement("div", { style: this.styles().style, "data-id": this.props.data.cid, key: this.props.data.cid, className: "collageCell",
			onClick: this.handleClick }, this.props.data.get("children").map((element, key) => {
			var cid = element.cid;
			var Type = ViewRegistry[element.get("type")];
			return React.createElement(Type, { key: cid, data: element,
				//Channel to update Document state
				onElementSelectionCallback: this.props.onElementSelectionCallback,
				handleChildElementClickEvent: this.props.handleChildElementClickEvent,
				handleChildElementMousedownEvent: this.props.handleChildElementMousedownEvent });
		}));
	}
}
class CellContentView extends React.Component {
	constructor(props) {
		super(props);
		this.doubletap = false;
		this.draggingModel = null;
		this.handleClick = this.handleClick.bind(this);
		this.handleDoubleClick = this.handleDoubleClick.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);

		this.handleImageDropEvent = this.handleImageDropEvent.bind(this);
		this.handleImageDropMouseEnterEvent = this.handleImageDropMouseEnterEvent.bind(this);
		this.handleImageDropMouseOutEvent = this.handleImageDropMouseOutEvent.bind(this);
	}
	defautStyles() {
		return {
			"position": "absolute",
			"left": "4",
			"top": "4",
			"right": "4",
			"bottom": "4",
			"width": "auto",
			"height": "auto",
			"transform": "translate(0px, 0px)",
			"outline": "0 none transparent",
			"backgroundImage": "none",
			"overflow": "hidden"
		};
	}
	styles() {
		var object = $.extend({}, this.defautStyles(), this.props.data.get("style"));
		return {
			style: object
		};
	}
	componentDidMount() {
		this.props.data.on("change", $.proxy(function () {
			if (debug.trace) console.log("CellContentView: force updating");
			this.forceUpdate();
		}, this));

		// React dosnt support ontouchenter and ontouchleave, thus we add them here
		ReactDOM.findDOMNode(this).addEventListener("component-dropped", this.handleImageDropEvent);
	}
	componentWillUnmount() {
		ReactDOM.findDOMNode(this).removeEventListener("component-dropped", this.handleImageDropEvent);
	}
	handleClick(event) {
		//Check if user clicked on the element or did he drag the element.
		console.log("CellContentView: handleClick");
		this.props.handleChildElementClickEvent(event.currentTarget, event.nativeEvent, event, this.props.data);
	}
	handleTouchEnd(event) {
		if (this.doubletap == true) {
			event.type = "dblclick";
			this.handleDoubleClick(event);
		}
		setTimeout(function (e) {
			this.doubletap = false;
		}.bind(this), 500);
		this.doubletap = true;
	}
	handleDoubleClick(event) {
		console.log("CellView: handleDoubleClick");
		this.props.onElementSelectionCallback(event.currentTarget, this.handleChildImageReconfiguration, event, this.props.data);
		//ReactDOM.findDOMNode(event.currentTarget).getElementsByClassName("imageContainerCell")[0].classList.add("active");
	}
	handleMouseDown(event) {
		event.stopPropagation();
		event.preventDefault();
		console.log("CellContentView: handleMouseDown");
		this.props.handleChildElementMousedownEvent(event.currentTarget, event.nativeEvent, event, this.props.data);
	}
	handleImageDropEvent(event) {
		var model = backboneModelHelper.findChildImageOfModelByCID($(ReactDOM.findDOMNode(this)).data("id"));
		var image = new Image();
		image.onload = function () {
			model.set("url", image.src);
		}.bind(this);
		image.src = event.detail.model.url;
	}
	handleImageDropMouseEnterEvent(event) {
		console.log("MOUSE UP onMouseEnter: " + this.props.data.cid);
		this.draggingModel = JSON.parse(atob(droppableMap.get($(".dragging").data("droppablemap-search-key"))));
	}
	handleImageDropMouseOutEvent(event) {
		console.log("MOUSE UP onMouseLeave: " + this.props.data.cid);
		this.draggingModel = null;
	}
	render() {
		return React.createElement("div", { "data-id": this.props.data.cid, className: "imageContainerCell catcher imageCatcher hasColor", style: this.styles().style,
			onClick: this.handleClick,
			onDoubleClick: this.handleDoubleClick,
			onMouseDown: this.handleMouseDown,
			onTouchStart: this.handleMouseDown,
			onTouchEnd: this.handleTouchEnd
		}, React.createElement("div", { className: "cellImageSelectionBlocker", style: { textAlign: "center", width: "100%", height: "100%", position: "absolute", zIndex: "2" }
		}, React.createElement("span", { style: { opacity: "0", color: "rgba(0,0,0,0)", top: "48%", position: "relative" } }, "Double click to move image")), React.createElement("div", { className: "dropzone image-dropzone", style: { width: "100%", height: "100%", position: "absolute", zIndex: "2" },
			onMouseEnter: this.handleImageDropMouseEnterEvent,
			onTouchMove: this.handleImageDropMouseEnterEvent,
			onMouseLeave: this.handleImageDropMouseOutEvent
		}), this.props.data.get("children").map((element, key) => {
			var cid = element.cid;
			var Type = ViewRegistry[element.get("type")];
			return React.createElement(Type, { key: cid, data: element,
				//Channel to update Document state
				onElementSelectionCallback: this.props.onElementSelectionCallback,
				handleChildElementClickEvent: this.props.handleChildElementClickEvent });
		}));
	}
}
class CellImageView extends React.Component {
	constructor(props) {
		super(props);
	}
	componentWillMount() {
		this.props.data.on("change", $.proxy(function () {
			if (debug.trace) console.log("CellContentView: force updating");
			this.forceUpdate();
		}, this));
	}
	defautStyles() {
		return {
			"position": "absolute",
			"top": "0"
		};
	}
	styles() {
		var object = $.extend({}, this.defautStyles(), this.props.data.get("style"));
		return {
			style: object
		};
	}
	render() {
		return React.createElement("img", { "data-id": this.props.data.cid, className: "cellImage", src: this.props.data.get("url"), style: this.styles().style });
	}
}
class FixedCollageContainerView extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
	}
	handleClick(event) {
		//Check if user clicked on the element or did he drag the element.
		console.log("CollageContainerView: handleClick");
		this.props.handleChildElementClickEvent(event.currentTarget, event.nativeEvent, event, this.props.data);
	}
	handleMouseDown(event) {
		event.stopPropagation();
		event.preventDefault();
		console.log("CollageContainerView: handleMouseDown");
		this.props.handleChildElementMousedownEvent(event.currentTarget, event.nativeEvent, event, this.props.data);
	}
	defautStyles() {
		return {
			"position": "absolute",
			"cursor": "move",
			"borderStyle": "solid",
			"borderColor": "rgb(255, 255, 255)",
			"boxSizing": "border-box"
		};
	}
	/*
 	Override any width or height to be width of the page
 */
	styles() {
		var object = $.extend({}, this.defautStyles(), this.props.data.get("style"));
		if (object.transform) {
			object.MozTransform = object.transform;
			object.WebkitTransform = object.transform;
		}
		return {
			style: object
		};
	}
	componentWillMount() {}
	componentDidMount() {
		var pageStyle = backboneModelHelper.findParentPageOfModelByCID(ReactDOM.findDOMNode(this).dataset.id).get("style");
		var cellContentChildren = backboneModelHelper.getAllModelsOfAModelByType(ReactDOM.findDOMNode(this).dataset.id, ModelRegistry.cellContent);
		backboneModelHelper.findModelByCID(ReactDOM.findDOMNode(this).dataset.id).updateStyleByObject({
			width: pageStyle.width,
			height: pageStyle.height,
			//top : parseFloat(cellContentChildren[0].get("style").top),
			//left : parseFloat(cellContentChildren[0].get("style").top)
			borderWidth: parseFloat(cellContentChildren[0].get("style").top)
		});
		this.props.data.on("change", $.proxy(function () {
			if (debug.trace) console.log("CollageContainerView: force updating");
			this.forceUpdate();
		}, this));
	}
	render() {
		return React.createElement("div", { "data-id": this.props.data.cid, className: "element fixedCollageContainer selectableParent hasColor", style: this.styles().style, onClick: this.handleClick,
			// Call the parent callbacks to handle move events of element
			//onMouseDown={this.props.onMouseDown } onMouseUp={this.props.onMouseUp } onMouseMove={this.props.onMouseMove } 
			onMouseDown: this.handleMouseDown,
			onTouchStart: this.handleMouseDown
		}, this.props.data.get("children").map((element, key, index) => {
			var cid = element.cid;
			var Type = ViewRegistry[element.get("type")];
			return React.createElement(Type, { key: cid, data: element,
				//Channel to update Document state
				onElementSelectionCallback: this.props.onElementSelectionCallback,
				handleChildElementClickEvent: this.props.handleChildElementClickEvent,
				handleChildElementMousedownEvent: this.props.handleChildElementMousedownEvent });
		}));
	}
}
/*
	CollageContainerView is a element. All elements mouse move/down/up events are hanled by ElementView
*/
class CollageContainerView extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
	}
	handleClick(event) {
		//Check if user clicked on the element or did he drag the element.
		console.log("CollageContainerView: handleClick");
		this.props.handleChildElementClickEvent(event.currentTarget, event.nativeEvent, event, this.props.data);
	}
	handleMouseDown(event) {
		event.stopPropagation();
		event.preventDefault();
		console.log("CollageContainerView: handleMouseDown");
		this.props.handleChildElementMousedownEvent(event.currentTarget, event.nativeEvent, event, this.props.data);
	}
	defautStyles() {
		return {
			"position": "absolute",
			"outline": "1px dashed transparent",
			"cursor": "move"
		};
	}
	styles() {
		var object = $.extend({}, this.props.data.get("style"), this.defautStyles());
		return {
			style: object
		};
	}
	componentDidMount() {
		this.props.data.on("change", $.proxy(function () {
			if (debug.trace) console.log("CollageContainerView: force updating");
			this.forceUpdate();
		}, this));
	}

	render() {
		return React.createElement("div", { "data-id": this.props.data.cid, className: "element collageContainer selectableParent selectable movable resizable  rotatable hasColor", style: this.styles().style, onClick: this.handleClick,
			// Call the parent callbacks to handle move events of element
			//onMouseDown={this.props.onMouseDown } onMouseUp={this.props.onMouseUp } onMouseMove={this.props.onMouseMove } 
			onMouseDown: this.handleMouseDown,
			onTouchStart: this.handleMouseDown
		}, this.props.data.get("children").map((element, key, index) => {
			var cid = element.cid;
			var Type = ViewRegistry[element.get("type")];
			return React.createElement(Type, { key: cid, data: element,
				//Channel to update Document state
				onElementSelectionCallback: this.props.onElementSelectionCallback,
				handleChildElementClickEvent: this.props.handleChildElementClickEvent,
				handleChildElementMousedownEvent: this.props.handleChildElementMousedownEvent });
		}));
	}
}

class ElementView extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		// Bind this context to handleChildElementClickEvent so that we can
		// distinguish if mouse event is a drag event or click event
		this.handleChildElementClickEvent = this.handleChildElementClickEvent.bind(this);
		this.handleChildElementMousedownEvent = this.handleChildElementMousedownEvent.bind(this);
	}
	handleChildElementClickEvent(element, nativeEvent, reactEvent, backboneModel) {
		nativeEvent.stopPropagation();
		nativeEvent.preventDefault();
		//if(this.state.mousedown && this.state.mousedown.transitionState != "mousemove" && this.state.mousedown.isMouseMoved){
		//this.props.registerMousedownEventWithDocument(element, nativeEvent, reactEvent, backboneModel);
		console.log("ElementView: handleChildElementClickEvent");
		// /}
	}
	handleChildElementMousedownEvent(element, nativeEvent, reactEvent, backboneModel) {
		//if(this.state.mousedown && this.state.mousedown.transitionState != "mousemove" && this.state.mousedown.isMouseMoved){
		nativeEvent.stopPropagation();
		nativeEvent.preventDefault();
		this.props.registerMousedownEventWithDocument(element, nativeEvent, reactEvent, backboneModel);
		console.log("ElementView: handleChildElementMousedownEvent");
		if (element.classList.contains("movable")) {
			window.addEventListener("mousemove", this.handleMouseMove, { passive: false });
			window.addEventListener("touchmove", this.handleMouseMove, { passive: false });
			window.addEventListener("mouseup", this.handleMouseUp, { passive: false });
			window.addEventListener("touchend", this.handleMouseUp, { passive: false });
		}
		// /}
	}
	// Click Propergation stops at the ElementView
	handleClick(event) {
		event.stopPropagation();
		console.log("ElementView: handleClick");
		this.props.registerMousedownEventWithDocument(this.props.getRegisteredMousedownEventFromDocument().mousedown.currentTarget, event.nativeEvent, event, this.props.data);
	}
	handleMouseMove(event) {
		if (this.props.getRegisteredMousedownEventFromDocument().mousedown && this.props.getRegisteredMousedownEventFromDocument().mousedown.state) {
			if ($(this.props.getRegisteredMousedownEventFromDocument().selectableParentElement).hasClass("movable")) {
				console.log("ElementView: handleMouseMove 2");
				// mouse down info
				var absInitialMousePointX = this.props.getRegisteredMousedownEventFromDocument().mousedown.event.pageX || this.props.getRegisteredMousedownEventFromDocument().mousedown.event.touches[0].pageX;
				var absInitialMousePointY = this.props.getRegisteredMousedownEventFromDocument().mousedown.event.pageY || this.props.getRegisteredMousedownEventFromDocument().mousedown.event.touches[0].pageY;

				// get absolute mouse x and y
				var absMousePointX = event.pageX || event.touches[0].pageX;
				var absMousePointY = event.pageY || event.touches[0].pageY;

				//Delta mouse change
				var deltaX = absMousePointX - absInitialMousePointX;
				var deltaY = absMousePointY - absInitialMousePointY;

				// Target element
				var targetElement = this.props.getRegisteredMousedownEventFromDocument().selectableParentElement;
				//var targetElementCoords = targetElement.getClientRects()[0];

				//Update matrix tranform
				var originalTransformString = this.props.getRegisteredMousedownEventFromDocument().selectableParentElementStyle.transform;
				console.log(originalTransformString);
				var deltaXApplied = transformMatrixToString(accumulateTransformMatrixValue(originalTransformString, "tx", deltaX));
				var deltaYApplied = transformMatrixToString(accumulateTransformMatrixValue(deltaXApplied, "ty", deltaY));

				var style = {
					"transform": deltaYApplied
				};
				//ReactDOM.findDOMNode(targetElement).style.transform = deltaYApplied;
				var el = ReactDOM.findDOMNode(targetElement);
				if (el.dataset.id) {
					var model = backboneModelHelper.findMovableElementOfModelByCID(el.dataset.id);
					model.updateStyleByObject(style);
				}
				//transformMatrixToString(accumulateTransformMatrixValue("matrix(1,0,0,1,0,0)", "tx", 10))
				console.log();
				var mousedownState = this.props.getRegisteredMousedownEventFromDocument().mousedown;
				if (mousedownState.transitionState != "mousemove" && mousedownState.transitionState != "touchmove") {
					mousedownState.transitionState = "mousemove";
					mousedownState.isMouseMoved = true;
				}
			}
		}
		// Call this after Model updated, else you will see SelectionBoxView displayed on previous location
		this.props.onElementMoveCallback(this.props.getRegisteredMousedownEventFromDocument().mousedown.currentTarget, event.nativeEvent, event, this.props.data);
	}
	handleMouseDown(e) {
		e.preventDefault();
		e.stopPropagation();
		console.log("TOUCH");
		//this.props.registerMousedownEventWithDocument(this.props.getRegisteredMousedownEventFromDocument().mousedown.currentTarget, event.nativeEvent, event, this.props.data);
		//window.addEventListener("mousemove", this.handleMouseMove, {passive: false});
		//window.addEventListener("touchmove", this.handleMouseMove, {passive: false});
	}
	handleMouseUp(e) {
		var mousedownState = this.props.getRegisteredMousedownEventFromDocument().mousedown;
		if (mousedownState && mousedownState.state) {
			console.log("mousedownState.state was not available. Didn't set mousedownState.state to false");
			mousedownState.state = false;
		}
		//mousedownState.transitionState = "mouseup";
		window.removeEventListener("mouseup", this.handleMouseMove, { passive: false });
		window.removeEventListener("touchend", this.handleMouseMove, { passive: false });
		window.removeEventListener("mousemove", this.handleMouseMove, { passive: false });
		window.removeEventListener("touchmove", this.handleMouseMove, { passive: false });
	}
	defautStyles() {
		return {
			position: "absolute",
			left: "0",
			top: "0",
			width: "100%",
			height: "100%"
		};
	}
	styles() {
		return {
			style: $.extend({}, this.props.data.get("style"), this.defautStyles())
		};
	}
	updateChildren() {
		this.setState({
			children: this.props.data.get("children")
		});
		this.forceUpdate();
	}
	componentWillMount() {
		this.props.data.on("change", this.updateChildren.bind(this));
		this.updateChildren();
	}
	componentDidUpdate(prevProps, prevState) {
		console.log("EDITABLETEXT: componentDidUpdate");
		/*if(this.updateSelectionBoxView){
  	this.props.onElementMoveCallback(this.props.getRegisteredMousedownEventFromDocument().mousedown.currentTarget,
  		this.props.getRegisteredMousedownEventFromDocument().mousedown.event, 
  		this.props.getRegisteredMousedownEventFromDocument().mousedown.event, this.props.data);
  		this.updateSelectionBoxView= false;
  } */
	}
	render() {
		return React.createElement("div", { "data-id": this.props.data.cid, className: "elements", style: this.styles().style
		}, this.state.children.map((element, key, index) => {
			var cid = element.cid;
			var Type = ViewRegistry[element.get("type")];
			return React.createElement(Type, { key: cid, data: element,

				handleChildElementClickEvent: this.handleChildElementClickEvent, parentMouseDownState: this.props.mousedown,
				handleChildElementMousedownEvent: this.handleChildElementMousedownEvent,
				//Channel to update Document state
				onElementSelectionCallback: this.props.onElementSelectionCallback,
				onElementMoveCallback: this.props.onElementMoveCallback });
		}));
	}
}
class PageView extends React.Component {
	constructor(props) {
		super(props);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleImageDropEvent = this.handleImageDropEvent.bind(this);
	}
	defautStyles() {
		return {
			position: "absolute",
			left: 0,
			top: 0,
			backgroundColor: "#fff",
			color: "#222",
			opacity: "1"
		};
	}
	handleMouseDown(e) {
		console.log(e);
		this.props.clearMousedownEventFromDocument(e);
	}
	handleImageDropEvent(event) {
		var model = backboneModelHelper.findModelByCID($(ReactDOM.findDOMNode(this)).data("id"));
		model.addComponent(event.detail.model);
	}
	styles() {
		// Defaults are hardcoded on the this method
		return {
			page: {
				top: this.props.data.get("style").top,
				left: this.props.data.get("style").left,
				backgroundColor: "#fff",
				color: "#222",
				opacity: "1",
				position: "absolute"
			},
			page__clipArea: {
				padding: "0",
				position: "relative",
				overflow: "hidden"
			},
			page__content: {
				width: this.props.data.get("style").width,
				height: this.props.data.get("style").height,
				position: "relative",
				backgroundColor: "#fff"
			},
			page__sidebarContent: {
				"display": "grid",
				"textAlign": "center",
				"verticalAlign": "middle",
				"position": "relative",
				"top": parseFloat(this.props.data.get("style").height) / 2 - 47.5,
				"color": "#3f4652"
			}
		};
	}
	componentWillMount() {
		this.props.data.on("change", $.proxy(function () {
			if (debug.trace) console.log("PageView: force updating");
			this.forceUpdate();
		}, this));
	}
	componentDidMount() {
		ReactDOM.findDOMNode(this).addEventListener("component-dropped", this.handleImageDropEvent);
	}
	componentWillUnmount() {
		ReactDOM.findDOMNode(this).removeEventListener("component-dropped", this.handleImageDropEvent);
	}
	render() {
		//Page set the offset from top coner.
		return React.createElement("section", { "data-id": this.props.data.cid, className: "page catcher", style: this.styles().page,
			onMouseDown: this.handleMouseDown,
			onTouchStart: this.handleMouseDown
		}, React.createElement("div", { className: "page__clipArea", style: this.styles().page__clipArea }, React.createElement("div", { className: "page__content", style: this.styles().page__content }, this.props.data.get("children")[0].get("children").map((element, key) => {
			var cid = element.cid;
			var Type = ViewRegistry[element.get("type")];
			return React.createElement(Type, { key: cid, data: element,
				onElementSelectionCallback: this.props.onElementSelectionCallback,
				onElementMoveCallback: this.props.onElementMoveCallback,

				registerMousedownEventWithDocument: this.props.registerMousedownEventWithDocument,
				getRegisteredMousedownEventFromDocument: this.props.getRegisteredMousedownEventFromDocument,
				clearMousedownEventFromDocument: this.props.clearMousedownEventFromDocument

			});
		}))), React.createElement("div", { className: this.props.additionalClassesForPageMove + " pageSidePanel", "data-page-id": this.props.data.cid }, React.createElement("div", { className: "vhcenter sidePanelTools", style: this.styles().page__sidebarContent }, React.createElement("i", { className: "material-icons tool" }, "delete"), React.createElement("i", { className: "material-icons tool upArrow" }, "arrow_upward"), React.createElement("div", { className: "pageNumber tool" }, this.props.pageNumber + 1), React.createElement("i", { className: "material-icons tool downArrow" }, "arrow_downward"))));
	}
	componentDidUpdate() {
		//Complex
		//this.props.data.updateStyleByElementSilently(ReactDOM.findDOMNode(this));
	}
}
class MultipageView extends React.Component {
	constructor(props) {
		super(props);
		this.handleMouseDown = this.handleMouseDown.bind(this);
	}
	defautStyles() {
		return {
			position: "absolute",
			left: 0,
			top: 0,
			backgroundColor: "#fff",
			color: "#222",
			opacity: "1"
		};
	}
	handleMouseDown(e) {
		console.log(e);
		this.props.clearMousedownEventFromDocument(e);
	}
	styles() {
		// Defaults are hardcoded on the this method
		return {
			multipage: {
				top: this.props.data.get("style").top,
				left: this.props.data.get("style").left,
				opacity: "1",
				position: "absolute",
				width: this.props.data.get("style").width,
				height: this.props.data.get("style").height
			}
		};
	}
	componentWillMount() {
		this.props.data.on("change", $.proxy(function () {
			if (debug.trace) console.log("MultipageView: force updating");
			this.forceUpdate();
		}, this));
	}
	render() {
		//Page set the offset from top coner.
		return React.createElement("div", { className: "multipage", "data-id": this.props.data.cid, style: this.styles().multipage }, this.props.data.get("children").map((element, key) => {
			var additionalClassesForPageMove = "";
			if (key == this.props.data.get("children").length - 1) {
				additionalClassesForPageMove = "hidePageSendDown";
			} else if (key == 0) {
				additionalClassesForPageMove = "hidePageSendUp";
			}
			var cid = element.cid;
			var Type = ViewRegistry[element.get("type")];
			return React.createElement(Type, { key: cid, data: element, pageNumber: key, additionalClassesForPageMove: additionalClassesForPageMove,
				onElementSelectionCallback: this.props.onElementSelectionCallback,
				onElementMoveCallback: this.props.onElementMoveCallback,

				onElementSelectionCallback: this.props.onElementSelectionCallback,
				onElementMoveCallback: this.props.onElementMoveCallback,
				registerMousedownEventWithDocument: this.props.registerMousedownEventWithDocument,
				getRegisteredMousedownEventFromDocument: this.props.getRegisteredMousedownEventFromDocument,
				clearMousedownEventFromDocument: this.props.clearMousedownEventFromDocument });
		}));
	}
	componentDidUpdate() {
		//Complex
		//this.props.data.updateStyleByElementSilently(ReactDOM.findDOMNode(this));
	}
}

/*
	A square drawn around the selected element. Selection box follows the same offset as page

	Design considerations:
		Rotatated elements
*/
class SelectionBoxView extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);

		this.handleMouseDownOnResizeHandler = this.handleMouseDownOnResizeHandler.bind(this);
		this.handleMouseUpOnResizeHandler = this.handleMouseUpOnResizeHandler.bind(this);
		this.handleMouseMoveOnResizeHandler = this.handleMouseMoveOnResizeHandler.bind(this);

		this.handleMouseDownOnRotateHandler = this.handleMouseDownOnRotateHandler.bind(this);
		this.handleMouseUpOnRotateHandler = this.handleMouseUpOnRotateHandler.bind(this);
		this.handleMouseMoveOnRotateHandler = this.handleMouseMoveOnRotateHandler.bind(this);
		this.update = this.update.bind(this);
		this.state = { model: null };
	}
	// DEV NOTE: Jerkyess because rotate around the rotate handler
	handleMouseMoveOnRotateHandler(event) {
		if (this.state.mousedown.selectableParentElement.classList.contains("rotatable")) {
			var element = this.state.mousedown.selectableParentElement;
			var selectionBox = $(this.state.mousedown.event.target.parentElement).closest(".selectionBox")[0];

			var page = {
				X: event.pageX,
				Y: event.pageY
			};

			var point = {
				x: page.X - this.state.mousedown.selectableParentElementStyle.center.left,
				y: page.Y - this.state.mousedown.selectableParentElementStyle.center.top
			};

			var theta = 0;
			if (point.y == 0 && point.x > 0) {
				theta = -1 * Math.PI / 2;
			} else if (point.y == 0 && point.x < 0) {
				theta = Math.PI / 2;
			} else if (point.x == 0 && point.y < 0) {
				theta = Math.PI;
			} else {
				theta = Math.atan(point.x / -point.y);
			}
			//Does this work
			//theta = Math.atan(point.y / point.x);


			var deg = theta * 180 / Math.PI;
			if (point.x < 0 && point.y < 0) {
				deg = 180 + deg;
			} else if (point.x > 0 && point.y < 0) {
				deg = -180 + deg;
			}
			console.log(deg);
			// stick feature
			var sign = deg / Math.abs(deg);

			if (Math.abs(deg) % 45 < 3) {
				// +4 so that cast to int wont return invalid result
				var partialDeg = parseInt((Math.abs(deg) + 4) / Math.abs(45));
				deg = sign * (partialDeg * 45);
			}

			/*
   if(deg > -3 && deg < 3){
   	deg = 0;
   }else if(deg > 42 && deg < 48){
   	deg = 45;
   }else if(deg < -42 && deg > -48){
   	deg = -45;
   }else if(deg > 87 && deg < 93){
   	deg = 90;
   }else if(deg < -87 && deg > -93){
   	deg = -90;
   }else if(deg < -177 || deg > 177){
   	deg = 180;
   }
   console.log(deg);
   if(deg < -150){
   	console.log();
   }
   */

			//Update element 
			var styleObject = {};
			//Handler matrix tranformations
			var originalTransformString = this.state.mousedown.selectableParentElementStyle.transform;
			var transform = transformMatrixDecode(originalTransformString);

			var deltaApplied = transformMatrixToString(updateTransformMatrixValue(originalTransformString, "rotate", deg));
			//Update selection box
			ReactDOM.findDOMNode(selectionBox).style.transform = deltaApplied;

			//Update model

			styleObject.transform = deltaApplied;
			var el = ReactDOM.findDOMNode(element);
			if (el.dataset.id) {
				var model = backboneModelHelper.findMovableElementOfModelByCID(el.dataset.id);
				model.updateStyleByObject(styleObject);
			}
		}
	}

	handleMouseMoveOnResizeHandler(event) {
		if (this.state && this.state.mousedown && this.state.mousedown.state) {
			if (this.state.mousedown.event.target.classList.contains("handle") && this.state.mousedown.selectableParentElement.classList.contains("resizable")) {
				event.stopPropagation();
				//console.log("Resize handler moved");
				var element = this.state.mousedown.selectableParentElement;
				var selectionBox = this.state.mousedown.event.target.parentElement;
				var classList = this.state.mousedown.event.target.classList;

				// mouse down info
				var absInitialMousePointX = this.state.mousedown.event.pageX;
				var absInitialMousePointY = this.state.mousedown.event.pageY;

				// get absolute mouse x and y
				var absMousePointX = event.pageX;
				var absMousePointY = event.pageY;

				//Delta mouse change
				var deltaX = absMousePointX - absInitialMousePointX;
				var deltaY = absMousePointY - absInitialMousePointY;
				var unsignedDelta = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // We need the direction
				var angle = Math.atan2(deltaY, deltaX);
				var sign = angle / Math.abs(angle) ? angle / Math.abs(angle) : 1;
				var delta = sign * unsignedDelta;

				//Handler matrix tranformations
				var originalTransformString = this.state.mousedown.selectableParentElementStyle.transform;
				var transform = transformMatrixDecode(originalTransformString);
				/* update underlaying @var selectionBox. Note: selectionBox and Element has the same dimensions */
				var theta = transform.rotate * Math.PI / 180;
				//console.log(Math.cos(theta) + ":" + Math.sin(theta) + ":" + angle);
				try {
					var cls = $(".handle.active")[0].classList;
					var POINT_TESTS = ["b", "bl", "l", "tl", "t", "tr", "r", "br"];
					var POINT_TEST = 5;
					for (var i = 0; i < cls.length; i++) {
						var cl = cls[i];
						if (POINT_TESTS.indexOf(cl) != -1) {
							POINT_TEST = POINT_TESTS.indexOf(cl) + 1;
						}
					}

					var rect = element.getBoundingClientRect();
					var parentRect = element.parentElement.getBoundingClientRect();
					var clientWidth = parseFloat(this.state.mousedown.selectableParentElementStyle.width); //(rect.left - parentRect.left) + (rect.right - rect.left)/2;
					var clientHeight = parseFloat(this.state.mousedown.selectableParentElementStyle.height); //(rect.top - parentRect.top) + (rect.bottom - rect.top)/2;
					var origTrans = transformMatrixDecode(this.state.mousedown.selectableParentElementStyle.transform);
					var sx0 = origTrans.tx + clientWidth / 2;
					var sy0 = origTrans.ty + clientHeight / 2;
					var st = new SquareTransform();

					var policy = this.state.model.get("policy");
					if (policy && policy.selectionBox && policy.selectionBox.expand) {
						if (policy.selectionBox.expand.keepRatio) {
							var sign = 1;
							if (POINT_TEST == 2) {
								sign = -1;
							}
							deltaY = sign * deltaX * clientHeight / clientWidth;
						}
					}
					//console.log(deltaX + " : " + deltaY + " : " + POINT_TEST + " : " + transform.rotate + " : " +  sx0 + " : " +  sy0 + " : " +  element.clientWidth + " : " +  element.clientHeight);
					var Square = st.main(deltaX, deltaY, POINT_TEST, transform.rotate, sx0, sy0, clientWidth, clientHeight);
					//var Square = this.main(,);
					var sq = {
						top: Square.y_i[3],
						left: Square.x_i[3],
						width: Math.abs(Square.x_s[3] - Square.x_s[4]) * 2,
						height: Math.abs(Square.y_s[3] - Square.y_s[2]) * 2
					};
					var newPoints = {
						tx: sq.left,
						ty: sq.top,
						theta: Square.theta_s
					};
					var transMatrix = transformMatrixToString(newPoints);
					var newStyle = {
						width: sq.width,
						height: sq.height,
						transform: transMatrix
					};

					//Update selectionbox
					//ReactDOM.findDOMNode(selectionBox).style.transform = transMatrix;
					//ReactDOM.findDOMNode(selectionBox).style.width = (parseFloat(newStyle.width)) + "px";
					//ReactDOM.findDOMNode(selectionBox).style.height = (parseFloat(newStyle.height)) + "px";


					//Update element
					var el = ReactDOM.findDOMNode(element);
					var model = backboneModelHelper.findMovableElementOfModelByCID(el.dataset.id);
					model.updateStyleByObject(newStyle);
					//console.log(deltaX + ":" + deltaY );
					//console.log(sq);

					//console.log(this.state.mousedown.selectableParentElementStyle);
				} catch (e) {
					console.log(e);
				}
				return;

				var styleObject = {};
				if (classList.contains("tl")) {
					/* update underlaying @var selectionBox. Note: selectionBox and Element has the same dimensions */

					//Update matrix tranform
					var deltaApplied = transformMatrixToString(accumulateTransformMatrixValue(originalTransformString, "tx", deltaX));
					deltaApplied = transformMatrixToString(accumulateTransformMatrixValue(deltaApplied, "ty", deltaY));

					ReactDOM.findDOMNode(selectionBox).style.transform = deltaApplied;
					ReactDOM.findDOMNode(selectionBox).style.width = parseFloat(this.state.mousedown.selectableParentElementStyle.width) - deltaX + "px";
					ReactDOM.findDOMNode(selectionBox).style.height = parseFloat(this.state.mousedown.selectableParentElementStyle.height) - deltaY + "px";

					/* update underlaying element */
					//Update matrix tranform
					var originalTransformString = this.state.mousedown.selectableParentElementStyle.transform;

					deltaApplied = transformMatrixToString(accumulateTransformMatrixValue(originalTransformString, "tx", deltaX));
					deltaApplied = transformMatrixToString(accumulateTransformMatrixValue(deltaApplied, "ty", deltaY));

					styleObject.transform = deltaApplied;

					styleObject.width = parseFloat(this.state.mousedown.selectableParentElementStyle.width) - deltaX + "px";
					styleObject.height = parseFloat(this.state.mousedown.selectableParentElementStyle.height) - deltaY + "px";
				} else if (classList.contains("t")) {

					/* update underlaying @var selectionBox. Note: selectionBox and Element has the same dimensions */

					//Update matrix tranform
					var deltaApplied = transformMatrixToString(accumulateTransformMatrixValue(originalTransformString, "ty", deltaY));

					ReactDOM.findDOMNode(selectionBox).style.transform = deltaApplied;
					ReactDOM.findDOMNode(selectionBox).style.height = parseFloat(this.state.mousedown.selectableParentElementStyle.height) - deltaY + "px";

					/* update underlaying element */
					//Update matrix tranform
					var originalTransformString = this.state.mousedown.selectableParentElementStyle.transform;

					var deltaApplied = transformMatrixToString(accumulateTransformMatrixValue(originalTransformString, "ty", deltaY));

					styleObject.transform = deltaApplied;
					styleObject.height = parseFloat(this.state.mousedown.selectableParentElementStyle.height) - deltaY + "px";
				} else if (classList.contains("tr")) {
					/* update underlaying @var selectionBox. Note: selectionBox and Element has the same dimensions */

					//Update matrix tranform
					var deltaApplied = transformMatrixToString(accumulateTransformMatrixValue(originalTransformString, "ty", deltaY));

					ReactDOM.findDOMNode(selectionBox).style.transform = deltaApplied;
					ReactDOM.findDOMNode(selectionBox).style.width = parseFloat(this.state.mousedown.selectableParentElementStyle.width) + deltaX + "px";
					ReactDOM.findDOMNode(selectionBox).style.height = parseFloat(this.state.mousedown.selectableParentElementStyle.height) - deltaY + "px";

					/* update underlaying element */
					//Update matrix tranform
					var originalTransformString = this.state.mousedown.selectableParentElementStyle.transform;

					deltaApplied = transformMatrixToString(accumulateTransformMatrixValue(originalTransformString, "ty", deltaY));

					styleObject.transform = deltaApplied;

					styleObject.width = parseFloat(this.state.mousedown.selectableParentElementStyle.width) + deltaX + "px";
					styleObject.height = parseFloat(this.state.mousedown.selectableParentElementStyle.height) - deltaY + "px";
				} else if (classList.contains("r")) {
					if (!(transform.rotate > 0 && transform.rotate < 180)) {
						delta = -1 * delta;
					}
					if (delta < -30) {
						console.log(delta);
					}
					console.log(delta + ":" + transform.rotate);

					ReactDOM.findDOMNode(selectionBox).style.width = parseFloat(this.state.mousedown.selectableParentElementStyle.width) + delta + "px";

					deltaApplied = transformMatrixToString(accumulateTransformMatrixValue(originalTransformString, "tx", -1 * (delta / 2 * (1 - Math.cos(theta)))));
					deltaApplied = transformMatrixToString(accumulateTransformMatrixValue(deltaApplied, "ty", Math.sin(theta) * delta / 2));

					ReactDOM.findDOMNode(selectionBox).style.transform = deltaApplied;
					/**/
					styleObject.transform = deltaApplied;
					styleObject.width = parseFloat(this.state.mousedown.selectableParentElementStyle.width) + delta + "px";
				} else if (classList.contains("br")) {
					/* update underlaying @var selectionBox. Note: selectionBox and Element has the same dimensions */

					ReactDOM.findDOMNode(selectionBox).style.width = parseFloat(this.state.mousedown.selectableParentElementStyle.width) + deltaX + "px";
					ReactDOM.findDOMNode(selectionBox).style.height = parseFloat(this.state.mousedown.selectableParentElementStyle.height) + deltaY + "px";

					/* update underlaying element */
					styleObject.width = parseFloat(this.state.mousedown.selectableParentElementStyle.width) + deltaX + "px";
					styleObject.height = parseFloat(this.state.mousedown.selectableParentElementStyle.height) + deltaY + "px";
				} else if (classList.contains("b")) {
					/* update underlaying @var selectionBox. Note: selectionBox and Element has the same dimensions */
					ReactDOM.findDOMNode(selectionBox).style.height = parseFloat(this.state.mousedown.selectableParentElementStyle.height) + deltaY + "px";

					/* update underlaying element */
					styleObject.height = parseFloat(this.state.mousedown.selectableParentElementStyle.height) + deltaY + "px";
				} else if (classList.contains("bl")) {
					/* update underlaying @var selectionBox. Note: selectionBox and Element has the same dimensions */
					//Update matrix tranform
					var deltaApplied = transformMatrixToString(accumulateTransformMatrixValue(originalTransformString, "tx", deltaX));

					ReactDOM.findDOMNode(selectionBox).style.transform = deltaApplied;

					ReactDOM.findDOMNode(selectionBox).style.width = parseFloat(this.state.mousedown.selectableParentElementStyle.width) - deltaX + "px";
					ReactDOM.findDOMNode(selectionBox).style.height = parseFloat(this.state.mousedown.selectableParentElementStyle.height) + deltaY + "px";

					/* update underlaying element */
					//Update matrix tranform
					var originalTransformString = this.state.mousedown.selectableParentElementStyle.transform;

					deltaApplied = transformMatrixToString(accumulateTransformMatrixValue(originalTransformString, "tx", deltaX));

					styleObject.transform = deltaApplied;

					styleObject.width = parseFloat(this.state.mousedown.selectableParentElementStyle.width) - deltaX + "px";
					styleObject.height = parseFloat(this.state.mousedown.selectableParentElementStyle.height) + deltaY + "px";
				} else if (classList.contains("l")) {
					/* update underlaying @var selectionBox. Note: selectionBox and Element has the same dimensions */
					//Update matrix tranform
					var deltaApplied = transformMatrixToString(accumulateTransformMatrixValue(originalTransformString, "tx", deltaX));

					ReactDOM.findDOMNode(selectionBox).style.transform = deltaApplied;

					ReactDOM.findDOMNode(selectionBox).style.width = parseFloat(this.state.mousedown.selectableParentElementStyle.width) - deltaX + "px";

					/* update underlaying element */
					//Update matrix tranform
					var originalTransformString = this.state.mousedown.selectableParentElementStyle.transform;

					deltaApplied = transformMatrixToString(accumulateTransformMatrixValue(originalTransformString, "tx", deltaX));

					styleObject.transform = deltaApplied;

					styleObject.width = parseFloat(this.state.mousedown.selectableParentElementStyle.width) - deltaX + "px";
				}
				var el = ReactDOM.findDOMNode(element);
				if (el.dataset.id) {
					var model = backboneModelHelper.findMovableElementOfModelByCID(el.dataset.id);
					model.updateStyleByObject(styleObject);
				}
				var mousedownState = this.state.mousedown;
				if (mousedownState.transitionState != "mousemove") {
					mousedownState.transitionState = "mousemove";
				}
			}
		}
	}
	handleClick(event) {
		//console.log("Clicked: SelectionBoxView");
	}
	update() {
		//console.log("==========================================");
		this.forceUpdate();
	}
	componentWillReceiveProps(newProps) {
		if (this.props.selectableParentElement) {
			var model = backboneModelHelper.findModelByCID(this.props.selectableParentElement.dataset.id);
			if (model && (!this.state.model || this.state.model.cid != model.cid)) {
				console.log("SelectonBoxView Model updated.");
				if (this.state.model) {
					this.state.model.off("change", this.update);
				}
				model.on("change", this.update);
				this.setState({
					model: model
				});
			}
		}
	}
	componentDidUpdate() {
		var model = null;
		try {
			model = backboneModelHelper.findModelByCID(this.props.selectableParentElement.dataset.id);
		} catch (e) {
			return;
		}
		if (model && (!this.state.model || this.state.model.cid != model.cid)) {
			console.log("SelectonBoxView Model updated.");
			if (this.state.model) {
				this.state.model.off("change", this.update);
			}
			model.on("change", this.update);
			this.setState({
				model: model
			});
		}
		var policy = model.get("policy");
		var handlers = $(ReactDOM.findDOMNode(this)).find(".handle");
		if (!policy || !policy.selectionBox || !policy.selectionBox.view) {
			// no policy defined, thus show all controllers
			handlers.show();
		} else {
			handlers.hide();
			var classArray = [];
			var properties = Object.getOwnPropertyNames(policy.selectionBox.view);
			for (var i = 0; i < properties.length; i++) {
				classArray.push("." + properties[i]);
			}
			$(ReactDOM.findDOMNode(this)).find(classArray.toString()).show();
		}
	}
	handleMouseDownOnRotateHandler(event) {
		this.setState({
			"mousedown": {
				state: true,
				transitionState: "mousedown",
				event: event.nativeEvent,
				currentTransform: ReactDOM.findDOMNode(event.currentTarget).style.transform,
				currentTarget: event.currentTarget,
				selectableParentElement: this.props.selectableParentElement,
				selectableParentElementStyle: {
					transform: this.props.selectableParentElement.style.transform,
					top: this.props.selectableParentElement.style.top,
					left: this.props.selectableParentElement.style.left,
					width: this.props.selectableParentElement.style.width,
					height: this.props.selectableParentElement.style.height,
					center: {
						top: this.props.selectableParentElement.getBoundingClientRect().top + this.props.selectableParentElement.getBoundingClientRect().height / 2,
						left: this.props.selectableParentElement.getBoundingClientRect().left + this.props.selectableParentElement.getBoundingClientRect().width / 2
					}
				}
			}
		});

		event.stopPropagation();
		window.addEventListener("mousemove", this.handleMouseMoveOnRotateHandler, { passive: false });
		window.addEventListener("mouseup", this.handleMouseUpOnRotateHandler, { passive: false });
		window.addEventListener("touchmove", this.handleMouseMoveOnRotateHandler, { passive: false });
		window.addEventListener("touchend", this.handleMouseUpOnRotateHandler, { passive: false });
	}
	handleMouseDownOnResizeHandler(event) {
		$(".handle").removeClass("active");
		$(event.target).addClass("active");

		this.setState({
			"mousedown": {
				state: true,
				transitionState: "mousedown",
				event: event.nativeEvent,
				currentTransform: ReactDOM.findDOMNode(event.currentTarget).style.transform,
				currentTarget: event.currentTarget,
				selectableParentElement: this.props.selectableParentElement,
				selectableParentElementStyle: {
					transform: this.props.selectableParentElement.style.transform,
					top: this.props.selectableParentElement.style.top,
					left: this.props.selectableParentElement.style.left,
					width: this.props.selectableParentElement.style.width,
					height: this.props.selectableParentElement.style.height
				}
			}
		});

		event.stopPropagation();
		window.addEventListener("mousemove", this.handleMouseMoveOnResizeHandler, { passive: false });
		window.addEventListener("mouseup", this.handleMouseUpOnResizeHandler, { passive: false });
		window.addEventListener("touchmove", this.handleMouseMoveOnResizeHandler, { passive: false });
		window.addEventListener("touchend", this.handleMouseUpOnResizeHandler, { passive: false });
	}
	handleMouseUpOnRotateHandler(event) {
		var mousedownState = this.state.mousedown;
		mousedownState.state = false;
		mousedownState.transitionState = "mouseup";
		this.state.mousedown = null;
		window.removeEventListener("mousemove", this.handleMouseMoveOnRotateHandler, { passive: false });
		window.removeEventListener("mouseup", this.handleMouseUpOnRotateHandler, { passive: false });
		window.removeEventListener("touchmove", this.handleMouseMoveOnRotateHandler, { passive: false });
		window.removeEventListener("touchend", this.handleMouseUpOnRotateHandler, { passive: false });
	}
	handleMouseUpOnResizeHandler(event) {
		var mousedownState = this.state.mousedown;
		mousedownState.state = false;
		mousedownState.transitionState = "mouseup";
		this.state.mousedown = null;
		window.removeEventListener("mousemove", this.handleMouseMoveOnResizeHandler, { passive: false });
		window.removeEventListener("mouseup", this.handleMouseUpOnResizeHandler, { passive: false });
		window.removeEventListener("touchmove", this.handleMouseMoveOnResizeHandler, { passive: false });
		window.removeEventListener("touchend", this.handleMouseUpOnResizeHandler, { passive: false });
	}
	handleMouseMove(event) {
		if (this.state.mousedown && this.state.mousedown.state) {
			console.log("SelectionBoxView: handleMouseMove");
			// mouse down info
			var absInitialMousePointX = this.state.mousedown.event.pageX;
			var absInitialMousePointY = this.state.mousedown.event.pageY;

			// get absolute mouse x and y
			var absMousePointX = event.pageX;
			var absMousePointY = event.pageY;

			//Delta mouse change
			var deltaX = absMousePointX - absInitialMousePointX;
			var deltaY = absMousePointY - absInitialMousePointY;

			// Target element
			var targetElement = this.state.mousedown.currentTarget;
			//var targetElementCoords = targetElement.getClientRects()[0];

			//Update matrix tranform
			var originalTransformString = this.state.mousedown.currentTransform;

			var deltaXApplied = transformMatrixToString(accumulateTransformMatrixValue(originalTransformString, "tx", deltaX));
			var deltaYApplied = transformMatrixToString(accumulateTransformMatrixValue(deltaXApplied, "ty", deltaY));

			ReactDOM.findDOMNode(targetElement).style.transform = deltaYApplied;

			// update underlaying element
			targetElement = this.props.selectableParentElement;
			//var targetElementCoords = targetElement.getClientRects()[0];

			//Update matrix tranform
			var originalTransformString = this.state.mousedown.currentTransform;

			var deltaXApplied = transformMatrixToString(accumulateTransformMatrixValue(originalTransformString, "tx", deltaX));
			var deltaYApplied = transformMatrixToString(accumulateTransformMatrixValue(deltaXApplied, "ty", deltaY));

			ReactDOM.findDOMNode(targetElement).style.transform = deltaYApplied;

			//transformMatrixToString(accumulateTransformMatrixValue("matrix(1,0,0,1,0,0)", "tx", 10))
			console.log();
			var mousedownState = this.state.mousedown;
			if (mousedownState.transitionState != "mousemove") {
				mousedownState.transitionState = "mousemove";
			}
		}
	}
	handleMouseDown(e) {
		e.preventDefault();
		this.setState({
			"mousedown": {
				state: true,
				transitionState: "mousedown",
				event: e.nativeEvent,
				currentTransform: ReactDOM.findDOMNode(e.currentTarget).style.transform,
				currentTarget: e.currentTarget
			}
		});
		e.stopPropagation();
		window.addEventListener("mousemove", this.handleMouseMove, { passive: false });
		window.addEventListener("touchmove", this.handleMouseMove, { passive: false });
	}
	handleMouseUp(e) {
		var mousedownState = this.state.mousedown;
		mousedownState.state = false;
		mousedownState.transitionState = "mouseup";
		window.removeEventListener("mousemove", this.handleMouseMove, { passive: false });
		window.removeEventListener("touchmove", this.handleMouseMove, { passive: false });
	}
	styles() {
		if (this.props.selectableParentElement && this.props.selectableParentElement.classList.contains('selectable') && this.props.eventType && this.props.eventType != "dblclick") {
			var pageModel = backboneModelHelper.findParentPageOfModelByCID($(this.props.selectableParentElement).data("id"));
			var multipageModel = backboneModelHelper.findParentMultipageOfModelByCID($(this.props.selectableParentElement).data("id"));
			var style = this.state.model ? this.state.model.get("style") : this.props.selectableParentElement.style;
			//console.log(style);
			return {
				"style": {
					transformOrigin: this.props.selectableParentElement.style.transformOrigin,
					transform: this.props.selectableParentElement.style.transform,
					width: style.width,
					height: style.height,
					top: parseFloat(pageModel.get("style").top) + parseFloat(multipageModel.get("style").top),
					left: parseFloat(multipageModel.get("style").left)
				}
			};
		}
		return {
			"style": {
				"zIndex": "1000",
				"position": "absolute"
			}
		};
	}
	render() {
		return React.createElement("div", { className: "selectionBox", style: this.styles().style,
			onClick: this.handleClick, onMouseDown: this.handleMouseDown, onMouseUp: this.handleMouseUp,
			onTouchStart: this.handleClick, onTouchEnd: this.handleMouseDown, onTouchMove: this.handleMouseUp
		}, React.createElement("div", { className: "handle tl", onMouseDown: this.handleMouseDownOnResizeHandler }), React.createElement("div", { className: "handle t", onMouseDown: this.handleMouseDownOnResizeHandler }), React.createElement("div", { className: "handle tr", onMouseDown: this.handleMouseDownOnResizeHandler }), React.createElement("div", { className: "handle r", onMouseDown: this.handleMouseDownOnResizeHandler }), React.createElement("div", { className: "handle bl", onMouseDown: this.handleMouseDownOnResizeHandler }), React.createElement("div", { className: "handle b", onMouseDown: this.handleMouseDownOnResizeHandler }), React.createElement("div", { className: "handle br", onMouseDown: this.handleMouseDownOnResizeHandler }), React.createElement("div", { className: "handle l", onMouseDown: this.handleMouseDownOnResizeHandler }), React.createElement("div", { className: "handle rotate" }, React.createElement("div", { className: "rotateHandle", onMouseDown: this.handleMouseDownOnRotateHandler })));
	}
}

class Toolbar extends React.Component {
	constructor(props) {
		super(props);
		this.isSmallScreen = false;
		this.toolBarBreakPoint = 800;
		this.handleMousedown = this.handleMousedown.bind(this);
		this.handleMousedown = this.handleMousedown.bind(this);
	}
	handleMousedown(event) {
		event.preventDefault();
		event.stopPropagation();
	}
	handleMousedown(event) {
		event.preventDefault();
		event.stopPropagation();
	}
	render() {
		return React.createElement("div", { className: "toolbar", onMouseDown: this.handleMousedown,
			onTouchStart: this.handleMousedown });
	}
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.eventType == MOUSE_EVENTS.DBLCLICK) {
			console.log("SHOW DBLCLICK TOOLS");
		}
		// Blue text area
		if (this.props.selectedElement && this.props.selectedElement.classList.contains("editableText") && !$(nextProps.selectedElement).is(this.props.selectedElement)) {
			var el = $(this.props.selectedElement).find(".editableContainer").get(0);
			el.setAttribute("contenteditable", false);
			el.blur();
		}
		if ($(this.props.selectedElement).is(nextProps.selectedElement) && nextProps.eventType == this.props.eventType) {
			var shouldToolbarToggle = parseInt($(".toolbar").width()) < this.toolBarBreakPoint ? true : false;
			if (shouldToolbarToggle != this.isSmallScreen) {
				this.isSmallScreen = shouldToolbarToggle;
				return true;
			}
			console.log("ignore");
			return false;
		}
		console.warn("Updating toolbar");
		return true;
	}
	componentDidUpdate() {
		this.isSmallScreen = parseInt($(".toolbar").width()) < this.toolBarBreakPoint ? true : false;
		var buttons = new Array();
		if (this.props.selectedElement) {
			var cid = $(this.props.selectedElement).data("id");

			if (cid) {
				var arr = backboneModelHelper.findParentChainOfModelByCID(cid);
				arr.push(backboneModelHelper.findModelByCID(cid));
				for (var i = 0; i < arr.length; i++) {
					var element = arr[i];
					if (element.getToolbarButtons) {
						var ar = element.getToolbarButtons(this.isSmallScreen, this.props.eventType, this.props.clearMousedownEventFromDocument, this.props.clearMousedownEventFromDocument);
						if (Array.isArray(ar)) {
							for (var j = 0; j < ar.length; j++) {
								var button = ar[j];
								buttons.push(button);
							}
							buttons.push(new ToolbarItemSeperator());
						}
					}
				}
			}
		}
		var toolbar = new ToolbarHelper();
		toolbar.clear();
		if (buttons.length) {
			//remove last seperator
			buttons.splice(buttons.length - 1, 1);
			for (var i = 0; i < buttons.length; i++) {
				var button = buttons[i];
				if (button instanceof Button) {
					toolbar.addButton(button);
				}if (button instanceof GroupedButtonTab) {
					toolbar.addButton(button);
				} else if (button instanceof ToolbarItemSeperator) {
					toolbar.addSeperator(button);
				}
			}
		}
		if ($(".toolbar").children().length) {
			$(".toolbar").addClass("active");
			$(".document").addClass("active");
			$(".document").css("height", "calc(100% - 44px)");
		} else {
			$(".toolbar").removeClass("active");
			$(".document").removeClass("active");
			$(".document").css("height", "calc(100%)");
		}
	}
};

class CropBoxView extends React.Component {
	constructor(props) {
		super(props);
		this.handleImageOnClick = this.handleImageOnClick.bind(this);
		this.handleImageOnMouseDown = this.handleImageOnMouseDown.bind(this);
		this.handleImageOnMouseUp = this.handleImageOnMouseUp.bind(this);
		this.handleImageOnMouseMove = this.handleImageOnMouseMove.bind(this);
	}
	handleImageOnClick(event) {
		event.stopPropagation();
	}
	handleImageOnMouseDown(event) {
		event.preventDefault();
		event.stopPropagation();
		this.setState({
			"mousedown": {
				state: true,
				transitionState: "mousedown",
				event: event.nativeEvent,
				currentTransform: ReactDOM.findDOMNode(event.currentTarget).style.transform,
				currentTarget: event.currentTarget
			}
		});
		window.addEventListener("mousemove", this.handleImageOnMouseMove, { passive: false });
		window.addEventListener("mouseup", this.handleImageOnMouseUp, { passive: false });
		window.addEventListener("touchmove", this.handleImageOnMouseMove, { passive: false });
		window.addEventListener("touchend", this.handleImageOnMouseUp, { passive: false });
		console.log("MouseDown: handleImageOnMouseDown");
	}
	handleImageOnMouseMove(event) {
		event.preventDefault();
		event.stopPropagation();
		console.log("MouseMove: handleImageOnMouseMove");
		if (this.state.mousedown && this.state.mousedown.state) {
			console.log("CropBoxView: handleMouseMove");
			// mouse down info
			var absInitialMousePointX = this.state.mousedown.event.pageX || this.state.mousedown.event.changedTouches[0].pageX;
			var absInitialMousePointY = this.state.mousedown.event.pageY || this.state.mousedown.event.changedTouches[0].pageY;

			// get absolute mouse x and y
			var absMousePointX = event.pageX || event.changedTouches[0].pageX;
			var absMousePointY = event.pageY || event.changedTouches[0].pageY;

			//Delta mouse change
			var deltaX = absMousePointX - absInitialMousePointX;
			var deltaY = absMousePointY - absInitialMousePointY;

			// Target element
			var targetElement = this.state.mousedown.currentTarget;
			var targetRect = targetElement.getBoundingClientRect();
			//var targetElementCoords = targetElement.getClientRects()[0];

			//Update matrix tranform
			var originalTransformString = this.state.mousedown.currentTransform;
			var orignalTransformObj = transformMatrixDecode(originalTransformString);
			var deltaXApplied = transformMatrixToString(accumulateTransformMatrixValue(originalTransformString, "tx", deltaX));
			var deltaYApplied = transformMatrixToString(accumulateTransformMatrixValue(deltaXApplied, "ty", deltaY));

			//varify if this tranformation is legal
			var imageRect = $(this.props.cropBoxElement).find('img')[0].getBoundingClientRect();
			//Left and top bounds
			var deltaAppliedObject = transformMatrixDecode(deltaYApplied);

			if (deltaAppliedObject.rotate && Math.abs(Math.round(Math.sin(deltaAppliedObject.rotate * Math.PI / 180))) == 1) {
				// Element has rotated 90* or 270* 
				var tx = (parseFloat(imageRect.width) - parseFloat(imageRect.height)) / 2;
				var ty = (parseFloat(imageRect.height) - parseFloat(imageRect.width)) / 2;

				if (deltaAppliedObject.tx >= tx) {
					deltaAppliedObject.tx = tx;
				}
				if (deltaAppliedObject.ty >= ty) {
					deltaAppliedObject.ty = ty;
				}
				// Bottom and right bounds
				var parent = this.state.mousedown.currentTarget.parentElement;
				if (deltaAppliedObject.tx <= -1 * Math.abs(targetRect.width - parent.clientWidth - tx)) {
					deltaAppliedObject.tx = -1 * Math.abs(targetRect.width - parent.clientWidth - tx);
				}
				if (deltaAppliedObject.ty <= -1 * Math.abs(targetRect.height - parent.clientHeight - ty)) {
					deltaAppliedObject.ty = -1 * Math.abs(targetRect.height - parent.clientHeight - ty);
				}
			} else {
				if (deltaAppliedObject.tx >= 0) {
					deltaAppliedObject.tx = 0;
				}
				if (deltaAppliedObject.ty >= 0) {
					deltaAppliedObject.ty = 0;
				}
				// Bottom and right bounds
				var parent = this.state.mousedown.currentTarget.parentElement;
				if (deltaAppliedObject.tx <= -1 * (targetElement.width - parent.clientWidth)) {
					deltaAppliedObject.tx = -1 * (targetElement.width - parent.clientWidth);
				}
				if (deltaAppliedObject.ty <= -1 * (targetElement.height - parent.clientHeight)) {
					deltaAppliedObject.ty = -1 * (targetElement.height - parent.clientHeight);
				}
			}

			// prepare a legal tranformation
			var deltaApplied = transformMatrixToString(deltaAppliedObject);

			ReactDOM.findDOMNode(targetElement).style.transform = deltaApplied;

			var mousedownState = this.state.mousedown;
			if (mousedownState.transitionState != "mousemove") {
				mousedownState.transitionState = "mousemove";
			}
		}
	}
	handleImageOnMouseUp(event) {
		var mousedownState = this.state.mousedown;
		mousedownState.state = false;
		mousedownState.transitionState = "mouseup";
		this.state.mousedown = null;

		window.removeEventListener("mousemove", this.handleImageOnMouseMove, { passive: false });
		window.removeEventListener("mouseup", this.handleImageOnMouseUp, { passive: false });
		window.removeEventListener("touchmove", this.handleImageOnMouseMove, { passive: false });
		window.removeEventListener("touchend", this.handleImageOnMouseUp, { passive: false });
	}
	getImageUrl() {
		return $(this.props.cropBoxElement).find("img")[0].src;
	}
	getImageStyle() {
		return {
			transform: $(this.props.cropBoxElement).find("img")[0].style.transform,
			width: $(this.props.cropBoxElement).find("img")[0].style.width,
			height: $(this.props.cropBoxElement).find("img")[0].style.height
		};
	}
	styles() {
		var ret = {
			element: {
				width: null,
				height: null,
				transform: null
			},
			cropBoxElement: null
		};
		if (this.props.eventType == "dblclick") {
			var multipage = $(this.props.cropBoxElement).closest(".multipage");
			var page = $(this.props.cropBoxElement).closest(".page");
			var element = $(this.props.cropBoxElement).closest(".element");
			var imageContainerCell = $(this.props.cropBoxElement).closest(".imageContainerCell");
			var pageRect = page[0].getBoundingClientRect();
			//Find cropBoxController position
			var crobBoxControllerTransform = transformMatrixToString(accumulateTransformMatrixValue(element[0].style.transform, "tx", parseFloat(multipage.css("left")) + parseFloat(page.css("left"))));
			crobBoxControllerTransform = transformMatrixToString(accumulateTransformMatrixValue(crobBoxControllerTransform, "ty", parseFloat(multipage.css("top")) + parseFloat(page.css("top"))));

			var crobBoxControllerTransformObject = transformMatrixDecode(crobBoxControllerTransform);
			var clientRect = $(this.props.cropBoxElement)[0].getBoundingClientRect();
			var obj = {
				bottom: clientRect.bottom,
				height: clientRect.height,
				left: clientRect.left - pageRect.left - crobBoxControllerTransformObject.tx + parseFloat(multipage.css("left")),
				right: clientRect.right,
				top: clientRect.top - pageRect.top - crobBoxControllerTransformObject.ty + parseFloat(multipage.css("top")),
				width: clientRect.width
			};
			obj.top += parseFloat(page.css("top"));
			obj.left += parseFloat(page.css("left"));
			var ret = {
				element: {
					width: element.width(),
					height: element.height(),
					transform: crobBoxControllerTransform,
					display: "block"
				},
				innerView: {
					top: 0,
					left: 0,
					right: 0,
					bottom: 0
				},
				viewPort: obj
			};
		}
		return {
			style: ret
		};
	}
	render() {
		return React.createElement("div", { className: "cropBox", style: this.styles().style.element }, React.createElement("div", { className: "viewPort", style: this.styles().style.viewPort }, this.props.eventType == "dblclick" && React.createElement("div", { className: "innerView", style: this.styles().style.innerView }, React.createElement("img", { src: this.getImageUrl(), style: this.getImageStyle(),

			onMouseDown: this.handleImageOnMouseDown,
			onTouchStart: this.handleImageOnMouseDown }))), React.createElement("div", { className: "cropBoxHandlers" }, React.createElement("div", { className: "handle tl", onMouseDown: this.handleMouseDownOnResizeHandler, onMouseMove: this.handleMouseMoveOnResizeHandler }), React.createElement("div", { className: "handle tr", onMouseDown: this.handleMouseDownOnResizeHandler, onMouseMove: this.handleMouseMoveOnResizeHandler }), React.createElement("div", { className: "handle bl", onMouseDown: this.handleMouseDownOnResizeHandler, onMouseMove: this.handleMouseMoveOnResizeHandler }), React.createElement("div", { className: "handle br", onMouseDown: this.handleMouseDownOnResizeHandler, onMouseMove: this.handleMouseMoveOnResizeHandler })));
	}
}
/*
	Document contains Page and seletion square

	selected element must register with the document. When CropBoxView or SelectionBoxView renders it gets 
		props from Document that containers selectedElement, cropBoxElement ... so on.
*/
class DocumentView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"selectedElement": null,
			"selectedElementStyle": {},
			"selectableParentElement": null,
			"selectableParentElementStyle": null,
			"cropBoxElement": null,
			"cropBoxElementCallback": null,
			"eventType": null
		};
		this.handleMousedown = this.handleMousedown.bind(this);
		this.onElementSelectionCallback = this.onElementSelectionCallback.bind(this);
		this.onElementMoveCallback = this.onElementMoveCallback.bind(this);
		this.registerMousedownEventWithDocument = this.registerMousedownEventWithDocument.bind(this);
		this.getRegisteredMousedownEventFromDocument = this.getRegisteredMousedownEventFromDocument.bind(this);
		this.clearMousedownEventFromDocument = this.clearMousedownEventFromDocument.bind(this);
	}
	componentWillMount() {
		this.props.data.on("change", $.proxy(function () {
			if (debug.trace) console.log("DocumentView: force updating");
			this.forceUpdate();
		}, this));
		window.addEventListener("resize", function (e) {
			this.props.data.get("children")[0].handleWindowResizeEvent();
			this.forceUpdate();
		}.bind(this));
	}
	defautStyles() {
		return {
			width: "100%",
			height: "100%",
			position: "absolute",
			overflow: "auto"
		};
	}
	styles() {
		var object = $.extend({}, this.defautStyles());
		return {
			style: object
		};
	}
	handleMousedown(event) {
		this.clearMousedownEventFromDocument(event);
	}
	registerMousedownEventWithDocument(element, callback, e, backboneModel) {
		var eventType = e.type.replace("react-", "");
		console.log("Calledbacked: onElementMoveCallback. EventType: " + eventType);
		var selectableParentElement = $(element).closest(".selectableParent").get(0);
		this.setState({
			"mousedown": {
				state: true,
				isMouseMoved: false,
				transitionState: "mousedown",
				event: e.nativeEvent,
				currentTransform: ReactDOM.findDOMNode(e.currentTarget).style.transform,
				currentTarget: e.currentTarget
			},
			"selectedElement": element,
			"selectedElementStyle": {
				transform: element.style.transform,
				top: element.style.top,
				left: element.style.left,
				width: element.style.width,
				height: element.style.height,
				transformOrigin: element.style.transformOrigin
			},
			"selectableParentElement": selectableParentElement,
			"handler": e.target,
			"selectableParentElementStyle": {
				transform: selectableParentElement.style.transform,
				top: selectableParentElement.style.top,
				left: selectableParentElement.style.left,
				width: selectableParentElement.style.width,
				height: selectableParentElement.style.height,
				transformOrigin: selectableParentElement.style.transformOrigin
			},
			"cropBoxElement": element,
			"cropBoxElementCallback": callback,
			"eventType": eventType,
			"backboneModel": backboneModel,
			"isSelection": true
		});
	}
	getRegisteredMousedownEventFromDocument() {
		return {
			mousedown: this.state.mousedown,
			selectedElement: this.state.selectedElement,
			selectedElementStyle: this.state.selectedElementStyle,
			selectableParentElement: this.state.selectableParentElement,
			selectableParentElementStyle: this.state.selectableParentElementStyle
		};
	}
	clearMousedownEventFromDocument() {
		this.setState({
			"mousedown": null,
			"selectedElement": null,
			"selectedElementStyle": null,
			"selectableParentElement": null,
			"selectableParentElementStyle": null,
			"cropBoxElement": null,
			"cropBoxElementCallback": null,
			"isSelection": false,
			"eventType": null
		});
	}
	onElementMoveCallback(element, callback, event, backboneModel) {
		var eventType = "";
		try {
			eventType = event.type.replace("react-", "");
		} catch (e) {
			return;
		}
		console.log("Calledbacked: onElementMoveCallback. EventType: " + eventType);
		var selectableParentElement = $(element).closest(".selectableParent").get(0);
		this.setState({
			selectedElement: element,
			selectedElementStyle: {
				transform: element.style.transform,
				top: element.style.top,
				left: element.style.left,
				width: element.style.width,
				height: element.style.height
			},
			"cropBoxElement": element,
			"cropBoxElementCallback": callback,
			"eventType": eventType,
			"event": event,
			"isSelection": false,
			"backboneModel": backboneModel
		});
	}
	onElementSelectionCallback(element, callback, event, backboneModel) {
		var eventType = "";
		try {
			eventType = event.type.replace("react-", "");
		} catch (e) {
			return;
		}
		console.log("Calledbacked: onElementSelectionCallback. EventType: " + eventType);
		var selectableParentElement = $(element).closest(".selectableParent").get(0);
		this.setState({
			selectedElement: element,
			selectedElementStyle: {
				transform: element.style.transform,
				top: element.style.top,
				left: element.style.left,
				width: element.style.width,
				height: element.style.height,
				transformOrigin: element.style.transformOrigin
			},
			"selectableParentElement": selectableParentElement,
			"selectableParentElementStyle": {
				transform: selectableParentElement.style.transform,
				top: selectableParentElement.style.top,
				left: selectableParentElement.style.left,
				width: selectableParentElement.style.width,
				height: selectableParentElement.style.height,
				transformOrigin: selectableParentElement.style.transformOrigin
			},
			"cropBoxElement": element,
			"cropBoxElementCallback": callback,
			"eventType": eventType,
			"event": event,
			"backboneModel": backboneModel,
			"isSelection": true
		});
	}
	render() {
		return React.createElement("div", { className: "document", style: this.styles().style, "data-id": this.props.data.cid,
			onMouseDown: this.handleMousedown,
			onTouchStart: this.handleMousedown }, React.createElement(Toolbar, { selectedElement: this.state.selectedElement, eventType: this.state.eventType,
			clearMousedownEventFromDocument: this.clearMousedownEventFromDocument }), React.createElement(CropBoxView, { data: this.props.data, eventType: this.state.eventType, cropBoxElement: this.state.cropBoxElement, cropBoxElementCallback: this.state.cropBoxElementCallback }), React.createElement(SelectionBoxView, { data: this.props.data,
			selectedElement: this.state.selectedElement, selectedElementStyle: this.state.selectedElementStyle,
			selectableParentElement: this.state.selectableParentElement, selectableParentElementStyle: this.state.selectableParentElementStyle,
			eventType: this.state.eventType }), this.props.data.get("children").map(multipage => {
			var cid = multipage.cid;
			return React.createElement(MultipageView, { key: cid, data: multipage,
				onElementSelectionCallback: this.onElementSelectionCallback,
				onElementMoveCallback: this.onElementMoveCallback,
				registerMousedownEventWithDocument: this.registerMousedownEventWithDocument,
				getRegisteredMousedownEventFromDocument: this.getRegisteredMousedownEventFromDocument,
				clearMousedownEventFromDocument: this.clearMousedownEventFromDocument });
		}));
	}
}

window.ViewRegistry = {};
ViewRegistry.document = DocumentView;
ViewRegistry.multipage = MultipageView;
ViewRegistry.page = PageView;
ViewRegistry.element = ElementView;
ViewRegistry.fixedCollageContainer = FixedCollageContainerView;
ViewRegistry.collageContainer = CollageContainerView;
ViewRegistry.row = RowView;
ViewRegistry.column = ColumnView;
ViewRegistry.cell = CellView;
ViewRegistry.cellContent = CellContentView;
ViewRegistry.cellImage = CellImageView;

ViewRegistry.shapeCircle = ShapeCircleView;
ViewRegistry.editableText = EditableTextView;
/*ViewRegistry.elements = ElementsView;


*/
/*initialize application*/

//Create backbone dataMOdel

var dataModel = null;
//localStorage.clear();
if (localStorage.getItem("model")) {
	var doc = new DocumentModel(JSON.parse(localStorage.getItem("model")), { silent: true });
	convert(doc);
	dataModel = doc;
} else {
	dataModel = modelWalkRecursive(Model);
}
//var dataModel = (localStorage.getItem("model")) ? modelWalkRecursive([JSON.parse(localStorage.getItem("model"))]): modelWalkRecursive(Model);
// Initialize backboneModelHelper so that we can use it
var backboneModelHelper = new BackboneModelHelper(dataModel);
// var check for cyclic paths
checkCircles(dataModel);

// Render html
ReactDOM.render(React.createElement(DocumentView, { data: dataModel }), document.getElementsByClassName("editorPanel")[0]);

// Initialize multipage custom event handler 
//meventProcessor = new MultipageEventProcess(document.getElementsByClassName('multipage')[0]);


/* Save model periodically */
var localStorageSaveTimer = window.setInterval(function () {
	// We only save the most recent opened browers model
	if (localStorage.getItem("localStorageSaveTimer") == localStorageSaveTimer) {
		localStorage.removeItem("model");
		localStorage.setItem("model", JSON.stringify(dataModel.toJSON()));
	}

	//console.log("Saved.");
}.bind(this), 1000);

localStorage.setItem("localStorageSaveTimer", localStorageSaveTimer);
// Fit to page
setTimeout(function () {
	var bestFitZoom = 4 * parseInt(100 * ($(".document").width() / backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].attributes.pageWidth) / 4);
	backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({
		"zoom": bestFitZoom / 100
	});
	$(".zoomOptions .menu").text(bestFitZoom + "%");
	$(".zoomOptionList > ul > li").removeClass("active");
	$(".zoomOptionList > ul > li[data-zoom=a]").addClass("active");
}.bind(this), 1000);

function randomNumber() {
	return Math.floor(Math.random() * 100000 + 1);
}