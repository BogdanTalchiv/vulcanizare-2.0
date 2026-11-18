export const locales = ['ro', 'ru', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ro';
export const LOCALE_STORAGE_KEY = 'forcecar-lang';

export const localeMeta: Record<
  Locale,
  { label: string; htmlLang: string; ogLocale: string; short: string }
> = {
  ro: { label: 'Română', htmlLang: 'ro', ogLocale: 'ro_MD', short: 'RO' },
  ru: { label: 'Русский', htmlLang: 'ru', ogLocale: 'ru_MD', short: 'RU' },
  en: { label: 'English', htmlLang: 'en', ogLocale: 'en_MD', short: 'EN' },
};

type Dict = Record<string, string>;

const ro: Dict = {
  'meta.title': 'Vulcanizare 24/7 Chișinău | Force-Car – Ismail 103',
  'meta.description':
    'Vulcanizare non-stop 24/7 în Chișinău, str. Ismail 103: schimb anvelope, echilibrare roți, reparare pene și jante — deschis ziua și noaptea. Service auto. Sună: +373 79 535 005.',
  'meta.ogDescription':
    'Vulcanizare non-stop pe str. Ismail 103, Chișinău — deschis 24/7. Schimb anvelope, echilibrare, pene și jante. Sună: +373 79 535 005.',
  'meta.privacyTitle': 'Confidențialitate și cookie-uri | Force-Car',
  'meta.privacyDescription':
    'Cum tratează Force-Car datele tale: ce informații primim când ne contactezi, ce cookie-uri folosește site-ul și ce drepturi ai.',
  'meta.404Title': 'Pagina nu există | Force-Car',
  'meta.404Description': 'Pagina căutată nu există. Force-Car — vulcanizare 24/7 pe str. Ismail 103, Chișinău.',

  'skip': 'Sari la conținut',
  'brand.home': 'Force-Car — începutul paginii',
  'brand.homePage': 'Force-Car — pagina principală',
  'status.vulcanizare': 'Vulcanizare ',
  'nav.sections': 'Secțiuni',
  'nav.serviciu': 'Serviciu',
  'nav.serviceAuto': 'Service auto',
  'nav.nonStop': 'Non-stop',
  'nav.contact': 'Contact',
  'nav.callNow': 'Sună acum',
  'nav.whatsapp': 'Scrie-ne pe WhatsApp',
  'nav.openMenu': 'Deschide meniul',
  'nav.closeMenu': 'Închide meniul',
  'nav.lang': 'Limbă',

  'newtab': ' (se deschide într-o filă nouă)',
  'video.pause': 'Oprește videoclipul de fundal',
  'video.play': 'Pornește videoclipul de fundal',
  'repair.pause': 'Oprește animația',
  'repair.play': 'Pornește animația',

  'hero.h1a': 'Vulcanizare',
  'hero.h1b': 'Non-stop',
  'hero.status': 'Deschis 24/7 — Non-stop',
  'hero.lead':
    'Ai făcut pană sau trebuie să schimbi anvelopele? La Force-Car, pe str. Ismail 103 din Chișinău, vulcanizarea este disponibilă zi și noapte.',
  'hero.call': 'Sună acum',
  'hero.route': 'Deschide traseul',
  'hero.wa': 'sau scrie-ne pe WhatsApp',
  'hero.spec.hours': 'Program',
  'hero.spec.hoursValue': 'Vulcanizare ',
  'hero.spec.address': 'Adresă',
  'hero.spec.phone': 'Telefon',

  'services.index': 'Serviciu',
  'services.h2a': 'Roțile tale.',
  'services.h2b': 'Prioritatea\u00a0',
  'services.h2bAccent': 'noastră.',
  'services.note': 'Ce găsești la atelierul de pe str. Ismail 103, Chișinău.',
  'services.caption.rims': 'Jante',
  'services.caption.rimsText': ' Grijă la fiecare detaliu',
  'services.caption.stock': 'Stoc',
  'services.caption.stockText': ' Anvelope noi la atelier',
  'services.caption.weld': 'Jante',
  'services.caption.weldText': ' Îndreptare și sudură',
  'services.cta': 'Ai nevoie de vulcanizare? Sună la ',
  'services.ctaEnd': '.',

  'service.tire.title': 'Schimb anvelope',
  'service.tire.text': 'Montare și demontare anvelope, schimbarea roților.',
  'service.balance.title': 'Echilibrare roți',
  'service.balance.text': 'Echilibrarea roților pe stand, în atelier.',
  'service.nitrogen.title': 'Presiune cu azot',
  'service.nitrogen.text': 'Umflarea anvelopelor cu azot și controlul presiunii.',
  'service.stock.title': 'Anvelope pe stoc',
  'service.stock.text': 'Anvelope noi disponibile direct la atelier.',
  'service.puncture.title': 'Reparare pene',
  'service.puncture.text':
    'Reparații pentru anvelope perforate, atunci când acestea pot fi reparate în siguranță.',
  'service.rim.title': 'Reparare jante',
  'service.rim.text': 'Îndreptarea și sudura jantelor, în atelier.',

  'repair.eyebrow': 'Pas cu pas',
  'repair.s1.title': 'Demontare anvelopă',
  'repair.s1.text': 'Anvelopa este scoasă de pe jantă, pentru a putea verifica și repara roata.',
  'repair.s2.title': 'Reparație jantă',
  'repair.s3.title': 'Montaj final',
  'repair.s2.text': 'Janta este îndreptată și sudată acolo unde este nevoie, în atelier.',
  'repair.s3.text': 'Anvelopa revine pe jantă, iar roata este echilibrată pe stand.',
  'repair.step1': ' Demontare',
  'repair.step2': ' Reparație jantă',
  'repair.step3': ' Montaj final',

  'auto.index': 'Service auto',
  'auto.h2a': 'Mai mult decât',
  'auto.h2b': 'roți',
  'auto.lead':
    'Pe lângă vulcanizare, Force-Car are și service auto — de la diagnosticare computerizată până la reparații de motor.',
  'auto.listLabel': 'Lucrări service auto',
  'auto.diag': 'Diagnosticare computerizată',
  'auto.electric': 'Electrică auto',
  'auto.brakes': 'Frâne',
  'auto.suspension': 'Suspensie și direcție',
  'auto.oil': 'Schimb ulei și filtre',
  'auto.engine': 'Reparații motor',
  'auto.ctaLabel': 'Site-ul service-ului',
  'auto.ctaSoon': 'În curând',
  'auto.ctaLive': 'Vezi site-ul service-ului',
  'auto.note': 'Programul non-stop 24/7 se aplică doar vulcanizării.',

  'hours.index': 'Program',
  'hours.h2a': 'Nu există',
  'hours.h2b': 'oră nepotrivită.',
  'hours.24_7': '24 de ore din 24, 7 zile din 7',
  'hours.openNow': 'Deschis acum',
  'hours.fact.service': 'Serviciu',
  'hours.fact.serviceValue': 'Vulcanizare non-stop.',
  'hours.fact.hours': 'Program',
  'hours.fact.hoursValue': 'Zi, noapte și weekend.',
  'hours.fact.address': 'Adresă',
  'hours.weekLabel': 'Program pe zile: vulcanizare deschisă 00:00–24:00 în fiecare zi',
  'day.1': 'Luni',
  'day.1s': 'Lu',
  'day.2': 'Marți',
  'day.2s': 'Ma',
  'day.3': 'Miercuri',
  'day.3s': 'Mi',
  'day.4': 'Joi',
  'day.4s': 'Jo',
  'day.5': 'Vineri',
  'day.5s': 'Vi',
  'day.6': 'Sâmbătă',
  'day.6s': 'Sâ',
  'day.7': 'Duminică',
  'day.7s': 'Du',

  'contact.index': 'Contact',
  'contact.h2': 'Ai nevoie de noi?',
  'contact.kicker': 'Vulcanizarea Force-Car este aici. ',
  'contact.callSr': 'Sună la Force-Car: ',
  'contact.hint': 'Apasă pentru a suna — vulcanizare non-stop',
  'contact.caption': 'Atelier',
  'contact.captionText': ' Montaj și echilibrare roți',
  'contact.location': 'Locație',
  'contact.maps': 'Deschide în Google Maps',
  'contact.whatsapp': 'WhatsApp',
  'contact.whatsappText': 'Trimite un mesaj direct de pe telefon.',
  'contact.whatsappBtn': 'Scrie-ne pe WhatsApp',
  'contact.email': 'Email',
  'contact.emailText': 'Pentru mesaje care nu sunt urgente.',
  'mobile.quick': 'Contact rapid',
  'mobile.call': 'Sună acum',
  'mobile.route': 'Traseu',

  'footer.brand': ' Vulcanizare 24/7 · Service auto',
  'footer.privacy': 'Confidențialitate și cookie-uri',
  'footer.cookies': 'Setări cookie-uri',
  'footer.copy': '© {year} Force-Car',

  'address.street': 'str. Ismail 103',
  'address.city': 'Chișinău',
  'address.country': 'Republica Moldova',
  'address.short': 'str. Ismail 103, Chișinău',
  'address.full': 'str. Ismail 103, Chișinău, Republica Moldova',

  'wa.message':
    'Bună ziua! Vă scriu de pe site-ul Force-Car. Aș dori să mă programez la service.',

  'photo.raft': 'Raft cu anvelope noi pe stoc la Force-Car',
  'photo.weld': 'Sudura unei jante din aliaj la Force-Car',

  'consent.title': 'Cookie-uri',
  'consent.text':
    'Folosim cookie-uri opționale doar dacă ești de acord. Le poți refuza fără să pierzi nimic din site. Detalii în ',
  'consent.policy': 'politica de cookie-uri',
  'consent.customize': 'Personalizează',
  'consent.reject': 'Respinge opționalele',
  'consent.accept': 'Acceptă toate',
  'consent.panelTitle': 'Preferințe cookie-uri',
  'consent.close': 'Închide',
  'consent.intro':
    'Alege ce cookie-uri opționale accepți. Poți reveni oricând din linkul „Setări cookie-uri” din subsolul paginii.',
  'consent.necessary': 'Strict necesare',
  'consent.necessaryText':
    'Păstrează alegerea ta privind cookie-urile. Sunt mereu active, fiindcă fără ele site-ul nu își poate aminti decizia.',
  'consent.always': 'Mereu active',
  'consent.analytics': 'Analiză',
  'consent.analyticsText':
    'Ne arată cum este folosit site-ul (pagini vizitate, durata vizitei), ca să îl putem îmbunătăți.',
  'consent.marketing': 'Marketing',
  'consent.marketingText':
    'Măsoară eficiența reclamelor noastre și pot fi folosite pentru reclame relevante pe alte platforme.',
  'consent.functional': 'Funcționale',
  'consent.functionalText': 'Rețin preferințe care îmbunătățesc experiența pe site.',
  'consent.save': 'Salvează alegerea',

  'privacy.nav': 'Navigare',
  'privacy.crumbHome': 'Acasă',
  'privacy.crumb': 'Confidențialitate',
  'privacy.index': 'Informații legale',
  'privacy.h1': 'Confidențialitate și cookie-uri',
  'privacy.updated': 'Ultima actualizare: ',
  'privacy.whoTitle': 'Cine suntem',
  'privacy.who':
    'Site-ul este al {name}, vulcanizare și service auto din {address}. Pentru orice întrebare despre datele tale ne poți scrie la {email} sau suna la {phone}.',
  'privacy.dataTitle': 'Ce date primim',
  'privacy.dataIntro':
    'Site-ul nu are formulare, conturi sau newsletter, deci nu colectează direct date personale. Primim date doar atunci când alegi tu să ne contactezi:',
  'privacy.dataPhone': 'Telefon — numărul tău apare la noi când ne suni.',
  'privacy.dataWa': 'WhatsApp — numărul și mesajele tale, prin serviciul WhatsApp (Meta).',
  'privacy.dataEmail': 'Email — adresa ta și conținutul mesajului.',
  'privacy.dataKeep':
    'Folosim aceste date doar ca să îți răspundem și să te ajutăm cu mașina, și nu le vindem nimănui. Le păstrăm cât timp sunt necesare pentru a-ți răspunde sau cât cere legea.',
  'privacy.extTitle': 'Linkuri către alte servicii',
  'privacy.ext':
    'Butoanele de traseu deschid Google Maps, iar cele de mesaj deschid WhatsApp. Abia când le apeși, aceste servicii își aplică propriile reguli de confidențialitate:',
  'privacy.extHost':
    'La fel ca orice site, serverul pe care este găzduit poate înregistra automat date tehnice (adresa IP, tipul browserului, ora accesării), pentru securitate și funcționare.',
  'privacy.cookiesTitle': 'Cookie-uri',
  'privacy.cookiesNone':
    'Acest site nu folosește cookie-uri și nu salvează informații în browserul tău. Nu folosim instrumente de analiză, publicitate sau module de rețele sociale; fonturile și imaginile sunt servite direct de pe acest site, fără servicii terțe.',
  'privacy.cookiesLater':
    'Dacă vom adăuga vreodată astfel de instrumente, le vom porni doar după ce îți dai acordul și vom actualiza această pagină.',
  'privacy.rightsTitle': 'Drepturile tale',
  'privacy.rights':
    'Ai dreptul să afli ce date avem despre tine, să ceri corectarea sau ștergerea lor și să te opui folosirii lor. Scrie-ne la {email}.',
  'privacy.rightsAuth':
    'Dacă ești nemulțumit, te poți adresa Centrului Național pentru Protecția Datelor cu Caracter Personal al Republicii Moldova sau, dacă locuiești în Uniunea Europeană, autorității de protecție a datelor din țara ta.',
  'privacy.back': 'Înapoi la pagina principală',

  'notfound.code': '404',
  'notfound.h1': 'Pagina nu există',
  'notfound.text':
    'Linkul poate fi greșit sau pagina a fost mutată. Dacă ai nevoie de vulcanizare, suntem deschiși non-stop.',
  'notfound.home': 'Pagina principală',
  'notfound.homeMeta': 'Servicii, program și contact',
};

const ru: Dict = {
  'meta.title': 'Шиномонтаж 24/7 Кишинёв | Force-Car – Измаил 103',
  'meta.description':
    'Круглосуточный шиномонтаж 24/7 в Кишинёве, ул. Измаил 103: замена шин, балансировка, ремонт проколов и дисков — днём и ночью. Автосервис. Звоните: +373 79 535 005.',
  'meta.ogDescription':
    'Круглосуточный шиномонтаж на ул. Измаил 103, Кишинёв — открыто 24/7. Замена шин, балансировка, проколы и диски. Звоните: +373 79 535 005.',
  'meta.privacyTitle': 'Конфиденциальность и cookie | Force-Car',
  'meta.privacyDescription':
    'Как Force-Car обрабатывает ваши данные: что мы получаем при обращении, какие cookie использует сайт и какие у вас есть права.',
  'meta.404Title': 'Страница не найдена | Force-Car',
  'meta.404Description': 'Запрошенная страница не существует. Force-Car — шиномонтаж 24/7 на ул. Измаил 103, Кишинёв.',

  'skip': 'Перейти к содержимому',
  'brand.home': 'Force-Car — начало страницы',
  'brand.homePage': 'Force-Car — главная страница',
  'status.vulcanizare': 'Шиномонтаж ',
  'nav.sections': 'Разделы',
  'nav.serviciu': 'Услуги',
  'nav.serviceAuto': 'Автосервис',
  'nav.nonStop': 'Non-stop',
  'nav.contact': 'Контакты',
  'nav.callNow': 'Позвонить',
  'nav.whatsapp': 'Написать в WhatsApp',
  'nav.openMenu': 'Открыть меню',
  'nav.closeMenu': 'Закрыть меню',
  'nav.lang': 'Язык',

  'newtab': ' (открывается в новой вкладке)',
  'video.pause': 'Остановить фоновое видео',
  'video.play': 'Включить фоновое видео',
  'repair.pause': 'Остановить анимацию',
  'repair.play': 'Запустить анимацию',

  'hero.h1a': 'Шиномонтаж',
  'hero.h1b': 'Non-stop',
  'hero.status': 'Открыто 24/7 — Non-stop',
  'hero.lead':
    'Прокол или нужна замена шин? В Force-Car на ул. Измаил 103 в Кишинёве шиномонтаж работает днём и ночью.',
  'hero.call': 'Позвонить',
  'hero.route': 'Маршрут',
  'hero.wa': 'или напишите в WhatsApp',
  'hero.spec.hours': 'Режим',
  'hero.spec.hoursValue': 'Шиномонтаж ',
  'hero.spec.address': 'Адрес',
  'hero.spec.phone': 'Телефон',

  'services.index': 'Услуги',
  'services.h2a': 'Ваши колёса.',
  'services.h2b': 'Наш\u00a0',
  'services.h2bAccent': 'приоритет.',
  'services.note': 'Что вы найдёте в мастерской на ул. Измаил 103, Кишинёв.',
  'services.caption.rims': 'Диски',
  'services.caption.rimsText': ' Внимание к каждой детали',
  'services.caption.stock': 'Склад',
  'services.caption.stockText': ' Новые шины в мастерской',
  'services.caption.weld': 'Диски',
  'services.caption.weldText': ' Правка и сварка',
  'services.cta': 'Нужен шиномонтаж? Звоните ',
  'services.ctaEnd': '.',

  'service.tire.title': 'Замена шин',
  'service.tire.text': 'Монтаж и демонтаж шин, замена колёс.',
  'service.balance.title': 'Балансировка колёс',
  'service.balance.text': 'Балансировка колёс на стенде, в мастерской.',
  'service.nitrogen.title': 'Давление азотом',
  'service.nitrogen.text': 'Накачка шин азотом и контроль давления.',
  'service.stock.title': 'Шины на складе',
  'service.stock.text': 'Новые шины доступны прямо в мастерской.',
  'service.puncture.title': 'Ремонт проколов',
  'service.puncture.text':
    'Ремонт проколотых шин, когда их можно безопасно восстановить.',
  'service.rim.title': 'Ремонт дисков',
  'service.rim.text': 'Правка и сварка дисков в мастерской.',

  'repair.eyebrow': 'Шаг за шагом',
  'repair.s1.title': 'Демонтаж шины',
  'repair.s1.text': 'Шина снимается с диска, чтобы проверить и отремонтировать колесо.',
  'repair.s2.title': 'Ремонт диска',
  'repair.s2.text': 'Диск выправляется и сваривается там, где нужно, в мастерской.',
  'repair.s3.title': 'Финальный монтаж',
  'repair.s3.text': 'Шина снова ставится на диск, колесо балансируется на стенде.',
  'repair.step1': ' Демонтаж',
  'repair.step2': ' Ремонт диска',
  'repair.step3': ' Финальный монтаж',

  'auto.index': 'Автосервис',
  'auto.h2a': 'Больше, чем',
  'auto.h2b': 'колёса',
  'auto.lead':
    'Помимо шиномонтажа, у Force-Car есть автосервис — от компьютерной диагностики до ремонта двигателя.',
  'auto.listLabel': 'Работы автосервиса',
  'auto.diag': 'Компьютерная диагностика',
  'auto.electric': 'Автоэлектрика',
  'auto.brakes': 'Тормоза',
  'auto.suspension': 'Подвеска и рулевое',
  'auto.oil': 'Замена масла и фильтров',
  'auto.engine': 'Ремонт двигателя',
  'auto.ctaLabel': 'Сайт автосервиса',
  'auto.ctaSoon': 'Скоро',
  'auto.ctaLive': 'Открыть сайт автосервиса',
  'auto.note': 'Круглосуточный режим 24/7 действует только для шиномонтажа.',

  'hours.index': 'Режим работы',
  'hours.h2a': 'Нет',
  'hours.h2b': 'неудобного часа.',
  'hours.24_7': '24 часа в сутки, 7 дней в неделю',
  'hours.openNow': 'Открыто сейчас',
  'hours.fact.service': 'Услуга',
  'hours.fact.serviceValue': 'Шиномонтаж non-stop.',
  'hours.fact.hours': 'Режим',
  'hours.fact.hoursValue': 'День, ночь и выходные.',
  'hours.fact.address': 'Адрес',
  'hours.weekLabel': 'Режим по дням: шиномонтаж открыт 00:00–24:00 каждый день',
  'day.1': 'Понедельник',
  'day.1s': 'Пн',
  'day.2': 'Вторник',
  'day.2s': 'Вт',
  'day.3': 'Среда',
  'day.3s': 'Ср',
  'day.4': 'Четверг',
  'day.4s': 'Чт',
  'day.5': 'Пятница',
  'day.5s': 'Пт',
  'day.6': 'Суббота',
  'day.6s': 'Сб',
  'day.7': 'Воскресенье',
  'day.7s': 'Вс',

  'contact.index': 'Контакты',
  'contact.h2': 'Нужна наша помощь?',
  'contact.kicker': 'Шиномонтаж Force-Car рядом. ',
  'contact.callSr': 'Позвонить в Force-Car: ',
  'contact.hint': 'Нажмите, чтобы позвонить — шиномонтаж non-stop',
  'contact.caption': 'Мастерская',
  'contact.captionText': ' Монтаж и балансировка колёс',
  'contact.location': 'Адрес',
  'contact.maps': 'Открыть в Google Maps',
  'contact.whatsapp': 'WhatsApp',
  'contact.whatsappText': 'Напишите сообщение прямо с телефона.',
  'contact.whatsappBtn': 'Написать в WhatsApp',
  'contact.email': 'Email',
  'contact.emailText': 'Для сообщений, которые не срочные.',
  'mobile.quick': 'Быстрый контакт',
  'mobile.call': 'Позвонить',
  'mobile.route': 'Маршрут',

  'footer.brand': ' Шиномонтаж 24/7 · Автосервис',
  'footer.privacy': 'Конфиденциальность и cookie',
  'footer.cookies': 'Настройки cookie',
  'footer.copy': '© {year} Force-Car',

  'address.street': 'ул. Измаил 103',
  'address.city': 'Кишинёв',
  'address.country': 'Республика Молдова',
  'address.short': 'ул. Измаил 103, Кишинёв',
  'address.full': 'ул. Измаил 103, Кишинёв, Республика Молдова',

  'wa.message':
    'Здравствуйте! Пишу с сайта Force-Car. Хотел(а) бы записаться на сервис.',

  'photo.raft': 'Стеллаж с новыми шинами на складе Force-Car',
  'photo.weld': 'Сварка легкосплавного диска в Force-Car',

  'consent.title': 'Cookie',
  'consent.text':
    'Мы используем необязательные cookie только с вашего согласия. Вы можете отказаться без потери функций сайта. Подробности в ',
  'consent.policy': 'политике cookie',
  'consent.customize': 'Настроить',
  'consent.reject': 'Отклонить необязательные',
  'consent.accept': 'Принять все',
  'consent.panelTitle': 'Настройки cookie',
  'consent.close': 'Закрыть',
  'consent.intro':
    'Выберите необязательные cookie. Вы можете изменить выбор в любой момент по ссылке «Настройки cookie» в подвале сайта.',
  'consent.necessary': 'Строго необходимые',
  'consent.necessaryText':
    'Сохраняют ваш выбор по cookie. Всегда включены, иначе сайт не сможет запомнить решение.',
  'consent.always': 'Всегда активны',
  'consent.analytics': 'Аналитика',
  'consent.analyticsText':
    'Показывают, как используется сайт (страницы, длительность визита), чтобы мы могли его улучшать.',
  'consent.marketing': 'Маркетинг',
  'consent.marketingText':
    'Измеряют эффективность рекламы и могут использоваться для релевантной рекламы на других платформах.',
  'consent.functional': 'Функциональные',
  'consent.functionalText': 'Сохраняют настройки, которые улучшают работу сайта.',
  'consent.save': 'Сохранить выбор',

  'privacy.nav': 'Навигация',
  'privacy.crumbHome': 'Главная',
  'privacy.crumb': 'Конфиденциальность',
  'privacy.index': 'Правовая информация',
  'privacy.h1': 'Конфиденциальность и cookie',
  'privacy.updated': 'Последнее обновление: ',
  'privacy.whoTitle': 'Кто мы',
  'privacy.who':
    'Сайт принадлежит {name}, шиномонтажу и автосервису по адресу {address}. По вопросам о ваших данных пишите на {email} или звоните {phone}.',
  'privacy.dataTitle': 'Какие данные мы получаем',
  'privacy.dataIntro':
    'На сайте нет форм, аккаунтов и рассылки, поэтому мы не собираем персональные данные напрямую. Данные появляются только когда вы сами связываетесь с нами:',
  'privacy.dataPhone': 'Телефон — ваш номер виден нам, когда вы звоните.',
  'privacy.dataWa': 'WhatsApp — ваш номер и сообщения через сервис WhatsApp (Meta).',
  'privacy.dataEmail': 'Email — ваш адрес и содержание письма.',
  'privacy.dataKeep':
    'Мы используем эти данные только чтобы ответить и помочь с автомобилем и никому их не продаём. Храним столько, сколько нужно для ответа или сколько требует закон.',
  'privacy.extTitle': 'Ссылки на другие сервисы',
  'privacy.ext':
    'Кнопки маршрута открывают Google Maps, а кнопки сообщений — WhatsApp. Только после нажатия эти сервисы применяют свои правила конфиденциальности:',
  'privacy.extHost':
    'Как и на любом сайте, сервер хостинга может автоматически записывать технические данные (IP-адрес, тип браузера, время доступа) для безопасности и работы.',
  'privacy.cookiesTitle': 'Cookie',
  'privacy.cookiesNone':
    'Этот сайт не использует cookie и не сохраняет данные в вашем браузере. Мы не используем аналитику, рекламу или модули соцсетей; шрифты и изображения отдаются прямо с этого сайта, без сторонних сервисов.',
  'privacy.cookiesLater':
    'Если мы когда-нибудь добавим такие инструменты, они включатся только после вашего согласия, и мы обновим эту страницу.',
  'privacy.rightsTitle': 'Ваши права',
  'privacy.rights':
    'Вы можете узнать, какие данные у нас есть, попросить исправить или удалить их и возразить против их использования. Пишите на {email}.',
  'privacy.rightsAuth':
    'Если вы недовольны, можете обратиться в Национальный центр по защите персональных данных Республики Молдова или, если вы живёте в Евросоюзе, в орган по защите данных вашей страны.',
  'privacy.back': 'Назад на главную',

  'notfound.code': '404',
  'notfound.h1': 'Страница не существует',
  'notfound.text':
    'Ссылка может быть неверной или страница перенесена. Если нужен шиномонтаж — мы открыты non-stop.',
  'notfound.home': 'Главная страница',
  'notfound.homeMeta': 'Услуги, режим работы и контакты',
};

const en: Dict = {
  'meta.title': '24/7 Tire Service Chișinău | Force-Car – Ismail 103',
  'meta.description':
    '24/7 tire service in Chișinău, Ismail 103 St: tire changes, wheel balancing, puncture and rim repair — day and night. Auto repair. Call: +373 79 535 005.',
  'meta.ogDescription':
    '24/7 tire service at Ismail 103 St, Chișinău. Tire changes, balancing, punctures and rims. Call: +373 79 535 005.',
  'meta.privacyTitle': 'Privacy and cookies | Force-Car',
  'meta.privacyDescription':
    'How Force-Car handles your data: what we receive when you contact us, which cookies the site uses, and your rights.',
  'meta.404Title': 'Page not found | Force-Car',
  'meta.404Description': 'The page you requested does not exist. Force-Car — 24/7 tire service at Ismail 103 St, Chișinău.',

  'skip': 'Skip to content',
  'brand.home': 'Force-Car — top of page',
  'brand.homePage': 'Force-Car — home page',
  'status.vulcanizare': 'Tire service ',
  'nav.sections': 'Sections',
  'nav.serviciu': 'Services',
  'nav.serviceAuto': 'Auto repair',
  'nav.nonStop': 'Non-stop',
  'nav.contact': 'Contact',
  'nav.callNow': 'Call now',
  'nav.whatsapp': 'Message us on WhatsApp',
  'nav.openMenu': 'Open menu',
  'nav.closeMenu': 'Close menu',
  'nav.lang': 'Language',

  'newtab': ' (opens in a new tab)',
  'video.pause': 'Pause background video',
  'video.play': 'Play background video',
  'repair.pause': 'Pause animation',
  'repair.play': 'Play animation',

  'hero.h1a': 'Tire service',
  'hero.h1b': 'Non-stop',
  'hero.status': 'Open 24/7 — Non-stop',
  'hero.lead':
    'Flat tire or need a tire change? At Force-Car on Ismail 103 St in Chișinău, tire service is available day and night.',
  'hero.call': 'Call now',
  'hero.route': 'Get directions',
  'hero.wa': 'or message us on WhatsApp',
  'hero.spec.hours': 'Hours',
  'hero.spec.hoursValue': 'Tire service ',
  'hero.spec.address': 'Address',
  'hero.spec.phone': 'Phone',

  'services.index': 'Services',
  'services.h2a': 'Your wheels.',
  'services.h2b': 'Our\u00a0',
  'services.h2bAccent': 'priority.',
  'services.note': 'What you will find at the workshop on Ismail 103 St, Chișinău.',
  'services.caption.rims': 'Rims',
  'services.caption.rimsText': ' Care in every detail',
  'services.caption.stock': 'Stock',
  'services.caption.stockText': ' New tires at the workshop',
  'services.caption.weld': 'Rims',
  'services.caption.weldText': ' Straightening and welding',
  'services.cta': 'Need tire service? Call ',
  'services.ctaEnd': '.',

  'service.tire.title': 'Tire change',
  'service.tire.text': 'Mounting and demounting tires, swapping wheels.',
  'service.balance.title': 'Wheel balancing',
  'service.balance.text': 'Wheel balancing on the machine, in the workshop.',
  'service.nitrogen.title': 'Nitrogen pressure',
  'service.nitrogen.text': 'Inflating tires with nitrogen and checking pressure.',
  'service.stock.title': 'Tires in stock',
  'service.stock.text': 'New tires available directly at the workshop.',
  'service.puncture.title': 'Puncture repair',
  'service.puncture.text':
    'Repairs for punctured tires when they can be fixed safely.',
  'service.rim.title': 'Rim repair',
  'service.rim.text': 'Rim straightening and welding in the workshop.',

  'repair.eyebrow': 'Step by step',
  'repair.s1.title': 'Tire removal',
  'repair.s1.text': 'The tire is taken off the rim so the wheel can be inspected and repaired.',
  'repair.s2.title': 'Rim repair',
  'repair.s2.text': 'The rim is straightened and welded where needed, in the workshop.',
  'repair.s3.title': 'Final mounting',
  'repair.s3.text': 'The tire goes back on the rim, and the wheel is balanced on the machine.',
  'repair.step1': ' Removal',
  'repair.step2': ' Rim repair',
  'repair.step3': ' Final mounting',

  'auto.index': 'Auto repair',
  'auto.h2a': 'More than',
  'auto.h2b': 'wheels',
  'auto.lead':
    'Besides tire service, Force-Car also offers auto repair — from computer diagnostics to engine work.',
  'auto.listLabel': 'Auto repair work',
  'auto.diag': 'Computer diagnostics',
  'auto.electric': 'Auto electrics',
  'auto.brakes': 'Brakes',
  'auto.suspension': 'Suspension and steering',
  'auto.oil': 'Oil and filter change',
  'auto.engine': 'Engine repairs',
  'auto.ctaLabel': 'Auto repair website',
  'auto.ctaSoon': 'Coming soon',
  'auto.ctaLive': 'Visit the auto repair site',
  'auto.note': 'The 24/7 non-stop schedule applies only to tire service.',

  'hours.index': 'Hours',
  'hours.h2a': 'There is no',
  'hours.h2b': 'wrong hour.',
  'hours.24_7': '24 hours a day, 7 days a week',
  'hours.openNow': 'Open now',
  'hours.fact.service': 'Service',
  'hours.fact.serviceValue': 'Non-stop tire service.',
  'hours.fact.hours': 'Hours',
  'hours.fact.hoursValue': 'Day, night and weekends.',
  'hours.fact.address': 'Address',
  'hours.weekLabel': 'Daily hours: tire service open 00:00–24:00 every day',
  'day.1': 'Monday',
  'day.1s': 'Mo',
  'day.2': 'Tuesday',
  'day.2s': 'Tu',
  'day.3': 'Wednesday',
  'day.3s': 'We',
  'day.4': 'Thursday',
  'day.4s': 'Th',
  'day.5': 'Friday',
  'day.5s': 'Fr',
  'day.6': 'Saturday',
  'day.6s': 'Sa',
  'day.7': 'Sunday',
  'day.7s': 'Su',

  'contact.index': 'Contact',
  'contact.h2': 'Need us?',
  'contact.kicker': 'Force-Car tire service is here. ',
  'contact.callSr': 'Call Force-Car: ',
  'contact.hint': 'Tap to call — non-stop tire service',
  'contact.caption': 'Workshop',
  'contact.captionText': ' Mounting and wheel balancing',
  'contact.location': 'Location',
  'contact.maps': 'Open in Google Maps',
  'contact.whatsapp': 'WhatsApp',
  'contact.whatsappText': 'Send a message straight from your phone.',
  'contact.whatsappBtn': 'Message us on WhatsApp',
  'contact.email': 'Email',
  'contact.emailText': 'For messages that are not urgent.',
  'mobile.quick': 'Quick contact',
  'mobile.call': 'Call now',
  'mobile.route': 'Directions',

  'footer.brand': ' 24/7 tire service · Auto repair',
  'footer.privacy': 'Privacy and cookies',
  'footer.cookies': 'Cookie settings',
  'footer.copy': '© {year} Force-Car',

  'address.street': 'Ismail 103 St',
  'address.city': 'Chișinău',
  'address.country': 'Republic of Moldova',
  'address.short': 'Ismail 103 St, Chișinău',
  'address.full': 'Ismail 103 St, Chișinău, Republic of Moldova',

  'wa.message':
    'Hello! I am writing from the Force-Car website. I would like to book a service appointment.',

  'photo.raft': 'Rack of new tires in stock at Force-Car',
  'photo.weld': 'Welding an alloy rim at Force-Car',

  'consent.title': 'Cookies',
  'consent.text':
    'We use optional cookies only if you agree. You can refuse them without losing anything on the site. Details in the ',
  'consent.policy': 'cookie policy',
  'consent.customize': 'Customize',
  'consent.reject': 'Reject optional',
  'consent.accept': 'Accept all',
  'consent.panelTitle': 'Cookie preferences',
  'consent.close': 'Close',
  'consent.intro':
    'Choose which optional cookies you accept. You can change this anytime from the “Cookie settings” link in the footer.',
  'consent.necessary': 'Strictly necessary',
  'consent.necessaryText':
    'Remember your cookie choice. Always on, because without them the site cannot store your decision.',
  'consent.always': 'Always active',
  'consent.analytics': 'Analytics',
  'consent.analyticsText':
    'Show how the site is used (pages visited, visit length) so we can improve it.',
  'consent.marketing': 'Marketing',
  'consent.marketingText':
    'Measure our ads and may be used for relevant ads on other platforms.',
  'consent.functional': 'Functional',
  'consent.functionalText': 'Remember preferences that improve your experience on the site.',
  'consent.save': 'Save choice',

  'privacy.nav': 'Navigation',
  'privacy.crumbHome': 'Home',
  'privacy.crumb': 'Privacy',
  'privacy.index': 'Legal information',
  'privacy.h1': 'Privacy and cookies',
  'privacy.updated': 'Last updated: ',
  'privacy.whoTitle': 'Who we are',
  'privacy.who':
    'This site belongs to {name}, a tire service and auto repair shop at {address}. For any question about your data, email {email} or call {phone}.',
  'privacy.dataTitle': 'What data we receive',
  'privacy.dataIntro':
    'The site has no forms, accounts or newsletter, so it does not collect personal data directly. We receive data only when you choose to contact us:',
  'privacy.dataPhone': 'Phone — your number appears to us when you call.',
  'privacy.dataWa': 'WhatsApp — your number and messages, through WhatsApp (Meta).',
  'privacy.dataEmail': 'Email — your address and the message content.',
  'privacy.dataKeep':
    'We use this data only to reply and help with your car, and we do not sell it. We keep it as long as needed to reply or as required by law.',
  'privacy.extTitle': 'Links to other services',
  'privacy.ext':
    'Directions buttons open Google Maps, and message buttons open WhatsApp. Only when you tap them do those services apply their own privacy rules:',
  'privacy.extHost':
    'As with any site, the hosting server may automatically log technical data (IP address, browser type, access time) for security and operation.',
  'privacy.cookiesTitle': 'Cookies',
  'privacy.cookiesNone':
    'This site does not use cookies and does not store information in your browser. We do not use analytics, advertising or social plugins; fonts and images are served directly from this site, without third-party services.',
  'privacy.cookiesLater':
    'If we ever add such tools, we will turn them on only after you agree and we will update this page.',
  'privacy.rightsTitle': 'Your rights',
  'privacy.rights':
    'You have the right to know what data we hold about you, to ask for correction or deletion, and to object to its use. Write to us at {email}.',
  'privacy.rightsAuth':
    'If you are not satisfied, you can contact the National Center for Personal Data Protection of the Republic of Moldova or, if you live in the European Union, your national data protection authority.',
  'privacy.back': 'Back to the home page',

  'notfound.code': '404',
  'notfound.h1': 'Page not found',
  'notfound.text':
    'The link may be wrong or the page was moved. If you need tire service, we are open non-stop.',
  'notfound.home': 'Home page',
  'notfound.homeMeta': 'Services, hours and contact',
};

export const messages: Record<Locale, Dict> = { ro, ru, en };

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'ro' || value === 'ru' || value === 'en';
}

export function t(locale: Locale, key: string, vars?: Record<string, string>): string {
  const template = messages[locale][key] ?? messages.ro[key] ?? key;
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => vars[name] ?? '');
}
