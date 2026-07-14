// Mapping from browser language codes to our translation keys
const LANG_ALIASES = {
  'en-US':'en','en-GB':'en','en':'en',
  'zh':'zh','zh-CN':'zh','zh-Hans':'zh','zh-SG':'zh',
  'nb':'nb','no':'nb',
  'pt':'pt','pt-PT':'pt','pt-BR':'pt',
};

const LANG_LABELS = {
  ca:'Català', es:'Español', en:'English', fr:'Français', de:'Deutsch',
  it:'Italiano', pt:'Português', nl:'Nederlands', pl:'Polski', sv:'Svenska',
  da:'Dansk', nb:'Norsk', fi:'Suomi', el:'Ελληνικά', cs:'Čeština',
  hu:'Magyar', ro:'Română', uk:'Українська', ru:'Русский', zh:'中文',
  ja:'日本語', lv:'Latviešu', lt:'Lietuvių', sk:'Slovenčina', sl:'Slovenščina',
  hr:'Hrvatski', sr:'Српски', bg:'Български', et:'Eesti', sq:'Shqip',
  ga:'Gaeilge', tr:'Türkçe'
};

function detectLang(){
  const stored = localStorage.getItem('efet-lang');
  if (stored && TRANSLATIONS[stored]) return stored;
  const candidates = navigator.languages || [navigator.language || 'en'];
  for (const raw of candidates){
    if (LANG_ALIASES[raw] && TRANSLATIONS[LANG_ALIASES[raw]]) return LANG_ALIASES[raw];
    const short = raw.split('-')[0];
    if (LANG_ALIASES[short] && TRANSLATIONS[LANG_ALIASES[short]]) return LANG_ALIASES[short];
    if (TRANSLATIONS[short]) return short;
  }
  return 'en';
}

