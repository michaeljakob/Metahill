<script>
var regex1 = new RegExp('.*[\\s:;.,|<>]?'+'spobat'+'[\\s:;.,!|<>].*', 'g');
var regex2 = new RegExp('.*[\\s:;.,|<>]'+'spobat'+'[\\s:;.,!|<>]?.*', 'g');

var m = "spobat_hallo wie gehtsspobat";
document.write(regex1.test(m) || regex2.test(m));


</script>