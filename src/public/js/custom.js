'use strict';

var forms = document.getElementsByTagName('form');
  for (var i = 0; i < forms.length; i++) {
    forms[i].addEventListener('invalid', function(e) {
      e.preventDefault();
    }, true);
  }

function checkOutline(elem, errorElem, msg){
  var element = document.getElementById(elem),
      style = window.getComputedStyle(element),
      outline = style.getPropertyValue('outline');

  if(outline == 'rgb(255, 0, 0) solid 2px' ){
    var para = document.createElement("P"),
        t = document.createTextNode(msg);
    document.getElementById(errorElem).innerHTML = "";
    para.appendChild(t);
    document.getElementById(errorElem).appendChild(para);

  }else if(outline == 'rgb(124, 193, 249) solid 2px' ){
    document.getElementById(errorElem).innerHTML = "";
  }
}
