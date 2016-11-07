(function() {
  var $editor = document.getElementsByClassName("editor")[0],
      $htmlEditor = document.getElementsByClassName("html")[0],
      $cssEditor = document.getElementsByClassName("css")[0],
      $jsEditor = document.getElementsByClassName("javascript")[0];

  var $iframe = document.getElementById("output"),
      $iframeHead = $iframe.contentDocument.head,
      $iframeBody = $iframe.contentDocument.body;

  var $style = document.createElement("style"),
      $script = $iframe.contentWindow.document.createElement("script");

  $script.type = "text/javascript";
  $iframeHead.appendChild($script);

  var $toggleButton = document.getElementsByClassName("header-toggle")[0],
      $clearFieldsButton = document.getElementsByClassName("header-clear")[0];

 
  var htmlEditor = CodeMirror.fromTextArea($htmlEditor, {
    lineNumbers: true,
    tabSize: 2,
    theme: 'neo',
    lineWrapping: true,
    mode: "text/html"
  });
  
  var cssEditor = CodeMirror.fromTextArea($cssEditor, {
    lineNumbers: true,
    tabSize: 2,
    lineWrapping: true,
    theme: 'neo',
    mode: "text/css"
  });

  var jsEditor = CodeMirror.fromTextArea($jsEditor, {
    lineNumbers: true,
    tabSize: 2,
    lineWrapping: true,
    mode: "text/javascript",
    theme: 'neo'
  });

  htmlEditor.on("keyup", function(cm, evt) {
    $iframeBody.innerHTML = htmlEditor.getValue();
  });

  cssEditor.on("keyup", function(cm, evt) {
      $style.innerHTML = cssEditor.getValue();;
      $iframeHead.appendChild($style);
  });
  

  jsEditor.on("keyup", function(cm, evt) {
     var script = $iframeHead.getElementsByTagName("script")[0];
     script.parentNode.removeChild(script);
     
     var newScript = $iframe.contentDocument.createElement("script");
     newScript.textContent = jsEditor.getValue();
     $iframeHead.appendChild(newScript);
     console.clear();
  });

  $clearFieldsButton.addEventListener("click", function() {
    if(confirm("Are you sure")) {
      htmlEditor.setValue("");
      cssEditor.setValue("");
      jsEditor.setValue("");
      $iframeHead.innerHTML = "";
      $iframeBody.innerHTML = "";
    }
    console.log('cleared');
  });

  

  $toggleButton.addEventListener("click", function() {
    if($editor.style.display === "none") {
      $editor.style.display = "flex";
    } else {
      $editor.style.display = "none";
    }
  });
 
  var setHeightOnElements = function(opts) {
    var elms = document.getElementsByClassName(opts.className);
   
    for(var i = 0, n = elms.length; i < n; i++) {
      elms[i].style.height = opts.height.toString() + "px";
    }
  }

  setHeightOnElements({className: "CodeMirror", height: 173});

})();
