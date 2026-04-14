const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, HeadingLevel, AlignmentType, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber, LevelFormat,
  TableOfContents, PageBreak, ExternalHyperlink
} = require('C:/Users/Євгеній/AppData/Roaming/npm/node_modules/docx');
const fs = require('fs');
const path = require('path');

const BASE = "C:/Users/Євгеній/Desktop/Комп'ютерна графіка та мультимедіа/веб/lab1";

// ── helpers ──────────────────────────────────────────────────────────────────
const font = 'Times New Roman';
const sz   = 28; // 14pt

function p(children, opts = {}) {
  return new Paragraph({
    children: Array.isArray(children) ? children : [new TextRun({ text: children, font, size: sz })],
    spacing: { before: 0, after: 120, line: 360, lineRule: 'auto' },
    indent: { firstLine: 720 },
    ...opts,
  });
}

function pNoIndent(children, opts = {}) {
  return new Paragraph({
    children: Array.isArray(children) ? children : [new TextRun({ text: children, font, size: sz })],
    spacing: { before: 0, after: 120, line: 360, lineRule: 'auto' },
    ...opts,
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, font, size: 32, bold: true })],
    spacing: { before: 240, after: 120 },
    alignment: AlignmentType.CENTER,
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, font, size: 28, bold: true })],
    spacing: { before: 200, after: 100 },
  });
}

function bold(text) {
  return new TextRun({ text, font, size: sz, bold: true });
}

function run(text) {
  return new TextRun({ text, font, size: sz });
}

function bullet(text) {
  return new Paragraph({
    children: [new TextRun({ text, font, size: sz })],
    numbering: { reference: 'bullets', level: 0 },
    spacing: { before: 0, after: 80, line: 360, lineRule: 'auto' },
  });
}

