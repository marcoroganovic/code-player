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

  $iframeHead.appendChild($style);
  $script.type = "text/javascript";
  $iframeHead.appendChild($script);

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
      if(callNow) callback.apply(that, args);
    }
  }

  // Transform textarea to CodeMirror instances
  var htmlEditor = CodeMirror.fromTextArea($htmlEditor, {
    lineNumbers: true,
    tabSize: 2,
    lineWrapping: true,
    theme: "neo",
    mode: "xml",
    htmlMode: true
  });
  
  var cssEditor = CodeMirror.fromTextArea($cssEditor, {
    lineNumbers: true,
    tabSize: 2,
    lineWrapping: true,
    theme: "neo",
    mode: "text/css"
  });

  var jsEditor = CodeMirror.fromTextArea($jsEditor, {
    lineNumbers: true,
    tabSize: 2,
    lineWrapping: true,
    theme: "neo",
    mode: "text/javascript"
  });
  
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
  }
  
  var cssCallback = function(cm, evt) {
    var style = $iframeHead.getElementsByTagName("style")[0];
    if(style) {
      style.parentNode.removeChild(style);
    }  
    var newStyle = $iframeDoc.createElement("style");
    newStyle.innerHTML = cssEditor.getValue();
    $iframeHead.appendChild(newStyle);
  }

  var jsCallback = function(evt) {
    var script = $iframeHead.getElementsByTagName("script")[0];
    if(script) {
      script.parentNode.removeChild(script);
    }

    var newScript = $iframeDoc.createElement("script");
    newScript.innerHTML = jsEditor.getValue();
    $iframeHead.appendChild(newScript);
    $iframe.contentWindow = {}; 
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
    htmlEditor.on("keyup", htmlCallback);
    cssEditor.on("keyup", cssCallback);
    $runJS.addEventListener("click", jsCallback);
    $toggleButton.addEventListener("click", toggleEditorVisibility);
    $clearFieldsButton.addEventListener("click", clearEditor);
  }

  return {
    init: function() {
      setupListeners();
      setDefaultValues();
      setHeightOnElements({className: "CodeMirror", height: 220});
    }
  }

})();

CodePlayer.init();
