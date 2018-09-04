import fs from "~js/modules/fs"
import {ngui} from "~js/modules/nw"

let dir = ngui.__dirname + '/public/temp';

function getRandomString() {
  return Math.random().toString(32).slice(2);
}

function printHtml(name, content, landscape = false) {
  return new Promise((resolve, reject) => {
    // если temp папка не существует, то создаем её
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    let html_path = `${dir}/${getRandomString()}.html`;

    // создаем html-файл
    fs.writeFile(html_path, content, function (err) {
      if (err) {
        return reject(console.log(err));
      }

      // после создания открываем его без показа пользователю
      ngui.Window.open(html_path, {width: 8000, height: 8000, show: false}, winHtml => {
        winHtml.on('loaded', () => {
          let pdf_path = `${dir}/${name}.pdf`;

          // после открытия страницы с контентом, компилируем её в pdf
          winHtml.print({
            headerFooterEnabled: false,
            landscape,
            pdf_path,
          });

          // открываем только что созданный pdf
          ngui.Window.open(pdf_path, {width: 8000, height: 6000}, function (winPdf) {
            winPdf.maximize();
            // чистим временную папку и закрываем окно с html контентом
            fs.rmRf(dir);
            IS_DEVELOPMENT ? winHtml.show() : winHtml.close();
            resolve();
          });

        });
      });
    });
  });
}

function applyLayout(name, content) {
  return `
      <!doctype html>
      <html lang="ru">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>${name}</title>
          <link rel="stylesheet" href="../bundle/print.css" type="text/css">
      </head>
      <body>
          ${content}
          <script src="../bundle/print.js"></script>
      </body>
      </html>
  `;
};

export default {
  printElement(name, el, landscape = false) {
    return new Promise((resolve, reject) => {
      el = el.cloneNode(true);

      el.style.display = '';

      // получаем полный шаблон страницы
      let html = applyLayout(name, el.outerHTML);
      // компилируем html в pdf и открываем в новом окне
      printHtml(name, html, landscape).then(() => resolve()).catch(err => reject(err));
    });
  },
  printDataReady() {
    setTimeout(() => this.$emit('printReady', {name: this.pdf_name, el: this.$el}), 0);
  },
}