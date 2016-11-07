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
  
  var $toggleButton = document.getElementsByClassName("header-toggle")[0],
      $clearFieldsButton = document.getElementsByClassName("header-clear")[0];

  $toggleButton.addEventListener("click", function() {
    if($editor.style.display === "none") {
      $editor.style.display = "flex";
    } else {
      $editor.style.display = "none";
    }
  });
  
  $clearFieldsButton.addEventListener("click", function() {
    if(confirm("Are you sure")) {
      $iframeHead.innerHTML = "";
      $iframeBody.innerHTML = "";
    }
    console.log('cleared');
  });

  var htmlEditor = CodeMirror.fromTextArea($htmlEditor, {
    lineNumbers: true,
    tabSize: 2,
    theme: 'elegant',
    lineWrapping: true
  });

  var cssEditor = CodeMirror.fromTextArea($cssEditor, {
    lineNumbers: true,
    tabSize: 2,
    lineWrapping: true,
    theme: 'elegant'
  });

  var jsEditor = CodeMirror.fromTextArea($jsEditor, {
    lineNumbers: true,
    tabSize: 2,
    lineWrapping: true,
    mode: "javascript",
    themes: 'elegant'
  });

  htmlEditor.on("change", function(cm, evt) {
    console.log(cm, evt); 
    $iframeBody.innerHTML = htmlEditor.getValue();
  });

  cssEditor.on("change", function(cm, evt) {
      $style.innerHTML = cssEditor.getValue();;
      $iframeHead.appendChild($style);
  });
  

  jsEditor.on("change", function(cm, evt) {
     $script.textContent  = jsEditor.getValue();
     $iframeHead.appendChild($script);
  });
  

})();
