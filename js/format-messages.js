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
    smiliesShortcut[':)'] = { img: 'smile.png' };
    smiliesShortcut[':-)'] = { img: 'smile.png' };
    smiliesShortcut['=)'] = { img: 'smile.png' };
    smiliesShortcut[':D'] = { img: 'biggrin.png' };
    smiliesShortcut[':-D'] = { img: 'biggrin.png' };
    smiliesShortcut[';)'] = { img: 'wink.png' };
    smiliesShortcut[';D'] = { img: 'wink.png' };
    smiliesShortcut[';-)'] = { img: 'wink.png' };
    smiliesShortcut[';-D'] = { img: 'wink.png' };
    smiliesShortcut[':?'] = { img: 'confused.png' };
    smiliesShortcut[':-?'] = { img: 'confused.png' };
    smiliesShortcut[':('] = { img: 'sad.png' };
    smiliesShortcut[':-('] = { img: 'sad.png' };
    smiliesShortcut[':\'('] = { img: 'crying.png' };
    smiliesShortcut['>.<'] = { img: 'pinch.png' };
    smiliesShortcut['>_<'] = { img: 'pinch.png' };
    smiliesShortcut[':S'] = { img: 'unsure.png' };
    smiliesShortcut[':s'] = { img: 'unsure.png' };
    smiliesShortcut['^^'] = { img: 'squint.png' };
    smiliesShortcut['<3'] = { img: 'love.png' };
    smiliesShortcut[':P'] = { img: 'tongue.png' };
    smiliesShortcut[':p'] = { img: 'tongue.png' };

    var smiliesWordy = {};
    smiliesWordy[':angry'] = { img: 'angry.png' };
    smiliesWordy[':biggrin'] = { img: 'biggrin.png' };
    smiliesWordy[':blink'] = { img: 'blink.png' };
    smiliesWordy[':confused'] = { img: 'confused.png' };
    smiliesWordy[':cool'] = { img: 'cool.png' };
    smiliesWordy[':crying'] = { img: 'crying.png' };
    smiliesWordy[':cursing'] = { img: 'cursing.png' };
    smiliesWordy[':evil'] = { img: 'evil.png' };
    smiliesWordy[':huh'] = { img: 'huh.png' };
    smiliesWordy[':love'] = { img: 'love.png' };
    smiliesWordy[':mellow'] = { img: 'mellow.png' };
    smiliesWordy[':pinch'] = { img: 'pinch.png' };
    smiliesWordy[':rolleyes'] = { img: 'rolleyes.png' };
    smiliesWordy[':sad'] = { img: 'sad.png' };
    smiliesWordy[':sleeping'] = { img: 'sleeping.png' };
    smiliesWordy[':smile'] = { img: 'smile.png' };
    smiliesWordy[':squint'] = { img: 'squint.png' };
    smiliesWordy[':thumbdown'] = { img: 'thumbdown.png' };
    smiliesWordy[':thumbsup'] = { img: 'thumbsup.png' };
    smiliesWordy[':thumbup'] = { img: 'thumbup.png' };
    smiliesWordy[':tongue'] = { img: 'tongue.png' };
    smiliesWordy[':unsure'] = { img: 'unsure.png' };
    smiliesWordy[':w00t'] = { img: 'w00t.png' };
    smiliesWordy[':wacko'] = { img: 'wacko.png' };
    smiliesWordy[':whistling'] = { img: 'whistling.png' };
    smiliesWordy[':wink'] = { img: 'wink.png' };


    addRegex(smiliesShortcut);
    addRegex(smiliesWordy);
    
    function addRegex(smilies) {
        Object.keys(smilies).forEach(function(smily) {
            smilies[smily].regex = new RegExp('(' + escapeRegExp(smily) + ')(?=(?:(?:[^`]*`){2})*[^`]*$)', 'g');
        });
    }
    
    function escapeRegExp(str) {
        return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    }

    function replace(text, smilies) {
        Object.keys(smilies).forEach(function(entry) {
            var image = '<img src="img/smilies/' + smilies[entry].img + '"/>';

            if (text.indexOf(entry) !== -1) {
                text = text.replace(smilies[entry].regex, image);
            }
        });
        return text;
    }

    return function(text) {
        text = replace(text, smiliesWordy);
        text = replace(text, smiliesShortcut);
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

    // *****... and _____.... should not be replaced
    text = text.replace(/\*\*/g, '&#42;&#42;');
    text = text.replace(/__/g, '&#95;&#95;');
    text = text.replace(/``/g, '&#96;&#96;');

    // *: <b> 
    text = text.replace(/(\*[^`]+?\*|`[^`]+?`)/g, function(_, grp) {
                    return grp[0] === '*' ? grp.replace(/^\*(.*)\*$/, '<b>$1</b>') : grp;
                });
                
    // _: <i>
    text = text.replace(/(_[^`]+?_|`[^`]+?`)/g, function(_, grp) {
                    return grp[0] === '_' ? grp.replace(/^_(.*)_$/, '<i>$1</i>') : grp;
                });
    
    // `: <code>  
    text = text.replace(/`(.+?)`/g, '<pre class="prettyprint">$1</pre>');
    
    return text;
};

metahill.formatMessages.styleMessage = function(text) {
    text = metahill.formatMessages.replaceTextSmilies(text);
    text = metahill.formatMessages.makeLinksClickable(text);
    text = metahill.formatMessages.boldItalicsCode(text);
    return text;
};

/**
 * Convert all links to clickable links. Technically, they are just wrapped in <a> tags.
 * @param  {string} text 
 * @return {string} text The parsed text     
 */
metahill.formatMessages.makeLinksClickable = function(text) {
    var linkRegex = /((http:\/\/|https:\/\/|www\.)[-A-Z0-9+&@#\/%?=~_|!:,.;\(\)\*]*[-A-Z0-9+&@#\/%=~_|\(\)])/gi;

    function replaceCallback(match) {
        match = match.replace(/_/g, '%5f').replace(/\*/g, '%2a');
        var optionalAttributes = '';
        // is it an image?
        if(match.match(/\.(png|jpg|jpeg|gif|svg)$/i)) {
            optionalAttributes = 'data-magnifyurl="' + match + '"';
        } else if(match.toLowerCase().indexOf('www.youtube.com') !== -1) {
            var lastEqualsSign = match.lastIndexOf('=');
            if(lastEqualsSign !== -1) {
                var youtubeId = match.substring(lastEqualsSign + 1);
                var url = 'http://img.youtube.com/vi/'+youtubeId+'/0.jpg';
                optionalAttributes = 'data-magnifyurl="' + url + '"';
            }
        }

        var displayedMatch = match.replace(/%5f/g, '&#95;').replace(/%2a/g, '&#42;');

        if(match.indexOf('http') === 0) {
            return '<a target="_blank" '+optionalAttributes+' href="'+match+'">'+displayedMatch+'</a>';
        } else {
            return '<a target="_blank" '+optionalAttributes+' href="http://'+match+'">'+displayedMatch+'</a>';
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

        return text.replace(linkRegex, replaceCallback);
    };
}();

