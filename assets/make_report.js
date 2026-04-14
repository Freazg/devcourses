const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, BorderStyle, WidthType, PageNumber, PageBreak, ImageRun
} = require('C:/Users/Євгеній/AppData/Roaming/npm/node_modules/docx');
const fs   = require('fs');
const path = require('path');

// ── Константи форматування (ДСТУ 3008) ────────────────────────────────────────
const OUT       = path.join(__dirname, '..', 'ЛР1_Звіт_DevCourses.docx');
const IMG_UC    = fs.readFileSync(path.join(__dirname, 'usecase_diagram.png'));
const IMG_ER    = fs.readFileSync(path.join(__dirname, 'er_diagram.png'));

// Хелпер для вставки зображення (width/height у пікселях → docx points ~= px*0.75)
const img = (data, w, h) => new Paragraph({
  children: [new ImageRun({ data, transformation: { width: w, height: h }, type: 'png' })],
  alignment: CENT,
  spacing: { line: 360, after: 0 },
});
const FONT = 'Times New Roman';
const SZ   = 28;                                    // 14 pt у half-points
const LS   = { line: 360, lineRule: 'auto' };       // 1.5 міжрядковий інтервал
const IND  = { firstLine: 720 };                    // відступ 1.27 см
const JUST = AlignmentType.JUSTIFIED;
const LEFT = AlignmentType.LEFT;
const CENT = AlignmentType.CENTER;
const RGHT = AlignmentType.RIGHT;

// ── Хелпери тексту ────────────────────────────────────────────────────────────
const r  = (t, o = {}) => new TextRun({ text: String(t), font: FONT, size: SZ, ...o });
const rb = (t)          => r(t, { bold: true });
const rc = (t)          => new TextRun({ text: String(t), font: 'Courier New', size: 22 });

// ── Хелпери абзаців ───────────────────────────────────────────────────────────
// Основний текст з відступом
const p = (ch, o = {}) => new Paragraph({
  children: Array.isArray(ch) ? ch : [r(ch)],
  spacing: { ...LS, after: 0 },
  indent: IND,
  alignment: JUST,
  ...o,
});
// Абзац без відступу (заголовки рівнів, списки, таблиці)
const pn = (ch, o = {}) => new Paragraph({
  children: Array.isArray(ch) ? ch : [r(ch)],
  spacing: { ...LS, after: 0 },
  ...o,
});
// Порожній рядок (еквівалент Enter)
const nl = () => new Paragraph({ children: [r('')], spacing: { line: 360, after: 0 } });
// Заголовок 1-го рівня
const h1 = (text) => new Paragraph({
  children: [rb(text)],
  spacing: { line: 360, before: 280, after: 140 },
  alignment: LEFT,
});
// Заголовок 2-го рівня
const h2 = (text) => new Paragraph({
  children: [rb(text)],
  spacing: { line: 360, before: 200, after: 100 },
  alignment: LEFT,
});
// Рядок коду
const code = (text) => new Paragraph({
  children: [rc(text)],
  spacing: { line: 240, lineRule: 'auto', before: 0, after: 0 },
  indent: { left: 720 },
  shading: { type: 'clear', fill: 'F5F5F5' },
});
// Маркований список
const li = (text) => new Paragraph({
  children: [r(text)],
  spacing: { ...LS, after: 0 },
  indent: { left: 720, hanging: 360 },
  bullet: { level: 0 },
});
// Розрив сторінки
const pb = () => new Paragraph({ children: [new PageBreak()], spacing: { after: 0 } });

// ── Таблиця ───────────────────────────────────────────────────────────────────
const BORDER = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
const CB     = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
const CM     = { top: 60, bottom: 60, left: 120, right: 120 };

const hc = (t) => new TableCell({
  children: [new Paragraph({ children: [rb(t)], spacing: { line: 240, after: 0 }, alignment: CENT })],
  shading: { type: 'clear', fill: 'BDD7EE' }, borders: CB, margins: CM,
});
const dc = (t) => new TableCell({
  children: [new Paragraph({ children: [r(t)],  spacing: { line: 240, after: 0 } })],
  borders: CB, margins: CM,
});
const tbl = (headers, rows) => new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({ children: headers.map(hc), tableHeader: true }),
    ...rows.map(row => new TableRow({ children: row.map(dc) })),
  ],
});

// ── Колонтитули ───────────────────────────────────────────────────────────────
const header = new Header({
  children: [pn([r('DevCourses — Лабораторна робота №1')], { alignment: RGHT })],
});
const footer = new Footer({
  children: [new Paragraph({
    children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: SZ })],
    alignment: CENT,
  })],
});

