/*
*   replaceSmilies(text)
*   boldItalicsCode(text)
*   styleMessage(text)
*/

var metahill = metahill || {};
metahill.formatMessages = {};

/*
    Replaces standard smilies by images
*/
metahill.formatMessages.replaceTextSmilies = function() {
    var smiliesShortcut = {};
    smiliesShortcut[':)'] = 'smile.png';
    smiliesShortcut[':-)'] = 'smile.png';
    smiliesShortcut['=)'] = 'smile.png';
    smiliesShortcut[':D'] = 'biggrin.png';
    smiliesShortcut[':-D'] = 'biggrin.png';
    smiliesShortcut['=D'] = 'biggrin.png';
    smiliesShortcut[';)'] = 'wink.png';
    smiliesShortcut[';D'] = 'wink.png';
    smiliesShortcut[';-)'] = 'wink.png';
    smiliesShortcut[';-D'] = 'wink.png';
    smiliesShortcut[':?'] = 'confused.png';
    smiliesShortcut[':-?'] = 'confused.png';
    smiliesShortcut[':('] = 'sad.png';
    smiliesShortcut[':-('] = 'sad.png';
    smiliesShortcut[':\'('] = 'crying.png';
    smiliesShortcut['>.<'] = 'pinch.png';
    smiliesShortcut['>_<'] = 'pinch.png';
    smiliesShortcut['=8-)'] = 'cool.png';
    smiliesShortcut[':S'] = 'unsure.png';
    smiliesShortcut[':s'] = 'unsure.png';
    smiliesShortcut['^^'] = 'squint.png';
    smiliesShortcut['<3'] = 'love.png';
    smiliesShortcut[':P'] = 'tongue.png';
    smiliesShortcut[':p'] = 'tongue.png';

    var smiliesWordy = {};
    smiliesWordy[':angry'] = 'angry.png';
    smiliesWordy[':biggrin'] = 'biggrin.png';
    smiliesWordy[':blink'] = 'blink.png';
    smiliesWordy[':confused'] = 'confused.png';
    smiliesWordy[':cool'] = 'cool.png';
    smiliesWordy[':crying'] = 'crying.png';
    smiliesWordy[':cursing'] = 'cursing.png';
    smiliesWordy[':evil'] = 'evil.png';
    smiliesWordy[':huh'] = 'huh.png';
    smiliesWordy[':love'] = 'love.png';
    smiliesWordy[':mellow'] = 'mellow.png';
    smiliesWordy[':pinch'] = 'pinch.png';
    smiliesWordy[':rolleyes'] = 'rolleyes.png';
    smiliesWordy[':sad'] = 'sad.png';
    smiliesWordy[':sleeping'] = 'sleeping.png';
    smiliesWordy[':smile'] = 'smile.png';
    smiliesWordy[':squint'] = 'squint.png';
    smiliesWordy[':thumbdown'] = 'thumbdown.png';
    smiliesWordy[':thumbsup'] = 'thumbsup.png';
    smiliesWordy[':thumbup'] = 'thumbup.png';
    smiliesWordy[':tongue'] = 'tongue.png';
    smiliesWordy[':unsure'] = 'unsure.png';
    smiliesWordy[':w00t'] = 'w00t.png';
    smiliesWordy[':wacko'] = 'wacko.png';
    smiliesWordy[':whistling'] = 'whistling.png';
    smiliesWordy[':wink'] = 'wink.png';


    
    function escapeRegExp(str) {
        return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    }

    return function(text) {
        if(!metahill.modals.preferences.enable_smilies) {
            return text;
        }
        Object.keys(smiliesWordy).forEach(function(entry) {
            var image = '<img src="img/smilies/' + smiliesWordy[entry] + '"></img>';
            
            if(text.indexOf(entry) !== -1) {
                var regex = new RegExp('('+ escapeRegExp(entry) +')(?=(?:(?:[^`]*`){2})*[^`]*$)', 'g');
                text = text.replace(regex, image);
            }
        });
        Object.keys(smiliesShortcut).forEach(function(entry) {
            var image = '<img src="img/smilies/' + smiliesShortcut[entry] + '"></img>';
            
            if(text.indexOf(entry) !== -1) {
                var regex = new RegExp('('+ escapeRegExp(entry) +')(?=(?:(?:[^`]*`){2})*[^`]*$)', 'g');
                text = text.replace(regex, image);
            }
        });
        return text;
    };
}();

