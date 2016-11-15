var CodePlayer = (function(Helpers) {
 
 'use strict';

 // Cache header buttons
 var $toggleButton      = document.querySelector(".header-toggle"),
     $clearFieldsButton = document.querySelector(".header-clear"),
     $runJS             = document.querySelector(".header-run-js"),
     $resizeIframe      = document.querySelector(".header-resize");


 // Cache editor elements
 var $editor     = document.querySelector(".editor"),
     $htmlEditor = document.querySelector(".html"),
     $cssEditor  = document.querySelector(".css"),
     $jsEditor   = document.querySelector(".javascript");

 
  // Cache output elements
  var $output = document.querySelector(".output"),
      $iframe = document.querySelector("#output");
  
 
  // Cache iframe's document, head, and body objects
  var $iframeDoc  = $iframe.contentDocument,
      $iframeHead = $iframe.contentDocument.head,
      $iframeBody = $iframe.contentDocument.body;
 
  
  // Create initial elements to append them in iframe head section
  var initialDOMAppend = function() {
    var $style =  $iframeDoc.createElement("style"),
        $script = $iframeDoc.createElement("script");
        $script.type = "text/js";

    $iframeHead.appendChild($style);
    $iframeHead.appendChild($script);
  }

  var appendThirdPartyScripts = function(arr) {
    var $jq = $iframeDoc.createElement("script"),
        $jqUI = $iframeDoc.createElement("script");
      
    $jq.src = "http://code.jquery.com/jquery-3.1.1.min.js";
    $jqUI.src = "http://code.jquery.com/ui/1.12.1/jquery-ui.min.js";
      
    $iframeHead.appendChild($jq);
    setTimeout(function() {
      Helpers.insertNodeAfter({
        newNode: $jqUI,
        after: $jq
      });
    }, 1000);
  }

 
  
  var returnConfigObj = function(obj) {
    var cfgObj = {
      lineNumbers: true,
      tabSize: 2,
      lineWrapping: true,
      theme: "neo",
      mode: obj.mode
    }

    if(obj.mode === "text/xml") {
      cfgObj.htmlMode = true;
    }

    return cfgObj;
  };

  
  
  // Transform textarea to CodeMirror instances
  var htmlEditor = CodeMirror.fromTextArea(
        $htmlEditor, 
        returnConfigObj({
          mode: "text/xml"
        })),
 
      cssEditor = CodeMirror.fromTextArea(
        $cssEditor, 
        returnConfigObj({
          mode: "text/css"
        })),

      jsEditor = CodeMirror.fromTextArea(
        $jsEditor, 
        returnConfigObj({
          mode: "text/javascript"
        }));
  
  
  
  var setDefaultValues = function() {
    htmlEditor.setValue("<!-- HTML -->");
    cssEditor.setValue("/* CSS */");
    jsEditor.setValue("'use strict'; // JavaScript\n// jQuery\n// jQuery UI included");
  }



  var changeScriptType = function() {
    var scripts = $iframeHead.getElementsByTagName("script"),
        js = scripts[scripts.length - 1];
        js.type = "text/js";
    return;
  }



  // Editor callbacks
  var htmlCallback = Helpers.debounce(function(cm, evt) {
    $iframeBody.innerHTML = htmlEditor.getValue();
    changeScriptType();
    $runJS.innerHTML = "Re-run JS";
  }, 100);

 

  var createScript = function(obj) {
    var newElement = $iframeDoc.createElement(obj.tag);
    newElement.type = "text/javascript";
    newElement.innerHTML = obj.editor;
    $iframeHead.removeChild(obj.old);
    $iframeHead.appendChild(newElement);
    return;
  }

  
  
  var cloneScript = function(obj) {
    var cloneElement = obj.old.cloneNode(true);
    cloneElement.type = "text/js";
    $iframeHead.removeChild(obj.old);
    $iframeHead.appendChild(cloneElement);
    return;
  }
  
 
  
  var createStyle = function(obj) {
    var newStyle = $iframeDoc.createElement(obj.tag);
    newStyle.textContent = obj.editor;
    $iframeHead.removeChild(obj.old);
    $iframeHead.appendChild(newStyle);
    return;
  }


  
  var insertNewDOMNode = function(obj) {
    var elements = $iframeHead.getElementsByTagName(obj.tag),
        element = elements[elements.length - 1];
        obj.old = element;

    if(element.type === "text/js") {    
      createScript(obj);
    } else if(element.type === "text/javascript")  {
      cloneScript(obj);
    } else {
      createStyle(obj);
    } 
     
  }
 
  
  
  var cssCallback = Helpers.debounce(function(cm, evt) {
    insertNewDOMNode({
      tag: "style",
      editor: cssEditor.getValue()
    });
    changeScriptType();
    $runJS.innerHTML = "Re-run JS";
  }, 100);

  
  
  var jsCallback = function(evt) {
    insertNewDOMNode({
      tag: "script",
      editor: jsEditor.getValue()
    });

    $runJS.innerHTML = "Run JS";
  }
  
  
  
  var clearEditor = function() {
    if(confirm("Are you sure?")) {
      setDefaultValues();
      $iframeHead.innerHTML = "";
      $iframeBody.innerHTML = "";
      var all = $iframeDoc.getElementsByTagName("*");
      Helpers.removeInlineStyles(all);
      setupListeners();
      console.clear();
      window.location.reload();
    }
  }

  
  var toggleEditorVisibility = function() {
    $editor.style.display = ($editor.style.display === "none") ? "flex" : "none";
  }

  var changeViewport = function(obj) {
    var el = obj.element;

    if(obj.width !== "100%") {
      el.style.border = "1px solid #ccc";
      el.style.margin = "20px auto";
      el.style.overflow = "scroll";
      el.style.width = obj.width + "px";
      el.style.height = obj.height + "px";
    } else {
      el.style.width = obj.width;
      el.style.height = obj.height;
      el.style.margin = "0 auto";
      el.style.border = "none";
    }
  }

  var iframeResize = function(e) {
    console.log(e);
    var index = e.srcElement.selectedIndex,
        el = e.target[index],
        viewportWidth = el.dataset.width,
        viewportHeight = el.dataset.height;
    console.log(viewportHeight, viewportWidth);
    
     changeViewport({
       element: $iframe,
       width: viewportWidth,
       height: viewportHeight
     });
  }

  var setupListeners = function() {
    htmlEditor.on("keyup", htmlCallback);
    cssEditor.on("keyup", cssCallback);
    jsEditor.on("keyup", htmlCallback); // refresh DOM when you update JavaScript to remove event listeners
    $resizeIframe.addEventListener("change", iframeResize);
    $runJS.addEventListener("click", jsCallback);
    $toggleButton.addEventListener("click", toggleEditorVisibility);
    $clearFieldsButton.addEventListener("click", clearEditor);
  }
  


  return {
    init: function() {
      appendThirdPartyScripts(); // appends 3rd party scripts
      initialDOMAppend(); // appends empty style and script tag to iframe head
      setupListeners(); // sets up eventlisteners on editor fields and buttons in header
      setDefaultValues(); // sets placeholders of editor fields
      Helpers.setHeightOnElements({className: "CodeMirror", height: 220}); 
    }
  }

})(Helpers);

CodePlayer.init();
