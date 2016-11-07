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

  var $style = document.createElement("style"),
      $script = $iframeDoc.createElement("script");

  $iframeHead.appendChild($style);
  $script.type = "text/javascript";
  $iframeHead.appendChild($script);

  var $toggleButton = document.getElementsByClassName("header-toggle")[0],
      $clearFieldsButton = document.getElementsByClassName("header-clear")[0];

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
    style.parentNode.removeChild(style);
    
    var newStyle = $iframeDoc.createElement("style");
    newStyle.innerHTML = cssEditor.getValue();
    $iframeHead.appendChild(newStyle);
  }

  var jsCallback = function(cm, evt) {
    var script = $iframeHead.getElementsByTagName("script")[0];
    script.parentNode.removeChild(script);

    var newScript = $iframeDoc.createElement("script");
    newScript.innerHTML = jsEditor.getValue();
    $iframeHead.appendChild(newScript);
  }
  
  // Header button callbacks
  var clearEditor = function() {
    if(confirm("Are you sure?")) {
      htmlEditor.setValue("");
      cssEditor.setValue("");
      jsEditor.setValue("");
      $iframeHead.innerHTML = "";
      $iframeBody.innerHTML = "";
    }
  }

  var toggleEditorVisibility = function() {
    $editor.style.display = ($editor.style.display === "none") ? "flex" : "none";
  }

  var setupListeners = function() {
    htmlEditor.on("keyup", htmlCallback);
    cssEditor.on("keyup", cssCallback);
    jsEditor.on("keyup", jsCallback);
    $toggleButton.addEventListener("click", toggleEditorVisibility);
    $clearFieldsButton.addEventListener("click", clearEditor);
  }

  return {
    init: function() {
      setupListeners();
      setHeightOnElements({className: "CodeMirror", height: 173});
    }
  }

})();

CodePlayer.init();
