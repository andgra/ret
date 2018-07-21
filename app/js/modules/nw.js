window.ngui = require('nw.gui');
window.nwin = ngui.Window.get();
console.log(nwin.appWindow.hidden);
nwin.showDevTools();
console.log(ngui, nwin);