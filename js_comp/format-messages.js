function __format_messages__(f){this.replaceTextSmilies=function(){function b(a){return a.replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1")}var d={":)":"smile.png",":-)":"smile.png","=)":"smile.png",":D":"biggrin.png",":-D":"biggrin.png","=D":"biggrin.png",";)":"wink.png",";D":"wink.png",";-)":"wink.png",";-D":"wink.png",":?":"confused.png",":-?":"confused.png",":(":"sad.png",":-(":"sad.png",":'(":"crying.png",">.<":"pinch.png",">_<":"pinch.png","=8-)":"cool.png",":S":"unsure.png",":s":"unsure.png","^^":"squint.png",
"<3":"love.png"},c={":angry":"angry.png",":biggrin":"biggrin.png",":blink":"blink.png",":confused":"confused.png",":cool":"cool.png",":crying":"crying.png",":cursing":"cursing.png",":evil":"evil.png",":huh":"huh.png",":love":"love.png",":mellow":"mellow.png",":pinch":"pinch.png",":rolleyes":"rolleyes.png",":sad":"sad.png",":sleeping":"sleeping.png",":smile":"smile.png",":squint":"squint.png",":thumbdown":"thumbdown.png",":thumbsup":"thumbsup.png",":thumbup":"thumbup.png",":tongue":"tongue.png",":unsure":"unsure.png",
":w00t":"w00t.png",":wacko":"wacko.png",":whistling":"whistling.png",":wink":"wink.png"};return function(a){if(!f.preferences.enable_smilies)return a;Object.keys(c).forEach(function(e){var d='<img src="img/smilies/'+c[e]+'"></img>';-1!==a.indexOf(e)&&(e=RegExp("("+b(e)+")(?=(?:(?:[^`]*`){2})*[^`]*$)","g"),a=a.replace(e,d))});Object.keys(d).forEach(function(c){var f='<img src="img/smilies/'+d[c]+'"></img>';-1!==a.indexOf(c)&&(c=RegExp("("+b(c)+")(?=(?:(?:[^`]*`){2})*[^`]*$)","g"),a=a.replace(c,f))});
return a}}();this.boldItalicsCode=function(b){if(!f.preferences.enable_formatting)return b;b=b.replace(/(\*[^`]+\*|`[^`]+`)/g,function(b,c){return"*"===c[0]?c.replace(/^\*(.*)\*$/,"<strong>$1</strong>"):c});b=b.replace(/(_[^`]+_|`[^`]+`)/g,function(b,c){return"_"===c[0]?c.replace(/^_(.*)_$/,"<em>$1</em>"):c});return b=b.replace(/`(.+?)`/g,"<code>$1</code>")};this.styleMessage=function(b,d){b=this.makeLinksClickable(b);b=this.replaceTextSmilies(b);return b=this.boldItalicsCode(b)};this.makeLinksClickable=
function(b){function d(a){a=a.replace(/_/g,"%5f");return 0===a.indexOf("http")?'<a target="_blank" href="'+a+'">'+a+"</a>":'<a target="_blank" href="http://'+a+'">'+a+"</a>"}var c=/(http:\/\/|https:\/\/|www.)([a-zA-Z0-9.-]{3,}\.[a-zA-Z0-9]{2,5}[^\s]*)/g;return function(a){return null===a||void 0===a?"":a.replace(c,d)}}()};