function numbered(text) {
  return new Paragraph({
    children: [new TextRun({ text, font, size: sz })],
    numbering: { reference: 'numbers', level: 0 },
    spacing: { before: 0, after: 80, line: 360, lineRule: 'auto' },
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function space() {
  return new Paragraph({ children: [new TextRun({ text: '' })], spacing: { before: 0, after: 120 } });
}

// ── image helper ──────────────────────────────────────────────────────────────
function img(filename, width, height) {
  const data = fs.readFileSync(path.join(BASE, 'assets', filename));
  return new Paragraph({
    children: [new ImageRun({
      type: 'png',
      data,
      transformation: { width, height },
      altText: { title: filename, description: filename, name: filename },
    })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 120 },
  });
}

// ── table helpers ─────────────────────────────────────────────────────────────
const border = { style: BorderStyle.SINGLE, size: 6, color: '888888' };
const borders = { top: border, bottom: border, left: border, right: border };

function tableRow(cells, isHeader = false) {
  return new TableRow({
    children: cells.map((text, i) =>
      new TableCell({
        borders,
        width: { size: Math.floor(9360 / cells.length), type: WidthType.DXA },
        shading: isHeader
          ? { fill: '6c63ff', type: ShadingType.CLEAR }
          : { fill: i % 2 === 0 ? 'f0f0ff' : 'ffffff', type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({
          children: [new TextRun({
            text,
            font,
            size: 24,
            bold: isHeader,
            color: isHeader ? 'ffffff' : '000000',
          })],
          alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
        })],
      })
    ),
  });
}

function makeTable(header, rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: Array(header.length).fill(Math.floor(9360 / header.length)),
    rows: [tableRow(header, true), ...rows.map(r => tableRow(r))],
  });
}

// ── code block ────────────────────────────────────────────────────────────────
function codeBlock(lines) {
  return lines.map(line =>
    new Paragraph({
      children: [new TextRun({ text: line, font: 'Courier New', size: 20, color: '1a1a2e' })],
      shading: { fill: 'f4f4f8', type: ShadingType.CLEAR },
      spacing: { before: 0, after: 0, line: 280, lineRule: 'auto' },
      indent: { left: 360 },
    })
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  DOCUMENT
// ─────────────────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: '\u2013',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: 'numbers',
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: '%1.',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },

  styles: {
    default: {
      document: { run: { font, size: sz } },
    },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal',
        run: { font, size: 32, bold: true, color: '1a1a2e' },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal',
        run: { font, size: 28, bold: true, color: '1a1a2e' },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 },
      },
      {
        id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal',
        run: { font, size: 28, bold: true, italics: true, color: '333333' },
        paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 },
      },
    ],
  },

  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 2016, right: 1440, bottom: 2016, left: 2880 },
      },
    },
    headers: {
      default: new Header({
        children: [
          pNoIndent([
            run('DevCourses — Лабораторна робота №1'),
          ], { alignment: AlignmentType.RIGHT }),
        ],
      }),
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: 'Сторінка ', font, size: 20 }),
              new TextRun({ children: [PageNumber.CURRENT], font, size: 20 }),
              new TextRun({ text: ' з ', font, size: 20 }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], font, size: 20 }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
      }),
    },

    children: [

      // ══════════════════════════════════════════════════
      //  ТИТУЛЬНА СТОРІНКА
      // ══════════════════════════════════════════════════
      pNoIndent([bold('НАЦІОНАЛЬНИЙ ТЕХНІЧНИЙ УНІВЕРСИТЕТ УКРАЇНИ')],
        { alignment: AlignmentType.CENTER, spacing: { before: 720, after: 80 } }),
      pNoIndent([bold('«КИЇВСЬКИЙ ПОЛІТЕХНІЧНИЙ ІНСТИТУТ')],
        { alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 } }),
      pNoIndent([bold('імені ІГОРЯ СІКОРСЬКОГО»')],
        { alignment: AlignmentType.CENTER, spacing: { before: 0, after: 200 } }),
      pNoIndent([run('Факультет інформатики та обчислювальної техніки')],
        { alignment: AlignmentType.CENTER }),
      pNoIndent([run('Кафедра інформаційних систем та технологій')],
        { alignment: AlignmentType.CENTER, spacing: { before: 0, after: 600 } }),

      pNoIndent([bold('Лабораторна робота №1')],
        { alignment: AlignmentType.CENTER, spacing: { before: 0, after: 120 } }),
      pNoIndent([run('з дисципліни «WEB-орієнтовані технології. Backend розробки»')],
        { alignment: AlignmentType.CENTER }),
      pNoIndent([bold('на тему:')],
        { alignment: AlignmentType.CENTER }),
      pNoIndent([bold('«ВИБІР ПРЕДМЕТНОЇ ОБЛАСТІ. АНАЛІЗ, МОДЕЛЮВАННЯ')],
        { alignment: AlignmentType.CENTER }),
      pNoIndent([bold('ТА РОЗРОБЛЕННЯ АДАПТИВНОГО WEB-ЗАСТОСУНКУ»')],
        { alignment: AlignmentType.CENTER, spacing: { before: 0, after: 1200 } }),

      pNoIndent([run('Київ – 2025')],
        { alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 } }),

      pageBreak(),

      // ══════════════════════════════════════════════════
      //  ЗМІСТ
      // ══════════════════════════════════════════════════
      new TableOfContents('ЗМІСТ', {
        hyperlink: true,
        headingStyleRange: '1-3',
      }),

      pageBreak(),

      // ══════════════════════════════════════════════════
      //  1. АНАЛІЗ ТА МОДЕЛЮВАННЯ СИСТЕМИ
      // ══════════════════════════════════════════════════
      h1('1 АНАЛІЗ ТА МОДЕЛЮВАННЯ СИСТЕМИ'),

      // 1.1 Актуальність
      h2('1.1 Актуальність теми'),
      p('Сьогодні ринок ІТ-освіти стрімко зростає. За даними аналітичних агентств, попит на онлайн-курси з програмування у 2024–2025 роках збільшився більш ніж на 40% порівняно з доковідним рівнем. Класичні університетські програми не завжди встигають за темпом змін технологічного середовища, тому студенти та фахівці шукають альтернативні джерела знань.'),
      p('Проблема полягає у відсутності зручних, адаптивних та безкоштовних освітніх платформ для вивчення веб-технологій українською мовою. Більшість існуючих рішень або платні, або не оптимізовані для мобільних пристроїв, або не надають практичних завдань у поєднанні з теоретичним матеріалом.'),
      p([bold('DevCourses'), run(' — це спроба вирішити зазначену проблему: створити адаптивну веб-платформу з каталогом IT-курсів, зручним інтерфейсом та REST API для управління даними студентів і курсів.')]),

      // 1.2 Мета
      h2('1.2 Мета та задачі роботи'),
      p([bold('Мета роботи'), run(' — розробити адаптивний веб-застосунок платформи IT-курсів DevCourses з використанням сучасних веб-технологій (HTML5, CSS3, JavaScript) та реалізувати серверну частину на Node.js з фреймворком Express.js у вигляді REST API.')]),
      space(),
      p([bold('Задачі роботи:')]),
      numbered('Визначити вимоги до інформаційної системи.'),
      numbered('Спроектувати архітектуру веб-застосунку та базу даних.'),
      numbered('Розробити адаптивний HTML/CSS/JS інтерфейс з підтримкою мобільних пристроїв.'),
      numbered('Реалізувати REST API на Node.js + Express.js з повним CRUD для студентів.'),
      numbered('Протестувати коректність відображення на пристроях різної роздільної здатності.'),
      numbered('Організувати версійний контроль через Git/GitHub з правильними гілками та комітами.'),
      space(),

      // 1.3 Об'єкт
      h2('1.3 Об\'єкт та предмет роботи'),
      p([bold('Об\'єкт роботи'), run(' — освітня веб-платформа DevCourses, що надає доступ до каталогу IT-курсів для студентів та розробників.')]),
      p([bold('Предмет роботи'), run(' — адаптивний інтерфейс користувача та REST API веб-застосунку DevCourses: їх структура, функціональність та технічна реалізація на базі HTML5, CSS3, JavaScript, Node.js та Express.js.')]),

      // 1.4 Бізнес-логіка
      h2('1.4 Бізнес-логіка системи'),
      p('Бізнес-логіка DevCourses описує правила та алгоритми роботи платформи:'),
      bullet('Відвідувач може переглядати каталог курсів без реєстрації.'),
      bullet('Для запису на курс студент повинен пройти реєстрацію (ввести ім\'я, email, групу).'),
      bullet('Кожен курс має рівень складності (початківець, середній, просунутий) та тривалість у годинах.'),
      bullet('Курси групуються за категоріями (Frontend, Backend, DevOps тощо).'),
      bullet('Адміністратор може додавати, редагувати та видаляти курси і студентів через API.'),
      bullet('Прогрес проходження курсу зберігається у відсотках (0–100%).'),
      space(),

      // 1.5 Функціональні вимоги
      h2('1.5 Функціональні вимоги (FR)'),
      makeTable(
        ['Код', 'Вимога', 'Пріоритет'],
        [
          ['FR-1',  'Відображення каталогу курсів у вигляді адаптивної сітки карток',        'Високий'],
          ['FR-2',  'Адаптивна навігація, що трансформується у бургер-меню на мобільних',    'Високий'],
          ['FR-3',  'Реєстрація нового студента (ім\'я, email, група) через API',             'Високий'],
          ['FR-4',  'Перегляд списку всіх студентів (GET /students)',                         'Середній'],
          ['FR-5',  'Додавання нового студента (POST /students)',                             'Високий'],
          ['FR-6',  'Оновлення даних студента (PUT /students/:id)',                          'Середній'],
          ['FR-7',  'Видалення студента (DELETE /students/:id)',                             'Середній'],
          ['FR-8',  'Плавна поява елементів при скролі (scroll анімація)',                   'Низький'],
          ['FR-9',  'Підсвічування активного пункту меню при прокрутці',                    'Низький'],
          ['FR-10', 'Відображення статистики платформи (кількість курсів, студентів)',        'Низький'],
        ]
      ),
      space(),

      // 1.6 Нефункціональні вимоги
      h2('1.6 Нефункціональні вимоги (NFR)'),
      makeTable(
        ['Код', 'Вимога', 'Категорія'],
        [
          ['NFR-1', 'Час завантаження сторінки < 2 секунд на швидкості 10 Мбіт/с',      'Продуктивність'],
          ['NFR-2', 'Підтримка браузерів: Chrome, Firefox, Edge, Safari (останні 2 версії)', 'Сумісність'],
          ['NFR-3', 'Адаптивність для екранів 320px–2560px',                            'Адаптивність'],
          ['NFR-4', 'Час відповіді API < 100 мс для CRUD операцій',                     'Продуктивність'],
          ['NFR-5', 'Валідація вхідних даних на рівні API (обов\'язкові поля)',           'Безпека'],
          ['NFR-6', 'Логічна організація файлів: /css, /js, /assets, /api',             'Підтримуваність'],
          ['NFR-7', 'Семантична HTML-розмітка для покращення SEO та доступності',       'Доступність'],
        ]
      ),
      space(),

      // 1.7 Use-case
      h2('1.7 Use-case діаграма'),
      p('Use-case діаграма відображає функціональні можливості системи DevCourses з точки зору двох акторів: Студента та Адміністратора. Студент може переглядати курси, реєструватись, записуватись на курс, переглядати профіль та проходити курс. Адміністратор має додаткові права: управляти курсами та студентами, переглядати статистику та налаштовувати систему.'),
      space(),
      img('usecase_diagram.png', 580, 330),
      pNoIndent([run('Рисунок 1.1 — Use-case діаграма системи DevCourses')],
        { alignment: AlignmentType.CENTER, spacing: { before: 0, after: 240 } }),

      // 1.8 ER-діаграма
      h2('1.8 ER-діаграма'),
      p('ER-діаграма описує структуру бази даних системи DevCourses. Система містить чотири сутності: Студент, Курс, Категорія та Запис. Студент може записатись на декілька курсів (зв\'язок M:N реалізований через таблицю Запис). Кожен курс належить до однієї категорії (M:1).'),
      space(),
      img('er_diagram.png', 580, 330),
      pNoIndent([run('Рисунок 1.2 — ER-діаграма бази даних DevCourses')],
        { alignment: AlignmentType.CENTER, spacing: { before: 0, after: 240 } }),

      pageBreak(),

      // ══════════════════════════════════════════════════
      //  2. АДАПТИВНИЙ ВЕБ-ЗАСТОСУНОК
      // ══════════════════════════════════════════════════
      h1('2 АДАПТИВНИЙ ВЕБ-ЗАСТОСУНОК'),

      h2('2.1 Файлова структура проєкту'),
      p('Файлова структура організована відповідно до вимог кафедри:'),
      ...codeBlock([
        'lab1/',
        '├── index.html          # Головна сторінка',
        '├── css/',
        '│   └── style.css       # Стилі (темна тема, grid, media queries)',
        '├── js/',
        '│   └── main.js         # Бургер-меню, анімації, навігація',
        '├── assets/',
        '│   ├── usecase_diagram.png',
        '│   └── er_diagram.png',
        '├── api/',
        '│   ├── server.js       # Node.js + Express REST API',
        '│   └── package.json',
        '└── README.md',
      ]),
      space(),

      h2('2.2 HTML-структура'),
      p('Сторінка побудована на семантичній розмітці HTML5: теги <header>, <nav>, <main>, <section>, <article>, <footer>. Це забезпечує доступність та SEO-оптимізацію.'),
      ...codeBlock([
        '<!-- Шапка з логотипом та навігацією -->',
        '<header class="header">',
        '  <div class="container header__inner">',
        '    <a href="#" class="logo">...</a>',
        '    <nav class="nav" id="nav">',
        '      <ul class="nav__list">',
        '        <li><a href="#home" class="nav__link">Головна</a></li>',
        '        <!-- інші пункти меню -->',
        '      </ul>',
        '    </nav>',
        '    <button class="burger" id="burger">...</button>',
        '  </div>',
        '</header>',
        '',
        '<!-- Головний блок з секціями -->',
        '<main>',
        '  <section class="hero" id="home">...</section>',
        '  <section class="courses" id="courses">...</section>',
        '  <section class="about" id="about">...</section>',
        '</main>',
        '',
        '<!-- Нижній колонтитул -->',
        '<footer class="footer">...</footer>',
      ]),
      space(),

      h2('2.3 Адаптивна сітка карток (CSS Grid + Media Queries)'),
      p('Картки курсів відображаються у сітці: 3 колонки на десктопі, 2 на планшеті, 1 на смартфоні.'),
      ...codeBlock([
        '/* Сітка карток — 3 колонки за замовчуванням */',
        '.cards {',
        '  display: grid;',
        '  grid-template-columns: repeat(3, 1fr);',
        '  gap: 1.5rem;',
        '}',
        '',
        '/* Планшет <= 1024px — 2 колонки */',
        '@media (max-width: 1024px) {',
        '  .cards { grid-template-columns: repeat(2, 1fr); }',
        '}',
        '',
        '/* Смартфон <= 480px — 1 колонка */',
        '@media (max-width: 480px) {',
        '  .cards { grid-template-columns: 1fr; }',
        '}',
      ]),
      space(),

      h2('2.4 Бургер-меню (CSS + JavaScript)'),
      p('На екранах <= 768px навігаційне меню приховується та відкривається через бургер-кнопку з плавною CSS-анімацією.'),
      ...codeBlock([
        '/* CSS: плавне відкриття меню */',
        '.nav {',
        '  max-height: 0;',
        '  overflow: hidden;',
        '  transition: max-height 0.35s ease;',
        '}',
        '.nav.open { max-height: 320px; }',
        '',
        '/* JS: toggle класів */',
        'burger.addEventListener("click", () => {',
        '  burger.classList.toggle("active");',
        '  nav.classList.toggle("open");',
        '});',
      ]),
      space(),

      h2('2.5 Scroll-анімації (IntersectionObserver)'),
      p('Елементи з класом .fade-in плавно з\'являються при прокрутці сторінки за допомогою IntersectionObserver API.'),
      ...codeBlock([
        'const observer = new IntersectionObserver((entries) => {',
        '  entries.forEach(entry => {',
        '    if (entry.isIntersecting) {',
        '      entry.target.classList.add("visible");',
        '      observer.unobserve(entry.target);',
        '    }',
        '  });',
        '}, { threshold: 0.15 });',
        '',
        'document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));',
      ]),
      space(),

      pageBreak(),

      // ══════════════════════════════════════════════════
      //  3. REST API
      // ══════════════════════════════════════════════════
      h1('3 NODE.JS + EXPRESS REST API'),

      h2('3.1 Встановлення та налаштування'),
      p('Для розгортання серверної частини потрібно встановити залежності та запустити сервер:'),
      ...codeBlock([
        '# Перейти до папки API',
        'cd lab1/api',
        '',
        '# Встановити залежності',
        'npm install',
        '',
        '# Запустити сервер',
        'node server.js',
        '# → Сервер запущено: http://localhost:3000',
      ]),
      space(),

      h2('3.2 Маршрути API'),
      makeTable(
        ['Метод', 'Маршрут', 'Опис'],
        [
          ['GET',    '/',               'Перевірка роботи сервера'],
          ['GET',    '/students',       'Отримати список усіх студентів'],
          ['POST',   '/students',       'Додати нового студента'],
          ['PUT',    '/students/:id',   'Оновити дані студента за id'],
          ['DELETE', '/students/:id',   'Видалити студента за id'],
        ]
      ),
      space(),

      h2('3.3 Приклад коду сервера'),
      ...codeBlock([
        'const express = require("express");',
        'const app = express();',
        'app.use(express.json());',
        '',
        'let students = [',
        '  { id: 1, name: "Іваненко Олексій", group: "ІС-31" },',
        '  { id: 2, name: "Петренко Марія",   group: "ІС-31" },',
        '];',
        '',
        '// GET /students — список студентів',
        'app.get("/students", (req, res) => {',
        '  res.json(students);',
        '});',
        '',
        '// POST /students — додати студента',
        'app.post("/students", (req, res) => {',
        '  const { name, group } = req.body;',
        '  if (!name || !group)',
        '    return res.status(400).json({ error: "Поля name та group обов\'язкові" });',
        '  const newStudent = { id: students.length + 1, name, group };',
        '  students.push(newStudent);',
        '  res.status(201).json(newStudent);',
        '});',
        '',
        'app.listen(3000, () => console.log("Server on http://localhost:3000"));',
      ]),
      space(),

      h2('3.4 Тестування API'),
      p('Перевірка маршрутів через браузер та curl:'),
      ...codeBlock([
        '# Отримати список студентів',
        'curl http://localhost:3000/students',
        '',
        '# Додати студента',
        'curl -X POST http://localhost:3000/students \\',
        '  -H "Content-Type: application/json" \\',
        '  -d \'{"name":"Коваленко Іван","group":"ІС-32"}\'',
        '',
        '# Оновити студента з id=1',
        'curl -X PUT http://localhost:3000/students/1 \\',
        '  -H "Content-Type: application/json" \\',
        '  -d \'{"group":"ІС-33"}\'',
        '',
        '# Видалити студента з id=1',
        'curl -X DELETE http://localhost:3000/students/1',
      ]),
      space(),

      pageBreak(),

      // ══════════════════════════════════════════════════
      //  4. GIT / GITHUB
      // ══════════════════════════════════════════════════
      h1('4 РОБОТА З GIT ТА GITHUB'),

      h2('4.1 Структура репозиторію та гілки'),
      p('Репозиторій організований відповідно до Git Flow:'),
      bullet('main — стабільна версія (production)'),
      bullet('develop — основна гілка розробки'),
      bullet('feature/html-structure — розробка HTML'),
      bullet('feature/styles — розробка CSS'),
      bullet('feature/burger-menu — бургер-меню та JS'),
      bullet('feature/rest-api — Node.js + Express API'),
      space(),

      h2('4.2 Приклади комітів (Conventional Commits)'),
      makeTable(
        ['Тип', 'Повідомлення коміту', 'Опис'],
        [
          ['chore', 'chore: init project structure',                               'Початкова структура'],
          ['feat',  'feat: add base HTML structure with semantic markup',           'Семантична розмітка'],
          ['feat',  'feat: add responsive CSS with dark theme and animations',     'CSS стилі'],
          ['feat',  'feat: add burger menu, scroll animations and active nav',     'JavaScript'],
          ['feat',  'feat: add Node.js/Express REST API with CRUD routes',        'Backend API'],
          ['feat',  'feat: merge develop into main — v1.0.0 release',             'Реліз'],
        ]
      ),
      space(),

      h2('4.3 Ініціалізація репозиторію'),
      ...codeBlock([
        '# Ініціалізація',
        'git init',
        'git checkout -b main',
        '',
        '# Перший коміт',
        'git add README.md .gitignore',
        'git commit -m "chore: init project structure"',
        '',
        '# Гілка розробки',
        'git checkout -b develop',
        '',
        '# Feature гілка',
        'git checkout -b feature/html-structure',
        'git add index.html',
        'git commit -m "feat: add base HTML structure with semantic markup"',
        '',
        '# Merge назад у develop',
        'git checkout develop',
        'git merge feature/html-structure --no-ff',
        '',
        '# Фінальний merge у main',
        'git checkout main',
        'git merge develop --no-ff -m "feat: merge develop into main — v1.0.0"',
        '',
        '# Публікація на GitHub',
        'git remote add origin https://github.com/<username>/devcourses.git',
        'git push -u origin main',
        'git push origin develop',
      ]),
      space(),

      pageBreak(),

      // ══════════════════════════════════════════════════
      //  ВИСНОВКИ
      // ══════════════════════════════════════════════════
      h1('ВИСНОВКИ'),
      p('У ході виконання лабораторної роботи №1 було досягнуто всіх поставлених задач:'),
      numbered('Визначено предметну область — платформа IT-курсів DevCourses — та сформульовано актуальність, мету, задачі, об\'єкт і предмет роботи.'),
      numbered('Описано бізнес-логіку системи та сформовано перелік функціональних і нефункціональних вимог.'),
      numbered('Побудовано Use-case діаграму, яка відображає взаємодію акторів (Студент, Адмін) із функціями системи.'),
      numbered('Побудовано ER-діаграму з чотирма сутностями: Студент, Курс, Категорія, Запис.'),
      numbered('Розроблено адаптивний веб-застосунок на HTML5/CSS3/JS з темною темою, сіткою карток, бургер-меню та scroll-анімаціями.'),
      numbered('Реалізовано REST API на Node.js + Express.js з повним CRUD для ресурсу /students.'),
      numbered('Організовано Git-репозиторій з правильними feature гілками та комітами у форматі Conventional Commits.'),
      space(),
      p('Набуті навички включають: семантичну HTML-верстку, адаптивний дизайн засобами CSS Grid та Media Queries, роботу з IntersectionObserver для анімацій, побудову REST API на Express.js та організацію Git workflow відповідно до стандартів кафедри.'),

      pageBreak(),

      // ══════════════════════════════════════════════════
      //  СПИСОК ДЖЕРЕЛ
      // ══════════════════════════════════════════════════
      h1('ПЕРЕЛІК ВИКОРИСТАНИХ ДЖЕРЕЛ'),
      numbered('Оформлення текстових документів у навчальному процесі. Стандарт організації (кафедри) СОУ ІСТ 01-22.'),
      numbered('Conventional Commits. URL: https://www.conventionalcommits.org/en/v1.0.0/'),
      numbered('HTML5 & CSS3 — MDN Web Docs. URL: https://developer.mozilla.org/uk/'),
      numbered('Node.js Documentation. URL: https://nodejs.org/docs/latest/api/'),
      numbered('Express.js Guide. URL: https://expressjs.com/en/guide/routing.html'),
      numbered('CSS Grid Layout — MDN. URL: https://developer.mozilla.org/uk/docs/Web/CSS/CSS_grid_layout'),
      numbered('IntersectionObserver API — MDN. URL: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API'),
      numbered('W3Schools Ukrainian. URL: https://w3schoolsua.github.io/'),
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  const out = `${BASE}/ЛР1_Звіт_DevCourses.docx`;
  fs.writeFileSync(out, buf);
  console.log('DOCX saved:', out);
}).catch(e => { console.error(e); process.exit(1); });
