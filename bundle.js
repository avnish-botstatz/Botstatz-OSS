!function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,n){"use strict";function o(e){var t=g.previousElementSibling;c=e.pageX-(0,r.getDOMNodePosition)(g).left,v=e.pageY-(0,r.getDOMNodePosition)(g).top,g.classList.add("draggable"),t.classList.add("not-animated"),t.style.height=2*l+g.offsetHeight+"px",window.getComputedStyle(t).getPropertyValue("transition"),t.classList.remove("not-animated"),b=g.nextElementSibling,(0,r.removeDOMNode)(b)}function i(){var e=g.previousElementSibling,t=(0,r.getDOMNodePosition)(e);g.classList.add("animated-draggable-item"),g.style.top=t.top+l+"px",g.style.left=t.left+"px",h=!1,setTimeout(function(){g.classList.remove("draggable"),g.classList.remove("animated-draggable-item"),e.classList.add("not-animated"),e.style.height=l+"px",window.getComputedStyle(e).getPropertyValue("transition"),e.classList.remove("not-animated"),(0,r.insertAfter)(b,g),h=!0,g=null},a)}function s(e){m||(o(e),m=!0),g.style.top=e.pageY-v+"px",g.style.left=e.pageX-c+"px";var t=(0,r.getDOMNodePosition)(g),n=g.previousElementSibling.previousElementSibling,i=g.nextElementSibling;if(n){var s=(0,r.getDOMNodePosition)(n);if(t.top+g.offsetHeight/2<s.top+n.offsetHeight/2){var a=g.previousElementSibling,u=n.previousElementSibling;return a.style.height=l+"px",(0,r.swapTwoDOMNodes)(g,a),(0,r.swapTwoDOMNodes)(g,n),void(u.style.height=g.offsetHeight+2*l+"px")}}if(i){var d=(0,r.getDOMNodePosition)(i);if(t.top+g.offsetHeight/2>d.top+i.offsetHeight/2){var f=g.previousElementSibling,p=i.nextElementSibling;f.style.height=l+"px",(0,r.swapTwoDOMNodes)(g,i),(0,r.swapTwoDOMNodes)(g,p),p.style.height=g.offsetHeight+2*l+"px"}}}var r=n(1),l=10,a=200,u=document.getElementById("list"),d=Array.from(u.getElementsByClassName("item")),f=!1,p=!1,g=null,m=!1,c=null,v=null,h=!0,b=null;d.forEach(function(e){e.addEventListener("mousedown",function(){h&&(g=e,f=!0)}),e.ondragstart=function(){return!1}}),document.addEventListener("mouseup",function(){g&&p&&i(),f=!1,p=!1,m=!1,c=null,v=null}),document.addEventListener("mousemove",function(e){(p=f)&&s(e)})},function(e,t,n){"use strict";function o(e){e.parentNode.removeChild(e)}function i(e,t){var n=t.parentNode,o=t.nextElementSibling;o?n.insertBefore(e,o):n.appendChild(e)}function s(e){var t=e.getBoundingClientRect();return{top:t.top,left:t.left}}function r(e,t){e.nextElementSibling===t?e.parentNode.insertBefore(t,e):t.nextElementSibling===e&&e.parentNode.insertBefore(e,t)}Object.defineProperty(t,"__esModule",{value:!0}),t.removeDOMNode=o,t.insertAfter=i,t.getDOMNodePosition=s,t.swapTwoDOMNodes=r}]);