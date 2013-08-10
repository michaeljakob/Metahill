String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
String.prototype.ltrim=function(){return this.replace(/^\s+/,'');};
String.prototype.rtrim=function(){return this.replace(/\s+$/,'');};

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};


var metahill = metahill || {};
metahill.helper = {};

metahill.helper.submitHttpRequest = function(phpFile, json, successCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/' + phpFile);
    xhr.onload = function () {
        if (xhr.status === 200) {
            //console.log('http request: ok. '+ xhr.responseText);
            if(successCallback !== undefined) {
                successCallback(xhr.getResponseHeader('Content-Description'));
            }
        } else {
            var error = xhr.getResponseHeader('Content-Description');
            //console.log('http request: something went terribly wrong('+error+'), ' + xhr.status  + ':' + xhr.statusText);
        }
    };

    var formData = new FormData();
    for(var key in json) {
        formData.append(key, json[key]);
    }

    xhr.send(formData);
};


    /*
    * Converts milliseconds to the HH:mm:ss format
    */
metahill.helper.toHHMMSS = function(time) {
    return new Date(time).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");    
};

/*
*    <span>important text <p>crap</p><span>
*    -> "important text"
*/
metahill.helper.getSimpleText = function(room) {
    return  room
            .clone() 
            .children()
            .remove()
            .end()
            .text().trim();    
};

metahill.helper.openUrlInNewTab = function(url) {
    window.open(url, '_blank').focus();
};

/*
*  Returns a key-value object.
*  You can then get the test parameter from {@code http://myurl.com/?test=1} by calling {@code params.test}.
*/
metahill.helper.getGetParameters = function() {
    var prmstr = window.location.search.substr(1);
    var prmarr = prmstr.split ("&");
    var params = {};

    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
};

metahill.helper.htmlEncode = function(value){
    return $(document.createElement('div')).text(value).html();
};

metahill.helper.quotesEncode = function(value) {
    return value.replace('\'', '&#39;').replace('"', '&#34;');
};

metahill.helper.quotesDecode = function(value){
    return value.replace('&#39;', '\'').replace('&#34;', '"');
};

metahill.helper.generateRandomString = function (len) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(var i=0; i < len; ++i)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};
