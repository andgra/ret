import fs from "~js/modules/fs"
import {ngui, nwin} from "~js/modules/nw"


let openPdf = function (name) {
  ngui.Window.open('public/index.html?route=' + name, { width: 1,height: 1, show: false});
};

let printContent = (name, landscape = false) => {
  let dir = ngui.__dirname+'/print';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  let pdf_path = `${dir}/${name}.pdf`;
  nwin.print({
    headerFooterEnabled: false,
    landscape: landscape,
    pdf_path
  });
  ngui.Window.open(pdf_path,{ width: 8000,height: 6000}, function(win) {
    fs.rmRf(dir);
  });
  nwin.close();
};

export {openPdf, printContent};