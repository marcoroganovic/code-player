var Helpers = (function() {
  
  'use strict';

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
   
  
  
  var setHeightOnElements = function(opts) {
    var elmsArrLike = document.getElementsByClassName(opts.className),
        elArr  = Array.prototype.slice.call(elmsArrLike);

    elArr.forEach(function(el) {
      el.style.height = opts.height + "px";
    });
  }  
 
  return {
    debounce: debounce,
    removeInlineStyles: removeInlineStyles,
    insertNodeAfter: insertNodeAfter,
    setHeightOnElements: setHeightOnElements
  }

})();
