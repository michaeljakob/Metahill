/*
*   replaceSmilies(text)
*   boldItalicsCode(text)
*   styleMessage(text)
*/
$(function() {
    metahill.formatMessages = this;
    
    /*
        Replaces standard smilies by images
    */
    this.replaceTextSmilies = function() {
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
        *: italics      <strong>
        _: italics      <em>
    */
    this.boldItalicsCode = function(text) {
        if(!metahill.modals.preferences.enable_formatting) {
            return text;
        }
        
        // **: <strong>
        // text = text.replace(/(\*\*[^`]+\*\*|`[^`]+`)/g, function(_, grp) {
        //                 return grp[0] === '*' ? grp.replace(/^\*\*(.*)\*\*$/, "<strong>$1</strong>") : grp;
        //             });
                        
        // *: <em> 
        text = text.replace(/(\*[^`]+\*|`[^`]+`)/g, function(_, grp) {
                        return grp[0] === '*' ? grp.replace(/^\*(.*)\*$/, "<strong>$1</strong>") : grp;
                    });
                    
        // _: <em>
        text = text.replace(/(_[^`]+_|`[^`]+`)/g, function(_, grp) {
                        return grp[0] === '_' ? grp.replace(/^_(.*)_$/, "<em>$1</em>") : grp;
                    });
        
                
        // `: code  
        text = text.replace(/`(.+?)`/g, "<code>$1</code>");
        
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
    this.styleMessage = function(text, config) {
        text = this.makeLinksClickable(text);
        text = this.replaceTextSmilies(text);
        text = this.boldItalicsCode(text);
        return text;
    };

    /**
     * Convert all links to clickable links. Technically, they are just wrapped in <a> tags.
     * @param  {[type]} text [description]
     * @return {[type]}      [description]
     */
    this.makeLinksClickable = function(text) {
        var regex = /((http:\/\/|www)[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

        function replaceCallback(match) {
            match = match.replace(/_/g, "%5f");
            if(match.indexOf('http') === 0) {
                return '<a target="_blank" href="'+match+'">'+match+'</a>';
            } else {
                return '<a target="_blank" href="http://'+match+'">'+match+'</a>';
            }
        }

        return function(text) {
            if(text === null || text === undefined){
                return '';
            }
            return text.replace(regex, replaceCallback);
        };
    }();

});