// ═══════════════════════════════════════════════════════════════════════════════
// ЗМІСТ ДОКУМЕНТА
// ═══════════════════════════════════════════════════════════════════════════════
const children = [

  // ── Титульна сторінка ──────────────────────────────────────────────────────
  pn([rb('НАЦІОНАЛЬНИЙ ТЕХНІЧНИЙ УНІВЕРСИТЕТ УКРАЇНИ')],            { alignment: CENT, spacing: { line: 360, before: 0, after: 0 } }),
  pn([rb('«КИЇВСЬКИЙ ПОЛІТЕХНІЧНИЙ ІНСТИТУТ')],                      { alignment: CENT, spacing: { line: 360, before: 0, after: 0 } }),
  pn([rb('імені ІГОРЯ СІКОРСЬКОГО»')],                               { alignment: CENT, spacing: { line: 360, before: 0, after: 280 } }),
  pn([r('Факультет інформатики та обчислювальної техніки')],         { alignment: CENT, spacing: { line: 360, before: 0, after: 0 } }),
  pn([r('Кафедра інформаційних систем та технологій')],              { alignment: CENT, spacing: { line: 360, before: 0, after: 560 } }),
  pn([rb('ЛАБОРАТОРНА РОБОТА № 1')],                                  { alignment: CENT, spacing: { line: 360, before: 0, after: 140 } }),
  pn([r('з дисципліни «WEB-орієнтовані технології. Backend розробки»')], { alignment: CENT, spacing: { line: 360, before: 0, after: 140 } }),
  pn([r('Тема: Розробка адаптивного веб-застосунку')],               { alignment: CENT, spacing: { line: 360, before: 0, after: 560 } }),

  pn([r('Виконав: студент групи ІО-31')],             { alignment: RGHT, spacing: { line: 360, before: 0, after: 0 } }),
  pn([rb('Сас Євгеній Олександрович')],               { alignment: RGHT, spacing: { line: 360, before: 0, after: 0 } }),
  pn([r('Перевірила: Світлана Леонідівна Проскура')], { alignment: RGHT, spacing: { line: 360, before: 0, after: 560 } }),
  pn([r('Київ – 2026')],                               { alignment: CENT, spacing: { line: 360, before: 0, after: 0 } }),
  pb(),

  // ── 1. Мета роботи ─────────────────────────────────────────────────────────
  h1('1. Мета роботи'),
  p('Набути практичних навичок розробки адаптивного односторінкового веб-застосунку з використанням семантичної HTML5-розмітки, стилізації CSS3 та інтерактивності на JavaScript. Реалізувати базовий REST API-сервер на Node.js/Express.'),
  nl(),

  // ── 2. Завдання ────────────────────────────────────────────────────────────
  h1('2. Завдання'),
  li('Розробити адаптивну веб-сторінку платформи DevCourses з каталогом IT-курсів.'),
  li('Реалізувати семантичну HTML5-розмітку (header, nav, main, section, article, footer).'),
  li('Стилізувати сторінку у темній темі з CSS Grid, Flexbox та CSS-анімаціями.'),
  li('Додати бургер-меню для мобільних пристроїв та scroll-анімації (IntersectionObserver).'),
  li('Реалізувати CRUD-ендпоінти для студентів на Express.js.'),
  nl(),

  // ── 3. Теоретичні відомості ────────────────────────────────────────────────
  h1('3. Теоретичні відомості'),

  h2('3.1 Семантична розмітка HTML5'),
  p('HTML5 запровадив набір семантичних елементів, що описують структуру документа: <header>, <nav>, <main>, <section>, <article>, <aside>, <footer>. На відміну від <div>, ці елементи мають смислове значення, покращуючи доступність і SEO.'),
  nl(),

  h2('3.2 CSS3: Grid, Flexbox, media queries'),
  p('CSS Grid — двовимірна система розмітки, що дозволяє керувати рядками і стовпцями одночасно. Flexbox — одновимірна система для розміщення елементів у ряд або колонку. Media queries (@media) змінюють стилі залежно від ширини вікна браузера, забезпечуючи адаптивність.'),
  nl(),

  h2('3.3 JavaScript: IntersectionObserver'),
  p('IntersectionObserver — API браузера, що асинхронно спостерігає за перетином елементів з viewport. Дозволяє реалізовувати lazy loading та scroll-анімації без постійного прослуховування події scroll, що значно ефективніше.'),
  nl(),

  h2('3.4 REST API на Express.js'),
  p('Express.js — мінімалістичний веб-фреймворк для Node.js. REST (Representational State Transfer) — архітектурний стиль взаємодії клієнт-сервер через HTTP. Основні HTTP-методи: GET (читання), POST (створення), PUT (оновлення), DELETE (видалення).'),
  nl(),

  // ── 4. Хід роботи ──────────────────────────────────────────────────────────
  pb(),
  h1('4. Хід роботи'),

  h2('4.1 Структура проєкту'),
  tbl(
    ['Файл / Папка', 'Призначення'],
    [
      ['index.html',      'Головна сторінка (семантична HTML5-розмітка)'],
      ['css/style.css',   'Стилі: темна тема, Grid, Flexbox, media queries, анімації'],
      ['js/main.js',      'Бургер-меню, IntersectionObserver, активна навігація'],
      ['api/server.js',   'Express REST API: GET/POST/PUT/DELETE /students'],
      ['assets/',         'Діаграми use-case та ER у форматі PNG'],
    ]
  ),
  nl(),

  h2('4.2 HTML5-структура (index.html)'),
  p('Сторінка побудована на семантичних тегах. Хедер містить логотип і навігацію з бургер-кнопкою. Секція hero — заголовок та кнопка CTA. Секція courses — Grid-сітка з 6 картками курсів. Секція about — статистика платформи. Footer — копірайт та посилання.'),
  nl(),

  h2('4.3 CSS3: ключові технічні рішення'),
  tbl(
    ['Технологія', 'Застосування'],
    [
      ['CSS змінні (--primary, --bg)',    'Темна тема через кастомні властивості'],
      ['CSS Grid (3→2→1 колонки)',        'Адаптивна сітка курсів'],
      ['Flexbox',                          'Навігація, хедер, картки курсів'],
      ['@media ≤1024, ≤768, ≤480px',     'Три брейкпоінти для мобільних'],
      ['@keyframes fadeInUp',             'Плавна поява елементів при скролі'],
    ]
  ),
  nl(),

  h2('4.4 JavaScript (js/main.js)'),
  p('Реалізовано три функції. Перша — toggleBurger() — перемикає клас .active на меню при кліку на бургер-кнопку. Друга — initScrollAnimations() — використовує IntersectionObserver для додавання класу .visible картками при появі у viewport. Третя — highlightActiveNav() — підсвічує активний пункт навігації при прокрутці.'),
  nl(),

  h2('4.5 REST API (api/server.js)'),
  code("const express = require('express');"),
  code("const app = express();"),
  code("app.use(express.json());"),
  code(''),
  code("// Масив студентів (імітація БД)"),
  code("let students = [{ id: 1, name: 'Іван Петренко', course: 'JavaScript' }];"),
  code(''),
  code("app.get('/students',       (req, res) => res.json(students));"),
  code("app.post('/students',      (req, res) => { /* додати студента */ });"),
  code("app.put('/students/:id',   (req, res) => { /* оновити студента */ });"),
  code("app.delete('/students/:id',(req, res) => { /* видалити студента */ });"),
  code(''),
  code("app.listen(3000);"),
  nl(),

  // ── 5. Діаграми ────────────────────────────────────────────────────────────
  pb(),
  h1('5. Діаграми'),

  h2('5.1 Use-Case діаграма'),
  p('Use-case діаграма демонструє взаємодію акторів (Студент, Адмін) із системою. Студент може переглядати курси, реєструватися, записуватися на курс, переглядати профіль та проходити курс. Адмін — управляти курсами та студентами, переглядати статистику, налаштовувати систему.'),
  nl(),
  img(IMG_UC, 460, 256),
  new Paragraph({
    children: [new TextRun({ text: 'Рис. 5.1 — Use-Case діаграма системи DevCourses', font: FONT, size: 24, italics: true })],
    alignment: CENT, spacing: { line: 360, after: 0 },
  }),
  nl(),

  h2('5.2 ER-діаграма'),
  p('ER-діаграма описує чотири сутності: Студент (id, name, email, password, group, created_at), Курс (id, category_id FK, title, description, duration_h, level ENUM), Категорія (id, name, slug) та Запис (id, student_id FK, course_id FK, enrolled_at, progress). Зв\'язки: Студент 1:M Запис, Курс 1:M Запис, Категорія 1:M Курс.'),
  nl(),
  img(IMG_ER, 460, 256),
  new Paragraph({
    children: [new TextRun({ text: 'Рис. 5.2 — ER-діаграма бази даних DevCourses', font: FONT, size: 24, italics: true })],
    alignment: CENT, spacing: { line: 360, after: 0 },
  }),
  nl(),

  // ── 6. Тестування ──────────────────────────────────────────────────────────
  pb(),
  h1('6. Тестування'),

  h2('6.1 Адаптивність'),
  tbl(
    ['Ширина viewport', 'Колонки курсів', 'Бургер-меню', 'Результат'],
    [
      ['> 1024 px', '3 колонки', 'Приховане', '✓ Відповідає вимогам'],
      ['769–1024 px', '2 колонки', 'Приховане', '✓ Відповідає вимогам'],
      ['≤ 768 px', '1 колонка', 'Відображається', '✓ Відповідає вимогам'],
      ['≤ 480 px', '1 колонка', 'Відображається', '✓ Відповідає вимогам'],
    ]
  ),
  nl(),

  h2('6.2 REST API — тестування через curl'),
  code('# Отримати всіх студентів'),
  code('curl http://localhost:3000/students'),
  code(''),
  code('# Додати студента'),
  code("curl -X POST http://localhost:3000/students \\"),
  code('  -H "Content-Type: application/json" \\'),
  code('  -d \'{"name":"Марія Коваль","course":"Node.js"}\''),
  code(''),
  code('# Видалити студента'),
  code('curl -X DELETE http://localhost:3000/students/1'),
  nl(),

  // ── 7. Версійний контроль Git ─────────────────────────────────────────────
  pb(),
  h1('7. Версійний контроль Git'),
  p('Розробка велася з дотриманням Git Flow: гілка main містить стабільну версію, develop — поточну розробку, feature/* — окремі функціональності. Коміти оформлені у форматі Conventional Commits (feat:, fix:, docs:, chore:).'),
  nl(),
  tbl(
    ['Гілка', 'Призначення'],
    [
      ['main',                   'Стабільна версія — v1.0.0'],
      ['develop',                'Гілка інтеграції'],
      ['feature/html-structure', 'Семантична HTML-розмітка'],
      ['feature/styles',         'CSS: темна тема, Grid, Flexbox'],
      ['feature/burger-menu',    'Бургер-меню та JS-інтерактивність'],
      ['feature/rest-api',       'Express CRUD API для студентів'],
    ]
  ),
  nl(),
  p('Репозиторій GitHub: https://github.com/Freazg/devcourses'),
  nl(),

  // ── 8. Висновки ────────────────────────────────────────────────────────────
  pb(),
  h1('8. Висновки'),
  p('У результаті виконання лабораторної роботи № 1 розроблено адаптивний веб-застосунок платформи DevCourses. Використано семантичну HTML5-розмітку з 6 структурними тегами, CSS3 з темною темою, Grid (3/2/1 колонки), Flexbox та трьома media-query брейкпоінтами. Реалізовано бургер-меню, IntersectionObserver для scroll-анімацій, підсвічування активного пункту навігації при прокрутці. Розроблено базовий CRUD REST API на Express.js для управління студентами. Проєкт розміщено на GitHub з дотриманням Git Flow та Conventional Commits.'),
  nl(),

  // ── 9. Список джерел ──────────────────────────────────────────────────────
  h1('9. Список використаних джерел'),
  pn([r('1. MDN Web Docs. HTML5 Semantic Elements. — https://developer.mozilla.org/en-US/docs/Web/HTML')], { spacing: { ...LS, after: 0 } }),
  pn([r('2. MDN Web Docs. CSS Grid Layout. — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout')], { spacing: { ...LS, after: 0 } }),
  pn([r('3. MDN Web Docs. Intersection Observer API. — https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API')], { spacing: { ...LS, after: 0 } }),
  pn([r('4. Express.js Documentation. — https://expressjs.com')], { spacing: { ...LS, after: 0 } }),
  pn([r('5. Conventionalcommits.org. Conventional Commits 1.0.0. — https://www.conventionalcommits.org')], { spacing: { ...LS, after: 0 } }),
];

// ═══════════════════════════════════════════════════════════════════════════════
// ЗБІРКА ДОКУМЕНТА
// ═══════════════════════════════════════════════════════════════════════════════
const doc = new Document({
  sections: [{
    properties: {
      page: { margin: { top: 1134, bottom: 1134, left: 1701, right: 567 } },
    },
    headers: { default: header },
    footers: { default: footer },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT, buf);
  console.log('DOCX saved:', OUT);
});
