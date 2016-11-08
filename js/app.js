var CodePlayer = (function() {
  // could use querySelector
 var $editor = document.getElementsByClassName("editor")[0],
      $htmlEditor = document.getElementsByClassName("html")[0],
      $cssEditor = document.getElementsByClassName("css")[0],
      $jsEditor = document.getElementsByClassName("javascript")[0];

  var $iframe = document.getElementById("output"),
      $iframeDoc  = $iframe.contentDocument,
      $iframeHead = $iframe.contentDocument.head,
      $iframeBody = $iframe.contentDocument.body;
 
  var $style = $iframeDoc.createElement("style"),
      $script = $iframeDoc.createElement("script");

  var initialDOMAppend = function() {
    $iframeHead.appendChild($style);
    $script.type = "text/javascript";
    $iframeHead.appendChild($script);
  }

  var $toggleButton = document.getElementsByClassName("header-toggle")[0],
      $clearFieldsButton = document.getElementsByClassName("header-clear")[0],
      $runJS = document.getElementsByClassName("header-run-js")[0];


  // Helper methods
  var debounce = function(callback, time, immediate) {
    var timeout;
    return function() {
      var that = this,
          args = arguments;
      var later = function() {
        timeout = null;
        if(!immediate) callback.apply(that, args);
      }

      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, time);
      if(callNow) {
        callback.apply(that, args);
      }
    }
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
  var htmlEditor = CodeMirror.fromTextArea($htmlEditor, returnConfigObj({mode: "text/xml"})),
      cssEditor = CodeMirror.fromTextArea($cssEditor, returnConfigObj({mode: "text/css"})),
      jsEditor = CodeMirror.fromTextArea($jsEditor, returnConfigObj({mode: "text/javascript"}));
  
  var setDefaultValues = function() {
    htmlEditor.setValue("<!-- HTML -->");
    cssEditor.setValue("/* CSS */");
    jsEditor.setValue("'use strict'; // JavaScript");
  }


  var setHeightOnElements = function(opts) {
    var elmsArrLike = document.getElementsByClassName(opts.className),
        elArr  = Array.prototype.slice.call(elmsArrLike);

    elArr.forEach(function(el) {
      el.style.height = opts.height + "px";
    });
  }  
  
  // Editor callbacks
  var htmlCallback = function(cm, evt) {
    $iframeBody.innerHTML = htmlEditor.getValue();
    debounce(jsCallback, 3000);
  }

  var insertNewDOMNode = function(obj) {
    var element = $iframeHead.getElementsByTagName(obj.tag)[0];
    if(element) {
      element.parentNode.removeChild(element);
    }

    var newElement = $iframeDoc.createElement(obj.tag);
    newElement.innerHTML = obj.editor;
    $iframeHead.appendChild(newElement);
  }
 
  var cssCallback = function(cm, evt) {
    insertNewDOMNode({
      tag: "style",
      editor: cssEditor.getValue()
    });
  }

  var jsCallback = function(evt) {
    htmlCallback();
    cssCallback();
    insertNewDOMNode({
      tag: "script",
      editor: jsEditor.getValue()
    });
  }
  
  // Header button callbacks
  var clearEditor = function() {
    if(confirm("Are you sure?")) {
      setDefaultValues();;
      $iframeHead.innerHTML = "";
      $iframeBody.innerHTML = "";
      $iframe.contentWindow = {};
      console.clear();
    }
  }

  var toggleEditorVisibility = function() {
    $editor.style.display = ($editor.style.display === "none") ? "flex" : "none";
  }

  var setupListeners = function() {
    $iframeDoc.onreadystatechange = function() { alert("iframe"); };
    htmlEditor.on("keyup", htmlCallback);
    cssEditor.on("keyup", cssCallback);
    $runJS.addEventListener("click", jsCallback);
    $toggleButton.addEventListener("click", toggleEditorVisibility);
    $clearFieldsButton.addEventListener("click", clearEditor);
  }
  

  return {
    init: function() {
      initialDOMAppend(); // appends empty style and script tag to iframe head
      setupListeners(); // sets up eventlisteners on editor fields and buttons in header
      setDefaultValues(); // sets placeholders of editor fields
      setHeightOnElements({className: "CodeMirror", height: 220}); 
    }
  }

})();

CodePlayer.init();
