function getRandomNumbers(){var e=window.crypto||window.msCrypto,t=new Uint32Array(3);e.getRandomValues(t);for(var o="",a=0;a<t.length;a++)o+=t[a]+"-";return o}function rgbaObjectToCSSRGBAColorString(e){return"rgba("+e.r+","+e.g+","+e.b+","+e.a+")"}function clientRectToObject(e){var t={};return t.bottom=e.bottom,t.height=e.height,t.left=e.left,t.right=e.right,t.top=e.top,t.width=e.width,t}function isPointWithinRectabgle(e,t,o){return o.left<=e&&e<=o.right&&o.top<=t&&t<=o.bottom}function getAllChildNodes(e,t){for(var o=e.childNodes,a=0;a<o.length;a++)t.push(o[a]),getAllChildNodes(o[a],t)}function elementsFromPoint(e,t,o,a){var i=[];getAllChildNodes($(a).get(0),i);for(var n=[],s=0;s<i.length;s++){var l=i[s];l.getBoundingClientRect?isPointWithinRectabgle(e,t,l.getBoundingClientRect())&&n.push(l):console.log("Element does not contain getBoundingClientRect property")}return n.reverse()}$.ajaxSetup({xhrFields:{withCredentials:!0,credentials:"same-origin"}}),$(".resizePanel .resizeCanvas").click(function(e){var t=backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0],o=t.attributes.pageWidth,a=t.get("children")[0].attributes.pageHeight,i=$(".resizeCanvasModal");i.find(".modal-title").text("Update canvas print area");var n=jQuery.parseHTML('<div class="dropdown">    \t<button class="btn btn-primary dropdown-toggle currentSelection" id="menu1" type="button" data-toggle="dropdown">Select a option    \t<span class="caret"></span></button>\t\t<ul class="dropdown-menu" role="menu" aria-labelledby="menu1">\t\t\t<li role="presentation" class="resizeOptionItem preset"><a data-width="1000" data-height="1000" role="menuitem" tabindex="-1" href="#">Social Media - 1000x1000px</a></li>\t\t\t<li role="presentation" class="resizeOptionItem preset"><a data-width="2500" data-height="2000" role="menuitem" tabindex="-1" href="#">Photo Collage - 2500x2000px</a></li>\t\t\t<li role="presentation" class="resizeOptionItem preset"><a data-width="4960" data-height="7016" role="menuitem" tabindex="-1" href="#">A4 - 4960x7016px</a></li>\t\t\t<li role="presentation" class="resizeOptionItem preset"><a data-width="735" data-height="1102" role="menuitem" tabindex="-1" href="#">Pinterest Graphic - 735x1102px</a></li>\t\t\t<li role="presentation" class="divider"></li>\t\t\t<li role="presentation" class="resizeOptionItem custom"><a role="menuitem" tabindex="-1" href="#">Custom</a></li>    \t\t</ul>\t\t<div class="customResizeOptions">\t\t\t<input size="7" type="text" class="form-control option width">\t\t\t<div style="margin: 5px;">px</div>\t\t\t<input size="7" type="text" class="form-control option height">\t\t\t<div style="margin: 5px;">px</div>\t\t</div>  \t</div>'),s=$(n);i.find(".modal-body").html(n),i.modal("show"),s.find(".customResizeOptions .width").val(o),s.find(".customResizeOptions .height").val(a);var l=$("a[data-width="+o+"][data-height="+a+"]");l.length?(l.addClass("active"),s.find(".customResizeOptions input").attr("readonly","")):(i.find(".custom").addClass("active"),s.find(".customResizeOptions input").removeAttr("readonly")),i.find("ul > li:not(.divider)").click(function(e){i.find("ul > li:not(.divider)").removeClass("active");var t=$(e.target).closest("li");t.addClass("active"),t.hasClass("preset")?(i.find(".customResizeOptions input").attr("readonly",""),i.find(".customResizeOptions .width").val(t.find("a").get(0).dataset.width),i.find(".customResizeOptions .height").val(t.find("a").get(0).dataset.height)):i.find(".customResizeOptions input").removeAttr("readonly")}.bind(this)),i.find(".save-changes").click(function(e){e.stopPropagation();var t=i.find(".customResizeOptions .width").val(),o=i.find(".customResizeOptions .height").val();backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({pageWidth:parseInt(t)}),backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].get("children")[0].set({pageHeight:parseInt(o)});var a=4*parseInt($(".document").width()/parseInt(t)*100/4);backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({zoom:a/100}),$(".zoomOptions .menu").text(a+"%"),$(".zoomOptionList > ul > li").removeClass("active"),$(".zoomOptionList > ul > li[data-zoom=a").addClass("active"),i.modal("hide"),e.stopPropagation(),i.find(".save-changes").unbind()}.bind(this))}),$(".resizeButton").click(function(e){parseInt($(".document").width()/backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].attributes.pageWidth*100/4),parseInt($(".document").height()/backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].get("children")[0].attributes.pageHeight*100/4);var t=$(".zoomOptionList > ul > li.active");if("a"==t.get(0).dataset.zoom||"b"==t.get(0).dataset.zoom){if($(e.target).closest(".zoomIn").length){for(var o=parseInt($(".zoomOptions .menu").text()),a=$(".zoomOptionList > ul > li.number"),i=0;i<a.length;i++)if((l=a[i]).dataset.zoom>o){r=l.dataset.zoom;backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({zoom:r/100}),$(".zoomOptionList > ul > li").removeClass("active"),$(l).addClass("active"),$(".zoomOptions .menu").text(r+"%");break}}else for(var o=parseInt($(".zoomOptions .menu").text()),i=(a=$(".zoomOptionList > ul > li.number")).length-1;i>=0;i--)if((l=a[i]).dataset.zoom<o){r=l.dataset.zoom;backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({zoom:r/100}),$(".zoomOptionList > ul > li").removeClass("active"),$(l).addClass("active"),$(".zoomOptions .menu").text(r+"%");break}}else if($(e.target).closest(".zoomIn").length){var n=$(".zoomOptionList > ul > li.active").next();if(n&&n.length&&n.get(0).dataset.zoom){r=n.get(0).dataset.zoom;backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({zoom:r/100}),$(".zoomOptionList > ul > li").removeClass("active"),n.addClass("active"),$(".zoomOptions .menu").text(r+"%")}else for(var o=parseInt($(".zoomOptions .menu").text()),a=$(".zoomOptionList > ul > li.number"),i=0;i<a.length;i++)if((l=a[i]).dataset.zoom>o){r=l.dataset.zoom;backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({zoom:r/100}),$(".zoomOptionList > ul > li").removeClass("active"),$(l).addClass("active"),$(".zoomOptions .menu").text(r+"%");break}}else{var s=$(".zoomOptionList > ul > li.active").prev();if(s&&s.length&&s.get(0).dataset.zoom){r=s.get(0).dataset.zoom;backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({zoom:r/100}),$(".zoomOptionList > ul > li").removeClass("active"),s.addClass("active"),$(".zoomOptions .menu").text(r+"%")}else for(var o=parseInt($(".zoomOptions .menu").text()),i=(a=$(".zoomOptionList > ul > li.number")).length-1;i>=0;i--){var l=a[i];if(l.dataset.zoom<o){var r=l.dataset.zoom;backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({zoom:r/100}),$(".zoomOptionList > ul > li").removeClass("active"),$(l).addClass("active"),$(".zoomOptions .menu").text(r+"%");break}}}}),$(".zoomOptions .menu").click(function(e){$(".zoomOptionPanel").toggleClass("active")}),$(".zoomOptionList > ul > li").click(function(e){if($(".zoomOptionList > ul > li").removeClass("active"),$(e.target).addClass("active"),console.log(e.target.dataset.zoom),"a"==e.target.dataset.zoom||"b"==e.target.dataset.zoom){var t=100;t="a"==e.target.dataset.zoom?4*parseInt($(".document").width()/backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].attributes.pageWidth*100/4):4*parseInt($(".document").height()/backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].get("children")[0].attributes.pageHeight*100/4),backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({zoom:t/100}),$(".zoomOptions .menu").text(t+"%")}else backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({zoom:e.target.dataset.zoom/100}),$(".zoomOptions .menu").text(e.target.dataset.zoom+"%");$(".zoomOptionPanel").toggleClass("active")}),$(".graphicsPanel menu li").click(function(e){$(".graphicsPanel menu li").removeClass("active"),$(this).addClass("active");var t=72*$(this).data("tab")-72;$(".selectedItem").css("transform","translate(0px,"+t+"px)"),sideBarTabMenu.showTab($(this).data("tab"))}),$("a.new-canvas").click(function(e){var t=$(".confirmNewCanvas");t.find(".modal-title").text("Warning!");var o=$($.parseHTML('<div class="">\t\tThis will delete all your changes and creates a blank Canvas. Is that what you want?\t\t</div>\t</div>'));t.find(".modal-body").html(o),t.modal("show"),t.find(".save-changes").click(function(e){e.stopPropagation(),dataModel=modelWalkRecursive(Model),localStorage.setItem("model",JSON.stringify(dataModel.toJSON())),setTimeout(function(e){window.location.reload()},1e3),t.modal("hide"),e.stopPropagation(),t.find(".save-changes").unbind()}.bind(this)),t.on("hide.bs.modal",function(e){t.find(".save-changes").unbind()}.bind(this))}.bind(this)),$("a.convert-option").click(function(e){$(".downloadConvertedDesgin").find(".modal-title").text("Download image");var t=null,o=$($.parseHTML('<div class="progress">\t\t<div class="progress-bar progress-bar-striped active" role="progressbar"\t\taria-valuenow="0" data-value="0" aria-valuemin="0" aria-valuemax="100" style="width:0%">\t\t\t0%\t\t</div>\t</div>'));$(".downloadConvertedDesgin").find(".modal-body").html(o);var a=setInterval(function(e){var o=parseInt($(".downloadConvertedDesgin .progress-bar").attr("data-value"))+10;if(console.log(o),$(".downloadConvertedDesgin .progress-bar").css("width",o+"%"),$(".downloadConvertedDesgin .progress-bar").text(o+"%"),$(".downloadConvertedDesgin .progress-bar").attr("aria-valuenow",o),$(".downloadConvertedDesgin .progress-bar").attr("data-value",o),t){var i=JSON.parse(t);clearInterval(a);var n=$($.parseHTML('<img style="max-width:200px" src="//s3.photojoiner.net/PJ/convert/'+i.path+'"/>\t\t\t\t<a href="//s3.photojoiner.net/PJ/convert/'+i.path+'">\t\t\t\t\tDownload image\t\t\t</a>'));$(".downloadConvertedDesgin").find(".modal-body").html(n)}}.bind(this),1e3);$(".downloadConvertedDesgin").modal("show");var i=backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].get("zoom");backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({zoom:1}),setTimeout(function(){for(var o=$(e.target).data("convert-type"),a=$(".multipage")[0].outerHTML,n=["transform","perspective","perspective-origin","transform-origin","transform-style","background-clip","background-origin","background-size","border-bottom-left-radius","border-bottom-right-radius","border-image","border-radius","border-top-left-radius","border-top-right-radius","box-sizing","opacity","box-ordinal-group","box-orient","box-pack","box-reflect","box-shadow","box-align","box-direction","box-flex","filter"],s=0;s<n.length;s++){var l=n[s],r=new RegExp(l+"(.*?;)","ig");a=a.replace(r,l+"$1 -webkit-"+l+"$1")}for(var d=btoa(a),p=$(".multipage").find(".page"),c=[],s=0;s<p.length;s++){var m=p[s],g={};g.width=$(m).width(),g.height=$(m).height(),g.top=0,g.left=0,c.push(g)}backboneModelHelper.findModelsByType(ModelRegistry.multipage)[0].set({zoom:i}),$.ajax({url:"//s3.photojoiner.net/PJ/convert",data:{data:d,type:o,printArea:JSON.stringify(c)},method:"POST",success:function(e,o){t=e,console.log(e)}.bind(this)})}.bind(this),2e3)}),$("body")[0].addEventListener("touchstart",function(e){$(e.target).closest(".movable").length&&e.preventDefault()},{passive:!1}),setTimeout(function(){$.ajax({url:"//s3.photojoiner.net/PJ/user",credentials:"same-origin"})},1e3),$(".fileupload-button").fileupload({xhrFields:{withCredentials:!0,credentials:"same-origin"},url:"//s3.photojoiner.net/PJ/upload",progress:function(e,t){var o=parseInt(t.loaded/t.total*100,10);console.log(o),$(".site .header .navbar").css("background","linear-gradient(90deg, rgb(214, 214, 214) "+o+"%, rgba(153, 65, 65, 0) 0%").css("backgroundColor","#f8f8f8"),100==o&&$(".site .header .navbar").css("background","linear-gradient(90deg, rgb(214, 214, 214) 0%, rgba(153, 65, 65, 0) 0%").css("backgroundColor","#f8f8f8")},start:function(){toastr.success("Upload in progress. Please wait.")},done:function(e,t){console.log("Upload completed.");try{var o=JSON.parse(t.result).data;fileLibrary.addItemByJSONObject(o)}catch(e){console.log(e)}}}),$(".adsenseContainerCloseButton").click(function(e){$(e.target).closest(".adParentContainer").remove()}),$(".adsenseContainerCloseButton").closest(".adParentContainer").remove();