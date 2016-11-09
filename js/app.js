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
      
      $script.type = "text/javascript";

  // 3rd party
  var $jq = $iframeDoc.createElement("script"),
      $jqUI = $iframeDoc.createElement("script");
      
      $jq.src = "http://code.jquery.com/jquery-3.1.1.min.js";
      $jqUI.src = "http://code.jquery.com/ui/1.12.1/jquery-ui.min.js";
      
    $iframeHead.appendChild($jq);
    setTimeout(function() {
      insertNodeAfter({
        newNode: $jqUI,
        after: $jq
      });
    }, 1000);

  var initialDOMAppend = function() {
    $iframeHead.appendChild($style);
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
  
  
  
  var removeInlineStyles = function(all) {
    var i = all.length,
        j,
        isHidden;

    var attrs = [
      "align", "background", "bgcolor", "border", "cellpadding",
      "cellspacing", "color", "face", "height", "hspace",
      "marginheight", "marginwidth", "noshade", "nowrap", "valign",
      "vspace", "width", "vlink", "alink", "text",
      "link", "frame", "frameborder", "clear", "scrolling", "style"
    ];

    
    var attrLen = attrs.length;

    while(i--) {
      isHidden = (all[i].style.display === "none");
      
      j = attrLen;

      while(j--) {
        all[i].removeAttribute(attrs[j]);
      }

      if(isHidden) {
        all[i].style.display = "none";
        isHidden = false;
      }
    }
  }
  

  var insertNodeAfter = function(obj) {
    obj.after.parentNode.insertBefore(obj.newNode, obj.after.nextSibling);
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
  var htmlCallback = debounce(function(cm, evt) {
    $iframeBody.innerHTML = htmlEditor.getValue();
    $runJS.innerHTML = "Re-run JS";
  }, 100);

  
  
  var insertNewDOMNode = function(obj) {
    var elements = $iframeHead.getElementsByTagName(obj.tag),
        element = elements[elements.length - 1];

    if(element) {
      element.parentNode.removeChild(element);
    }

    var newElement = $iframeDoc.createElement(obj.tag);
    newElement.innerHTML = obj.editor;
    $iframeHead.appendChild(newElement);
  }
 
  
  
  var cssCallback = debounce(function(cm, evt) {
    insertNewDOMNode({
      tag: "style",
      editor: cssEditor.getValue()
    });
  }, 100);

  
  
  var jsCallback = function(evt) {
    insertNewDOMNode({
      tag: "script",
      editor: jsEditor.getValue()
    });
    $runJS.innerHTML = "Run JS";
  }
  
  
  
  // Header button callbacks
  var clearEditor = function() {
    if(confirm("Are you sure?")) {
      setDefaultValues();;
      $iframeHead.innerHTML = "";
      $iframeBody.innerHTML = "";
      var all = $iframeDoc.getElementsByTagName("*");
      removeInlineStyles(all);
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