/*
    Apply basic format.
    `: code         <code>
    *: italics      <b>
    _: italics      <i>
*/
metahill.formatMessages.boldItalicsCode = function(text) {
    if(!metahill.modals.preferences.enable_formatting) {
        return text;
    }
    
    // **: <b>
    // text = text.replace(/(\*\*[^`]+\*\*|`[^`]+`)/g, function(_, grp) {
    //                 return grp[0] === '*' ? grp.replace(/^\*\*(.*)\*\*$/, "<b>$1</b>") : grp;
    //             });
                    
    // *: <b> 
    text = text.replace(/(\*[^`]+\*|`[^`]+`)/g, function(_, grp) {
                    return grp[0] === '*' ? grp.replace(/^\*(.*)\*$/, '<b>$1</b>') : grp;
                });
                
    // _: <i>
    text = text.replace(/(_[^`]+_|`[^`]+`)/g, function(_, grp) {
                    return grp[0] === '_' ? grp.replace(/^_(.*)_$/, '<i>$1</i>') : grp;
                });
    
            
    // `: code  
    text = text.replace(/`(.+?)`/g, '<pre class="prettyprint">$1</pre>');
    
    return text;
};

/*
*   Callback to style all messages
*
* @param config options on applying syltes
            <code>
            {
                'basic-format': true,
                'smilies': true
            }
            </code>
*/
metahill.formatMessages.styleMessage = function(text, config) {
    text = metahill.formatMessages.makeLinksClickable(text);
    text = metahill.formatMessages.replaceTextSmilies(text);
    text = metahill.formatMessages.boldItalicsCode(text);
    return text;
};

/**
 * Convert all links to clickable links. Technically, they are just wrapped in <a> tags.
 * @param  {string} text 
 * @return {string} text The parsed text     
 */
metahill.formatMessages.makeLinksClickable = function(text) {
    var regex = /((http:\/\/|https:\/\/|www\.)[-A-Z0-9+&@#\/%?=~_|!:,.;\(\)]*[-A-Z0-9+&@#\/%=~_|\(\)])/gi;

    function replaceCallback(match) {
        match = match.replace(/_/g, "%5f");

        var optionalAttributes = '';
        // is it an image?
        if(match.match(/\.(png|jpg|jpeg|gif|svg)$/i)) {
            optionalAttributes = metahill.main.getMagnifyOnHoverCode(match);
        } else if(match.toLowerCase().indexOf('www.youtube.com') !== -1) {
            var lastEqualsSign = match.lastIndexOf('=');
            if(lastEqualsSign !== -1) {
                var youtubeId = match.substring(lastEqualsSign + 1);
                var url = 'http://img.youtube.com/vi/'+youtubeId+'/0.jpg';
                optionalAttributes = metahill.main.getMagnifyOnHoverCode(url);
            }
        }

        if(match.indexOf('http') === 0) {
            return '<a target="_blank" '+optionalAttributes+' href="'+match+'">'+match+'</a>';
        } else {
            return '<a target="_blank" '+optionalAttributes+' href="http://'+match+'">'+match+'</a>';
        }
    }

    return function(text) {
        if(text === null || text === undefined){
            return '';
        }

        // a valid url contains at least 1 dot
        if(text.split('.').length <= 1) {
            return text;
        }

        return text.replace(regex, replaceCallback);
    };
}();

