$(function(){
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
				this.placeCursorAt(this.editor.children[0],0)
			}
			if(this.editor.isSameNode(this.selection.anchorNode) || this.selection.anchorNode.nodeName.match(/div/i)){
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
			var children = this.editor.children;
			for(var i = 0; i < children.length; i++){
				var child = children[i];
				if(!!child.nodeName.match(/span/i)){
					// Concatinate all adjacent text nodes
					var childNodes = child.childNodes;
				}
			}
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
	function insertData(e){
		log(data);
		var inputHandler = new InputHandler();
		if(e.key.length == 1){
			inputHandler.insertText(e.key);
		}
	}
	function backspaceKey(){
		var inputHandler = new InputHandler();
		inputHandler.removePrevious();
	}
	function deleteKey(){
		var inputHandler = new InputHandler();
		inputHandler.removeNext();
	}
	function enterKey(){
		var inputHandler = new InputHandler();
		inputHandler.insertNewline();
	}
	
	$(".editableContainer").on("click", function(e){
		var inputHandler = new InputHandler();
		inputHandler.isCursorWithinAElement();
		window.editor = inputHandler.editor;
		console.log(inputHandler.selection)
		//inputHandler.isAdjacentHTMLNodeContainsText();
	});
	$(".editableContainer").on("keydown", function(e){
		var prevent = true;
		if(e.key.length == 1 && !e.ctrlKey && !e.metaKey && !e.altKey){
			insertData(e, e.key, false);
		}else if(e.key == "Enter"){
			enterKey();
		}else if(e.key == "Backspace"){
			backspaceKey();
		}else if(e.key == "Delete"){
			deleteKey();
		}else if(e.key.indexOf("rrow")){
			prevent = false;
			var inputHandler = new InputHandler();
			inputHandler.isCursorWithinAElement();
			window.editor = inputHandler.editor;
			console.log(inputHandler.selection)
		}
		if(prevent){
			e.preventDefault();
			e.stopPropagation();
		}
	});
	$("#clear").click(function(){
		$("#result").empty();
		console.clear();
	});
	function log(data){
		if(data == "<br>"){
			$("#result").append(data);
		}else{
			$("#result").append(data + "<br>");
		}
		
	}
})