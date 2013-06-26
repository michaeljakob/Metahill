/*
*   replaceSmilies(text)
*   boldItalicsCode(text)
*   styleMessage(text)
*
*
*/
function __format_messages__(modals) {

    /*
        Replaces standard smilies by images
    */
    this.replaceTextSmilies = function(text) {
        if(!modals.preferences.enable_smilies) {
            return text;
        }

        var smilies = {};
        smilies[':)'] = 'smile.png';
        smilies[':-)'] = 'smile.png';
        smilies['=)'] = 'smile.png';
        smilies[':D'] = 'biggrin.png';
        smilies[':-D'] = 'biggrin.png';
        smilies['=D'] = 'biggrin.png';
        smilies[';)'] = 'wink.png';
        smilies[';D'] = 'wink.png';
        smilies[';-)'] = 'wink.png';
        smilies[';-D'] = 'wink.png';
        smilies[':?'] = 'confused.png';
        smilies[':-?'] = 'confused.png';
        smilies[':('] = 'sad.png';
        smilies[':-('] = 'sad.png';
        smilies[':\'('] = 'crying.png';
        smilies['>.<'] = 'pinch.png';
        smilies['>_<'] = 'pinch.png';
        smilies['=8-)'] = 'cool.png';
        smilies[':S'] = 'unsure.png';
        smilies[':s'] = 'unsure.png';
        smilies['^^'] = 'squint.png';
        smilies['<3'] = 'love.png';

        // wordly
        smilies[':angry'] = 'angry.png';
        smilies[':biggrin'] = 'biggrin.png';
        smilies[':blink'] = 'blink.png';
        smilies[':confused'] = 'confused.png';
        smilies[':cool'] = 'cool.png';
        smilies[':crying'] = 'crying.png';
        smilies[':cursing'] = 'cursing.png';
        smilies[':evil'] = 'evil.png';
        smilies[':huh'] = 'huh.png';
        smilies[':love'] = 'love.png';
        smilies[':mellow'] = 'mellow.png';
        smilies[':pinch'] = 'pinch.png';
        smilies[':rolleyes'] = 'rolleyes.png';
        smilies[':sad'] = 'sad.png';
        smilies[':sleeping'] = 'sleeping.png';
        smilies[':smile'] = 'smile.png';
        smilies[':squint'] = 'squint.png';
        smilies[':thumbdown'] = 'thumbdown.png';
        smilies[':thumbsup'] = 'thumbsup.png';
        smilies[':thumbup'] = 'thumbup.png';
        smilies[':tongue'] = 'tongue.png';
        smilies[':unsure'] = 'unsure.png';
        smilies[':w00t'] = 'w00t.png';
        smilies[':wacko'] = 'wacko.png';
        smilies[':whistling'] = 'whistling.png';
        smilies[':wink'] = 'wink.png';
        
        function escapeRegExp(str) {
            return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        }

        return function() {
            Object.keys(smilies).forEach(function(entry) {
                var image = '<img src="img/smilies/' + smilies[entry] + '"></img>';
                
                if(text.indexOf(entry) !== -1) {
                    var regex = new RegExp('('+ escapeRegExp(entry) +')(?=(?:(?:[^`]*`){2})*[^`]*$)', 'g');
                    text = text.replace(regex, image);
                }
                
            });
            return text;
        }();
    };

    /*
        Apply basic format.
        `: code         <code>
        *: italics      <em>
        _: italics      <em>
        **: bold        <strong>
        
    */
    this.boldItalicsCode = function(text) {
        if(!modals.preferences.enable_formatting) {
            return text;
        }

        if(text.indexOf('![]') === 0) {
            return text;
        }
        
        // **: bold
        text = text.replace(/(\*\*[^`]+\*\*|`[^`]+`)/g, function(_, grp) {
                        return grp[0] === '*' ? grp.replace(/^\*\*(.*)\*\*$/, "<strong>$1</strong>") : grp;
                    });
                        
        // *: italics 
        // text = text.replace(/(\*[^`]+\*|`[^`]+`)/g, function(_, grp) {
        //                 return grp[0] === '*' ? grp.replace(/^\*(.*)\*$/, "<em>$1</em>") : grp;
        //             });
                    
        // _: italics
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
        var regex = /(http:\/\/|https:\/\/|www.)([a-zA-Z0-9.-]{3,}\.[a-zA-Z0-9]{2,5}[^\s]*)/g;

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

}