function boldify(text){
  // convert **bold** markdown to <strong>, escape nothing else (trusted content)
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function populateLangSelect(current){
  const select = document.getElementById('lang-select');
  select.innerHTML = '';
  Object.keys(TRANSLATIONS).sort((a,b)=> (LANG_LABELS[a]||a).localeCompare(LANG_LABELS[b]||b)).forEach(code=>{
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = LANG_LABELS[code] || code;
    if (code === current) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener('change', ()=>{
    localStorage.setItem('efet-lang', select.value);
    render(select.value);
  });
}

function render(code){
  const t = TRANSLATIONS[code] || TRANSLATIONS['en'];
  document.documentElement.lang = code;
  document.title = t.title;
  document.getElementById('page-title').textContent = 'eFet';
  document.getElementById('what-is-text').textContent = t.whatIs;

  const stepsList = document.getElementById('steps-list');
  stepsList.innerHTML = '';
  t.steps.forEach(s=>{
    const li = document.createElement('li');
    li.textContent = s;
    stepsList.appendChild(li);
  });
  document.getElementById('perm-note').textContent = t.permNote;

  document.getElementById('langs-intro').textContent = t.langsIntro;
  document.getElementById('jazh-intro').innerHTML = boldify(t.jazhIntro.split('\n')[0]);
  document.getElementById('ja-bullet').innerHTML = boldify(t.jaBullet);
  document.getElementById('zh-bullet').innerHTML = boldify(t.zhBullet);
  document.getElementById('langs-closing').textContent = t.langsClosing;

  const faqList = document.getElementById('faq-list');
  faqList.innerHTML = '';
  t.faq.forEach(item=>{
    const details = document.createElement('details');
    details.className = 'faq-item';
    const summary = document.createElement('summary');
    summary.textContent = item.q;
    const p = document.createElement('p');
    p.textContent = item.a;
    details.appendChild(summary);
    details.appendChild(p);
    faqList.appendChild(details);
  });

  document.getElementById('label-reason').textContent = t.reasonLabel;
  const reasonSelect = document.getElementById('reason');
  reasonSelect.innerHTML = '';
  t.reasonOpts.forEach(opt=>{
    const o = document.createElement('option');
    o.value = opt; o.textContent = opt;
    reasonSelect.appendChild(o);
  });
  document.getElementById('label-name').textContent = t.nameLabel;
  document.getElementById('label-email').textContent = t.emailLabel;
  document.getElementById('label-message').textContent = t.messageLabel;
  document.getElementById('send-btn').textContent = t.sendLabel;

  // section headings (not stored per-key in translation object individually,
  // so reuse contact/faq/languages/how labels already rendered via h2 defaults)
  document.querySelectorAll('[data-i18n-heading]').forEach(h=>{
    const key = h.getAttribute('data-i18n-heading');
    if (key === 'how') h.textContent = sectionHeading(code,'how');
    if (key === 'languages') h.textContent = sectionHeading(code,'languages');
    if (key === 'faq') h.textContent = sectionHeading(code,'faq');
    if (key === 'contact') h.textContent = sectionHeading(code,'contact');
  });
  const eyebrow = document.querySelector('[data-i18n="eyebrow"]');
  if (eyebrow) eyebrow.textContent = sectionHeading(code,'support');
}

// Small heading dictionary (titles not captured verbatim during parsing,
// reconstructed here for consistent short labels across pages)
const HEADINGS = {
  ca:{support:'Suport', how:'Com funciona', languages:'Llengües disponibles', faq:'Preguntes freqüents', contact:'Contacta amb nosaltres'},
  es:{support:'Soporte', how:'Cómo funciona', languages:'Idiomas disponibles', faq:'Preguntas frecuentes', contact:'Contacta con nosotros'},
  en:{support:'Support', how:'How it works', languages:'Available languages', faq:'FAQ', contact:'Contact us'},
  fr:{support:'Assistance', how:'Comment ça marche', languages:'Langues disponibles', faq:'Questions fréquentes', contact:'Contactez-nous'},
  de:{support:'Support', how:"So funktioniert's", languages:'Verfügbare Sprachen', faq:'Häufige Fragen', contact:'Kontaktiere uns'},
  it:{support:'Supporto', how:'Come funziona', languages:'Lingue disponibili', faq:'Domande frequenti', contact:'Contattaci'},
  pt:{support:'Suporte', how:'Como funciona', languages:'Línguas disponíveis', faq:'Perguntas frequentes', contact:'Contacta-nos'},
  nl:{support:'Ondersteuning', how:'Hoe het werkt', languages:'Beschikbare talen', faq:'Veelgestelde vragen', contact:'Neem contact op'},
  pl:{support:'Wsparcie', how:'Jak to działa', languages:'Dostępne języki', faq:'Najczęstsze pytania', contact:'Skontaktuj się z nami'},
  sv:{support:'Support', how:'Så funkar det', languages:'Tillgängliga språk', faq:'Vanliga frågor', contact:'Kontakta oss'},
  da:{support:'Support', how:'Sådan fungerer det', languages:'Tilgængelige sprog', faq:'Ofte stillede spørgsmål', contact:'Kontakt os'},
  nb:{support:'Støtte', how:'Slik fungerer det', languages:'Tilgjengelige språk', faq:'Ofte stilte spørsmål', contact:'Kontakt oss'},
  fi:{support:'Tuki', how:'Näin se toimii', languages:'Saatavilla olevat kielet', faq:'Usein kysytyt kysymykset', contact:'Ota yhteyttä'},
  el:{support:'Υποστήριξη', how:'Πώς λειτουργεί', languages:'Διαθέσιμες γλώσσες', faq:'Συχνές ερωτήσεις', contact:'Επικοινώνησε μαζί μας'},
  cs:{support:'Podpora', how:'Jak to funguje', languages:'Dostupné jazyky', faq:'Časté dotazy', contact:'Kontaktuj nás'},
  hu:{support:'Támogatás', how:'Hogyan működik', languages:'Elérhető nyelvek', faq:'Gyakori kérdések', contact:'Lépj kapcsolatba velünk'},
  ro:{support:'Asistență', how:'Cum funcționează', languages:'Limbi disponibile', faq:'Întrebări frecvente', contact:'Contactează-ne'},
  uk:{support:'Підтримка', how:'Як це працює', languages:'Доступні мови', faq:'Часті запитання', contact:"Зв'яжись з нами"},
  ru:{support:'Поддержка', how:'Как это работает', languages:'Доступные языки', faq:'Частые вопросы', contact:'Свяжитесь с нами'},
  zh:{support:'支持', how:'使用方法', languages:'支持的语言', faq:'常见问题', contact:'联系我们'},
  ja:{support:'サポート', how:'使い方', languages:'対応言語', faq:'よくある質問', contact:'お問い合わせ'},
  lv:{support:'Atbalsts', how:'Kā tas darbojas', languages:'Pieejamās valodas', faq:'Biežāk uzdotie jautājumi', contact:'Sazinies ar mums'},
  lt:{support:'Pagalba', how:'Kaip tai veikia', languages:'Galimos kalbos', faq:'Dažniausi klausimai', contact:'Susisiek su mumis'},
  sk:{support:'Podpora', how:'Ako to funguje', languages:'Dostupné jazyky', faq:'Časté otázky', contact:'Kontaktuj nás'},
  sl:{support:'Podpora', how:'Kako deluje', languages:'Razpoložljivi jeziki', faq:'Pogosta vprašanja', contact:'Kontaktiraj nas'},
  hr:{support:'Podrška', how:'Kako funkcionira', languages:'Dostupni jezici', faq:'Često postavljana pitanja', contact:'Kontaktiraj nas'},
  sr:{support:'Подршка', how:'Како функционише', languages:'Доступни језици', faq:'Често постављана питања', contact:'Контактирај нас'},
  bg:{support:'Поддръжка', how:'Как работи', languages:'Налични езици', faq:'Често задавани въпроси', contact:'Свържи се с нас'},
  et:{support:'Tugi', how:'Kuidas see töötab', languages:'Saadaolevad keeled', faq:'Korduma kippuvad küsimused', contact:'Võta meiega ühendust'},
  sq:{support:'Mbështetje', how:'Si funksionon', languages:'Gjuhët e disponueshme', faq:'Pyetje të shpeshta', contact:'Na kontakto'},
  ga:{support:'Tacaíocht', how:'Conas a oibríonn sé', languages:'Teangacha atá ar fáil', faq:'Ceisteanna coitianta', contact:'Déan teagmháil linn'},
  tr:{support:'Destek', how:'Nasıl çalışır', languages:'Mevcut diller', faq:'Sıkça sorulan sorular', contact:'Bize ulaşın'}
};

function sectionHeading(code, key){
  const h = HEADINGS[code] || HEADINGS['en'];
  return h[key] || HEADINGS['en'][key];
}

// Contact form: build a mailto: link (static site, no backend)
document.addEventListener('submit', function(e){
  if (e.target && e.target.id === 'contact-form'){
    e.preventDefault();
    const reason = document.getElementById('reason').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const subject = encodeURIComponent('eFet — ' + reason);
    const bodyLines = [
      name ? ('Name: ' + name) : null,
      'Email: ' + email,
      '',
      message
    ].filter(Boolean);
    const body = encodeURIComponent(bodyLines.join('\n'));
    window.location.href = 'mailto:efet@bblp.cat?subject=' + subject + '&body=' + body;
  }
});

const initialLang = detectLang();
populateLangSelect(initialLang);
render(initialLang);
