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
  
  var $iframeDoc, $iframeHead, $iframeBody;

  $iframe.addEventListener("load", function(e) {
    // Cache iframe's document, head, and body objects on iframe load event
    // otherwise it often queries empty head tag
    $iframeDoc  = $iframe.contentDocument,
    $iframeHead = $iframeDoc.head,
    $iframeBody = $iframeDoc.body;
  });
 
  
  var returnConfigObj = function(obj) {
    var cfgObj = {
      lineNumbers: true,
      tabSize: 2,
      lineWrapping: true,
      theme: "monokai",
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
    jsEditor.setValue("'use strict'; // jQuery included");
  }



  var changeScriptType = function() {
    try {
      var scripts = $iframeHead.getElementsByTagName("script");
      var js = scripts[scripts.length -1];
      js.setAttribute("type", "text/js");
    } catch(e) {
      $iframe.contentWindow.location.reload();
    }
  }

  
  
  var changeJSButton = function(active) {
    if(!active) {
      $runJS.classList.add("js-active");
    } else {
      $runJS.classList.remove("js-active");
    }
  }



  // Editor callbacks
  var htmlCallback = Helpers.debounce(function(cm, evt) {
    $iframe.contentDocument.body.innerHTML = htmlEditor.getValue();
    changeScriptType();
    changeJSButton(false);
  }, 20);

 

  var createScript = function(obj) {
    var newElement = $iframeDoc.createElement(obj.tag);
    newElement.setAttribute("type", "text/javascript");
    newElement.textContent = obj.editor;
    $iframeHead.removeChild(obj.old);
    $iframeHead.appendChild(newElement);
  }

  
  
  var cloneScript = function(obj) {
    var cloneElement = obj.old.cloneNode(true);
    cloneElement.type = "text/js";
    $iframeHead.removeChild(obj.old);
    $iframeHead.appendChild(cloneElement);
  }
  
 
  
  var createStyle = function(obj) {
    // var newStyle = $iframeDoc.createElement(obj.tag);
    // newStyle.textContent = obj.editor;
    obj.old.textContent = obj.editor;
    // $iframeHead.appendChild(newStyle);
  }


  
  var insertNewDOMNode = function(obj) {
    try {
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
    } catch(e) {
      $iframe.contentWindow.location.reload();
    }
     
  }
 
  
  
  var cssCallback = Helpers.debounce(function(cm, evt) {
    insertNewDOMNode({
      tag: "style",
      editor: cssEditor.getValue()
    });
    changeScriptType();
    changeJSButton(false);
  }, 20);

  
  
  var jsCallback = function(evt) {
    insertNewDOMNode({
      tag: "script",
      editor: jsEditor.getValue()
    });

    changeJSButton(true);
  }
  
  
  
  var clearEditor = function() {
    if(!confirm("Are you sure?")) return;
    setDefaultValues();
    htmlCallback();
    cssCallback();
    jsCallback();
  }

  
  var toggleEditorVisibility = function() {
    $editor.style.display = ($editor.style.display === "none") ? "flex" : "none";
  }

  var changeViewport = function(obj) {
    var el = obj.element;

    if(obj.width !== "100%") {
      Object.assign(el.style, { 
        border: "1px solid #ccc", 
        margin: "20px auto",
        overflow: "scroll",
        width: obj.width + "px",
        height: obj.height + "px"
      });
    } else {
      Object.assign(el.style, {
        width: obj.width,
        height: obj.height,
        margin: "0 auto",
        border: "none"
      });
    }
  }

  var iframeResize = function(e) {
    var index = e.srcElement.selectedIndex || e.target.selectedIndex,
        el = e.target[index],
        viewportWidth = el.dataset.width,
        viewportHeight = el.dataset.height;
    
     changeViewport({
       element: $iframe,
       width: viewportWidth,
       height: viewportHeight
     });

     cssCallback();
  }

  var headerListeners = function() {
    $resizeIframe.addEventListener("change", iframeResize);
    $runJS.addEventListener("click", jsCallback);
    $toggleButton.addEventListener("click", toggleEditorVisibility);
    $clearFieldsButton.addEventListener("click", clearEditor);
  }
  
  var editorListeners = function() {
    htmlEditor.on("keyup", htmlCallback);
    cssEditor.on("keyup", cssCallback);
    jsEditor.on("keyup", htmlCallback);
  }

  var setupListeners = function() {
    headerListeners();
    editorListeners();
  }
  


  return {
    init: function() {
      setupListeners(); // sets up eventlisteners on editor fields and buttons in header
      setDefaultValues(); // sets placeholders of editor fields
      Helpers.setHeightOnElements({
        className: "CodeMirror", 
        height: 220
      });
    }
  }

})(Helpers);

document.addEventListener("DOMContentLoaded", function(e) {
  CodePlayer.init();
});
