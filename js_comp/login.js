$(function(){$("#action-chooser").submit(function(){var b=$("[name='username']"),a=$("[name='password']");return 0<$.trim(b.val()).length&&0<$.trim(a.val()).length});var a=this;this.footer=$("footer");this.window=$(window);$(window).resize(function(){var b=a.window.height();685>b?a.footer.css("bottom",b-635):a.footer.css("bottom","50px")});$(window).ready(function(){$(window).resize()})});
