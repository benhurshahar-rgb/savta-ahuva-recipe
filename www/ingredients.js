/* Small hand-drawn ingredient pictures + Hebrew keyword matching */
(function () {
'use strict';
var S = 'stroke="#5B3A1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
function bottle(fill, cap) {
  return '<path d="M13 3h6v4l2 3v17a2 2 0 01-2 2h-6a2 2 0 01-2-2V10l2-3z" fill="' + fill + '" ' + S + '/><rect x="13" y="2" width="6" height="3" rx="1" fill="' + (cap || '#B8893F') + '" ' + S + '/><path d="M11 15h10v8H11z" fill="#FBF4E4" opacity=".7"/>';
}
function jar(fill, lid) {
  return '<rect x="9" y="5" width="14" height="4" rx="1.2" fill="' + (lid || '#B8893F') + '" ' + S + '/><path d="M10 9h12v17a3 3 0 01-3 3h-6a3 3 0 01-3-3z" fill="' + fill + '" ' + S + '/><path d="M12 15h8v6h-8z" fill="#FBF4E4" opacity=".75"/>';
}
var I = {
  oil: bottle('#E8C15A'), oliveoil: bottle('#B5B24A', '#6E7F4E'),
  sauce: bottle('#C7543A', '#5B3A1E'), vinegar: bottle('#E9DFC4', '#9A4F24'), soy: bottle('#5A3A22', '#C7543A'),
  salt: '<path d="M11 13h10l1 15a1 1 0 01-1 1H11a1 1 0 01-1-1z" fill="#F7F3EA" ' + S + '/><path d="M11 13c0-5 2-8 5-8s5 3 5 8z" fill="#C9CBC9" ' + S + '/><circle cx="14.5" cy="9.5" r=".7" fill="#5B3A1E"/><circle cx="17.5" cy="9.5" r=".7" fill="#5B3A1E"/><circle cx="16" cy="7.5" r=".7" fill="#5B3A1E"/>',
  pepper: '<path d="M12 12h8l1 16a1 1 0 01-1 1h-8a1 1 0 01-1-1z" fill="#6B4B33" ' + S + '/><path d="M13 12c-1-3 0-6 3-6s4 3 3 6" fill="#8A6A4F" ' + S + '/><path d="M16 6V3" ' + S + '/><circle cx="16" cy="3" r="1.3" fill="#5B3A1E"/>',
  water: '<path d="M8 6h16l-2 21a2 2 0 01-2 2h-8a2 2 0 01-2-2z" fill="#F4F8FA" ' + S + '/><path d="M9.2 13h13.6l-1.2 14a2 2 0 01-2 1.6h-7.2a2 2 0 01-2-1.6z" fill="#A9C9D6"/><path d="M8 6h16l-2 21a2 2 0 01-2 2h-8a2 2 0 01-2-2z" fill="none" ' + S + '/>',
  onion: '<path d="M16 7c-6 4-10 8-10 13a10 9 0 0020 0c0-5-4-9-10-13z" fill="#E3B98A" ' + S + '/><path d="M16 7c-3 5-4 10-3 20M16 7c3 5 4 10 3 20" fill="none" ' + S + ' opacity=".6"/><path d="M16 7c-1-2-1-3 0-5M16 7c1-2 2-3 3-4" fill="none" stroke="#6E7F4E" stroke-width="1.5" stroke-linecap="round"/><path d="M13 29h6" ' + S + '/>',
  garlic: '<path d="M16 4c-1 3-2 4-5 6-4 3-5 7-4 11 1 5 5 7 9 7s8-2 9-7c1-4 0-8-4-11-3-2-4-3-5-6z" fill="#F6F0E4" ' + S + '/><path d="M16 10c-3 4-3 12 0 18M16 10c3 4 3 12 0 18M11 14c-2 4-1 9 2 13M21 14c2 4 1 9-2 13" fill="none" ' + S + ' opacity=".55"/>',
  tomato: '<circle cx="16" cy="18" r="10" fill="#D9543F" ' + S + '/><path d="M16 9l-2-3M16 9l3-2M16 9l-4 1M16 9l4 1M16 9V5" stroke="#6E7F4E" stroke-width="1.7" stroke-linecap="round"/><path d="M10 16a6 6 0 013-4" stroke="#FBF4E4" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>',
  bell: '<path d="M16 9c-4-2-9 0-9 6 0 5 2 11 5 13 2 1 3 0 4-1 1 1 2 2 4 1 3-2 5-8 5-13 0-6-5-8-9-6z" fill="#D9543F" ' + S + '/><path d="M16 9V5l3-2" fill="none" stroke="#6E7F4E" stroke-width="1.8" stroke-linecap="round"/><path d="M16 10v16" ' + S + ' opacity=".4"/>',
  hot: '<path d="M8 8c2 0 3 1 3 3 0 7 5 14 15 17-9 2-18-5-19-15 0-2 0-5 1-5z" fill="#C8402E" ' + S + '/><path d="M8 8c-1-2 0-4 2-5" fill="none" stroke="#6E7F4E" stroke-width="1.8" stroke-linecap="round"/>',
  potato: '<path d="M6 17c0-6 5-10 11-10 6 0 9 4 9 9 0 6-5 10-11 10-6 0-9-4-9-9z" fill="#C89B67" ' + S + '/><circle cx="12" cy="14" r=".9" fill="#5B3A1E"/><circle cx="19" cy="12" r=".9" fill="#5B3A1E"/><circle cx="20" cy="20" r=".9" fill="#5B3A1E"/><circle cx="13" cy="21" r=".9" fill="#5B3A1E"/>',
  carrot: '<path d="M20 10l-14 18c-1 1 0 2 1 1L24 15c1-2 0-5-4-5z" fill="#E8853A" ' + S + '/><path d="M21 10c0-3 1-5 3-7M22 12c2-2 5-3 7-2M21 10c-1-2-1-4 0-6" fill="none" stroke="#6E7F4E" stroke-width="1.6" stroke-linecap="round"/><path d="M13 18l2 2M10 22l2 1" ' + S + ' opacity=".6"/>',
  egg: '<path d="M16 4c-5 0-9 8-9 14a9 9 0 0018 0c0-6-4-14-9-14z" fill="#F5E9D2" ' + S + '/><path d="M12 13a4 5 0 012-4" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/>',
  flour: '<path d="M9 9h14l2 19H7z" fill="#F2EADA" ' + S + '/><path d="M9 9c1-2 3-3 7-3s6 1 7 3" fill="#E5D6B8" ' + S + '/><path d="M12 17h8M12 21h8" ' + S + ' opacity=".5"/><circle cx="16" cy="4" r="1.6" fill="#FFFFFF" ' + S + '/>',
  sugar: '<path d="M5 15l7-3 7 3-7 3z" fill="#FFFFFF" ' + S + '/><path d="M5 15v8l7 3v-8z" fill="#EFE8DC" ' + S + '/><path d="M19 15v8l-7 3v-8z" fill="#E2D9C9" ' + S + '/><path d="M15 9l6-3 6 3-6 3z" fill="#FFFFFF" ' + S + '/><path d="M15 9v6l6 3V12z" fill="#EFE8DC" ' + S + '/><path d="M27 9v6l-6 3V12z" fill="#E2D9C9" ' + S + '/>',
  lemon: '<path d="M5 16c0-5 5-9 11-9s11 4 11 9-5 9-11 9S5 21 5 16z" fill="#F2D24B" ' + S + '/><path d="M5 16l-2 0M27 16h2" ' + S + '/><path d="M10 13a6 4 0 015-3" stroke="#FFF7C9" stroke-width="1.6" stroke-linecap="round"/>',
  orange: '<circle cx="16" cy="18" r="10" fill="#EE9A3A" ' + S + '/><path d="M16 8c1-3 4-4 6-4-1 3-3 4-6 4z" fill="#6E7F4E" ' + S + '/><circle cx="12" cy="16" r=".6" fill="#B56A1E"/><circle cx="19" cy="21" r=".6" fill="#B56A1E"/><circle cx="14" cy="23" r=".6" fill="#B56A1E"/>',
  apple: '<path d="M16 10c-3-2-10-2-10 6 0 7 4 12 7 12 1 0 2-1 3-1s2 1 3 1c3 0 7-5 7-12 0-8-7-8-10-6z" fill="#D9543F" ' + S + '/><path d="M16 10c0-3 1-5 2-6" fill="none" ' + S + '/><path d="M17 7c2-2 5-2 6-1-2 2-4 2-6 1z" fill="#6E7F4E" ' + S + '/>',
  eggplant: '<path d="M22 8c4 3 4 9 0 14-4 5-11 7-14 4s-1-9 4-13c3-3 6-7 10-5z" fill="#6B3D72" ' + S + '/><path d="M20 7c2-1 4 0 5 2 1 1 0 2-1 2" fill="#6E7F4E" ' + S + '/><path d="M24 7l2-3" stroke="#6E7F4E" stroke-width="1.8" stroke-linecap="round"/><path d="M11 20a5 5 0 014-5" stroke="#B38BBA" stroke-width="1.5" stroke-linecap="round"/>',
  zucchini: '<path d="M6 24c-1-1 0-3 2-4l13-12c2-2 5-1 5 1 0 1 0 2-1 3L12 25c-2 2-5 1-6-1z" fill="#7E9A4E" ' + S + '/><path d="M9 22l12-11" stroke="#C7D59C" stroke-width="1.3" stroke-linecap="round"/><path d="M25 9l2-2" ' + S + '/>',
  rice: '<path d="M5 16h22a11 10 0 01-22 0z" fill="#E7CF93" ' + S + '/><path d="M8 16c1-4 4-6 8-6s7 2 8 6" fill="#FFFFFF" ' + S + '/><path d="M11 13l1 1M15 12l1 1M19 13l1 1M13 15l1 1M18 15l1 1" stroke="#C8B58A" stroke-width="1.4" stroke-linecap="round"/>',
  legume: '<path d="M5 16h22a11 10 0 01-22 0z" fill="#E7CF93" ' + S + '/><circle cx="11" cy="14" r="2.2" fill="#D9B26E" ' + S + '/><circle cx="16" cy="12.5" r="2.2" fill="#C89B67" ' + S + '/><circle cx="21" cy="14" r="2.2" fill="#D9B26E" ' + S + '/><circle cx="13.5" cy="16" r="1.8" fill="#B5824F" ' + S + '/><circle cx="18.5" cy="16" r="1.8" fill="#D9B26E" ' + S + '/>',
  meat: '<path d="M6 14c0-5 5-8 11-8 6 0 10 4 10 9 0 6-5 10-12 10-5 0-9-5-9-11z" fill="#C9574A" ' + S + '/><path d="M9 13c2-3 6-5 10-4" stroke="#F3D9C9" stroke-width="2" stroke-linecap="round"/><circle cx="19" cy="17" r="3" fill="#F3D9C9" ' + S + '/>',
  chicken: '<path d="M19 4c5 0 9 4 9 9 0 4-3 7-7 7-2 0-3 1-4 2l-5 5c1 2 0 4-2 4-1 0-2-1-2-2-1 0-2-1-2-2 0-2 2-3 4-2l5-5c1-1 2-2 2-4-1-4 2-12 2-12z" fill="#E1A45C" ' + S + '/><path d="M10 25l-1 1" ' + S + '/>',
  fish: '<path d="M4 16c4-6 10-8 15-6 3 1 5 3 6 6-1 3-3 5-6 6-5 2-11 0-15-6z" fill="#A9C9D6" ' + S + '/><path d="M25 16l4-5v10z" fill="#A9C9D6" ' + S + '/><circle cx="9" cy="15" r="1.1" fill="#5B3A1E"/><path d="M15 12c1 2 1 6 0 8" ' + S + ' opacity=".6"/>',
  cheese: '<path d="M4 20l20-11 4 4v12H4z" fill="#F2CF6B" ' + S + '/><path d="M4 20h24" ' + S + '/><circle cx="12" cy="24" r="1.6" fill="#D9AE45"/><circle cx="20" cy="23" r="1.2" fill="#D9AE45"/><circle cx="22" cy="16" r="1.2" fill="#D9AE45"/>',
  milk: '<path d="M10 11l3-5h6l3 5v17H10z" fill="#FFFFFF" ' + S + '/><path d="M13 6V3h6v3" fill="#A9C9D6" ' + S + '/><path d="M10 15h12v8H10z" fill="#A9C9D6" opacity=".8"/><path d="M10 11h12" ' + S + '/>',
  cream: '<path d="M8 10h16l-2 18H10z" fill="#FFFFFF" ' + S + '/><path d="M7 7h18v3H7z" fill="#E5D0A8" ' + S + '/><path d="M10 15h12" ' + S + ' opacity=".4"/>',
  butter: '<path d="M4 18l8-6h16l-8 6z" fill="#FFF0A8" ' + S + '/><path d="M4 18h16v7H4z" fill="#F7DD72" ' + S + '/><path d="M20 18l8-6v7l-8 6z" fill="#EDCD58" ' + S + '/>',
  spice: function (c) { return jar(c, '#5B3A1E'); },
  herb: '<path d="M16 29V13" stroke="#6E7F4E" stroke-width="1.6" stroke-linecap="round"/><path d="M16 14c-4 0-7-3-7-7 4 0 7 3 7 7zM16 14c4 0 7-3 7-7-4 0-7 3-7 7zM16 21c-4 0-7-3-7-6 4 0 7 2 7 6zM16 21c4 0 7-3 7-6-4 0-7 2-7 6zM16 9c-1-2-1-4 0-6 1 2 1 4 0 6z" fill="#8FAE5A" ' + S + '/>',
  leaf: '<path d="M6 26C6 14 13 6 27 5c0 13-8 21-21 21z" fill="#8FAE5A" ' + S + '/><path d="M6 26L20 12M12 20h5M15 16v-4" ' + S + ' opacity=".6"/>',
  tahini: jar('#D9B98A'), honey: jar('#E3A63A'), jam: jar('#B8403A'), mayo: jar('#FBF4E4', '#C7543A'),
  can: '<path d="M8 8h16v18H8z" fill="#D9543F" ' + S + '/><ellipse cx="16" cy="8" rx="8" ry="2.5" fill="#E9E1D2" ' + S + '/><path d="M8 26a8 2.5 0 0016 0" fill="none" ' + S + '/><path d="M8 13h16v8H8z" fill="#FBF4E4" opacity=".75"/>',
  choc: '<rect x="6" y="5" width="20" height="23" rx="1.5" fill="#6B4430" ' + S + '/><path d="M6 11h20M6 17h20M6 23h20M13 5v23M19 5v23" stroke="#8C5E44" stroke-width="1.3"/>',
  nut: '<path d="M16 5c-6 0-9 6-9 11s4 11 9 11 9-6 9-11-3-11-9-11z" fill="#C8955C" ' + S + '/><path d="M16 5c-2 6-2 16 0 22" ' + S + ' opacity=".6"/><path d="M10 12c2 1 4 1 6 0M10 19c2 1 4 1 6 0" ' + S + ' opacity=".4"/>',
  packet: '<path d="M8 6h16v21H8z" fill="#F0E4C8" ' + S + '/><path d="M8 6l2-2h12l2 2" fill="none" ' + S + '/><path d="M11 12h10M11 16h10M11 20h6" ' + S + ' opacity=".55"/>',
  cabbage: '<circle cx="16" cy="17" r="11" fill="#A9C27A" ' + S + '/><path d="M16 6c-4 4-5 12-2 22M16 6c4 4 5 12 2 22M7 13c4 1 7 4 8 9M25 13c-4 1-7 4-8 9" fill="none" ' + S + ' opacity=".55"/>',
  cauli: '<path d="M7 18c-3 0-3-5 0-5-1-4 4-6 6-3 1-4 7-4 8 0 3-2 7 1 5 4 3 1 2 5-1 5z" fill="#F5EFDF" ' + S + '/><path d="M8 18c2 6 6 9 8 9s6-3 8-9" fill="#8FAE5A" ' + S + '/>',
  mushroom: '<path d="M4 16C4 10 9 5 16 5s12 5 12 11z" fill="#C89B67" ' + S + '/><path d="M12 16h8l1 10a2 2 0 01-2 2h-6a2 2 0 01-2-2z" fill="#F3E6CA" ' + S + '/><circle cx="11" cy="11" r="1.4" fill="#F3E6CA"/><circle cx="19" cy="9" r="1.2" fill="#F3E6CA"/>',
  beet: '<path d="M16 10c-6 0-9 5-9 9 0 5 4 7 9 7s9-2 9-7c0-4-3-9-9-9z" fill="#9B2C4A" ' + S + '/><path d="M16 26l1 4" ' + S + '/><path d="M16 10c-1-3-4-5-6-6M16 10c0-3 1-6 3-7M16 10c2-2 5-3 7-2" fill="none" stroke="#6E7F4E" stroke-width="1.6" stroke-linecap="round"/>',
  cucumber: '<path d="M5 22c-1-2 1-4 3-5l14-9c3-2 6 0 5 3 0 1-1 2-2 3L11 25c-2 2-5 0-6-3z" fill="#5E8A3F" ' + S + '/><circle cx="12" cy="19" r=".7" fill="#C7D59C"/><circle cx="17" cy="15" r=".7" fill="#C7D59C"/><circle cx="21" cy="12" r=".7" fill="#C7D59C"/>',
  pasta: '<path d="M6 10c4-3 8-3 10 0s6 3 10 0M6 16c4-3 8-3 10 0s6 3 10 0M6 22c4-3 8-3 10 0s6 3 10 0" fill="none" stroke="#D9B26E" stroke-width="3" stroke-linecap="round"/><path d="M6 10c4-3 8-3 10 0s6 3 10 0M6 16c4-3 8-3 10 0s6 3 10 0M6 22c4-3 8-3 10 0s6 3 10 0" fill="none" stroke="#5B3A1E" stroke-width=".8" stroke-linecap="round" opacity=".5"/>',
  bread: '<path d="M5 16c0-5 5-8 11-8s11 3 11 8c0 2-1 3-2 3v7H7v-7c-1 0-2-1-2-3z" fill="#D9A25E" ' + S + '/><path d="M11 12l2 3M16 11l2 3M21 12l2 3" ' + S + ' opacity=".6"/>',
  matzah: '<rect x="5" y="6" width="22" height="20" rx="1" fill="#E9CF96" ' + S + '/><path d="M9 6v20M13 6v20M17 6v20M21 6v20" stroke="#C9A86A" stroke-width="1" stroke-dasharray="1 2"/>',
  cookie: '<circle cx="16" cy="16" r="11" fill="#D9A25E" ' + S + '/><circle cx="12" cy="13" r="1.5" fill="#6B4430"/><circle cx="19" cy="12" r="1.3" fill="#6B4430"/><circle cx="18" cy="19" r="1.5" fill="#6B4430"/><circle cx="12" cy="20" r="1.2" fill="#6B4430"/>',
  grain: '<path d="M16 29V8" ' + S + '/><path d="M16 9c-3-1-4-3-4-6 3 1 4 3 4 6zM16 9c3-1 4-3 4-6-3 1-4 3-4 6zM16 15c-3-1-5-3-5-6 3 1 5 3 5 6zM16 15c3-1 5-3 5-6-3 1-5 3-5 6zM16 21c-3-1-5-3-5-6 3 1 5 3 5 6zM16 21c3-1 5-3 5-6-3 1-5 3-5 6z" fill="#E1B95E" ' + S + '/>',
  corn: '<path d="M16 4c-4 0-6 6-6 12s2 11 6 11 6-5 6-11-2-12-6-12z" fill="#F2CF4B" ' + S + '/><path d="M10 18c-3 3-3 8 1 10 1-4 3-6 5-7M22 18c3 3 3 8-1 10-1-4-3-6-5-7" fill="#8FAE5A" ' + S + '/>',
  wine: '<path d="M10 4h12c0 7-2 11-6 11s-6-4-6-11z" fill="#9B2C4A" ' + S + '/><path d="M16 15v10M11 28h10" ' + S + '/>',
  dough: '<path d="M4 22c0-6 5-10 12-10s12 4 12 10c0 3-5 5-12 5S4 25 4 22z" fill="#F2E3C2" ' + S + '/><path d="M12 16c2-1 5-1 7 0" ' + S + ' opacity=".5"/>',
  bowl: '<path d="M5 15h22a11 11 0 01-22 0z" fill="#E5D0A8" ' + S + '/><path d="M9 15c2-3 5-4 7-4s5 1 7 4" fill="none" ' + S + ' opacity=".5"/><path d="M12 27h8" ' + S + '/>'
};
/* keyword rules: first match wins. Multi-word phrases are checked as substrings; words with optional prefix ו/ב/ל/ה/מ/כ/ש */
var PHRASES = [
  ['תפוחי אדמה', 'potato'], ['תפו"א', 'potato'], ['תפוח אדמה', 'potato'], ['פירורי לחם', 'bread'], ['שמן זית', 'oliveoil'], ['רוטב סויה', 'soy'],
  ['אבקת מרק', 'spice:#E1B95E'], ['מרק עוף', 'spice:#E1B95E'], ['אבקת אפייה', 'packet'], ['אבקת סוכר', 'sugar'], ['סוכר וניל', 'packet'],
  ['פלפל שחור', 'pepper'], ['פלפל לבן', 'pepper'], ['פלפל חריף', 'hot'], ['פלפלים חריפים', 'hot'], ['מיץ לימון', 'lemon'], ['מלח לימון', 'spice:#F2D24B'],
  ['שמנת חמוצה', 'cream'], ['שמנת מתוקה', 'cream'], ['חלב קוקוס', 'milk'], ['גבינה לבנה', 'cream'], ['עלי דפנה', 'leaf'], ['ראש כרוב', 'cabbage']
];
var WORDS = [
  ['ויטה', 'spice:#E1B95E'], ['פראסה', 'zucchini'], ['גינגר', 'spice:#D9B26E'], ['שוקולית', 'choc'], ['גבינות', 'cheese'], ['קוקוס', 'nut'], ['מישמש', 'orange'], ['דלעת', 'orange'],
  ['רסק', 'can'], ['קופסת', 'can'], ['קופסה', 'can'], ['שימורים', 'can'], ['קטשופ', 'sauce'], ['סחוג', 'sauce'], ['הריסה', 'sauce'], ['רוטב', 'sauce'], ['צ\'ילי', 'sauce'],
  ['חומץ', 'vinegar'], ['סויה', 'soy'], ['מיונז', 'mayo'], ['חרדל', 'jam'], ['ריבה', 'jam'], ['דבש', 'honey'], ['סילאן', 'honey'], ['טחינה', 'tahini'],
  ['שמן', 'oil'], ['מרגרינה', 'butter'], ['חמאה', 'butter'],
  ['שומשום', 'nut'], ['שקדים', 'nut'], ['אגוזים', 'nut'], ['אגוזי', 'nut'], ['בוטנים', 'nut'], ['צנוברים', 'nut'], ['קשיו', 'nut'], ['גרעינים', 'nut'],
  ['שמרים', 'packet'], ['וניל', 'packet'], ['פודינג', 'packet'], ['תמצית', 'packet'], ['אינסטנט', 'packet'], ['ג\'לטין', 'packet'], ['אבקת', 'packet'],
  ['פפריקה', 'spice:#C8402E'], ['כורכום', 'spice:#E9B23A'], ['כמון', 'spice:#9C6A3C'], ['בהרט', 'spice:#7A4A2E'], ['קינמון', 'spice:#A0582E'], ['זעתר', 'spice:#8FAE5A'],
  ['אורגנו', 'spice:#8FAE5A'], ['ציפורן', 'spice:#5A3A22'], ['הל', 'spice:#A9C27A'], ['זנגביל', 'spice:#D9B26E'], ['קארי', 'spice:#E1A13A'], ['חוואיג', 'spice:#C88A3A'], ['מוסקט', 'spice:#9C6A3C'], ['תבלין', 'spice:#B5824F'], ['תבלינים', 'spice:#B5824F'],
  ['מלח', 'salt'], ['פלפל', 'bell'], ['גמבה', 'bell'], ['פלפלים', 'bell'], ['חריף', 'hot'], ['חריפים', 'hot'], ['צ\'ילי', 'hot'],
  ['מים', 'water'], ['סודה', 'water'], ['קרח', 'water'],
  ['בצל', 'onion'], ['בצלים', 'onion'], ['שאלוט', 'onion'], ['כרישה', 'zucchini'], ['כרישות', 'zucchini'],
  ['שום', 'garlic'], ['שיני', 'garlic'],
  ['עגבני', 'tomato'], ['עגבניות', 'tomato'], ['עגבנייה', 'tomato'], ['שרי', 'tomato'],
  ['גזר', 'carrot'], ['גזרים', 'carrot'], ['סלק', 'beet'], ['בטטה', 'potato'], ['בטטות', 'potato'],
  ['חלבון', 'egg'], ['חלבונים', 'egg'], ['חלמון', 'egg'], ['חלמונים', 'egg'], ['ביצה', 'egg'], ['ביצים', 'egg'],
  ['קמח', 'flour'], ['סולת', 'grain'], ['בורגול', 'grain'], ['קוסקוס', 'grain'], ['שיבולת', 'grain'], ['חיטה', 'grain'], ['פתיתים', 'pasta'], ['תירס', 'corn'],
  ['סוכר', 'sugar'], ['לימון', 'lemon'], ['לימונים', 'lemon'], ['ליים', 'lemon'], ['תפוז', 'orange'], ['תפוזים', 'orange'], ['קלמנטינה', 'orange'], ['משמש', 'orange'], ['אפרסק', 'orange'],
  ['תפוח', 'apple'], ['תפוחים', 'apple'], ['שזיפים', 'apple'], ['צימוקים', 'apple'], ['תמרים', 'apple'], ['ענבים', 'apple'], ['בננה', 'lemon'], ['פירות', 'apple'], ['רימון', 'apple'], ['אבוקדו', 'zucchini'],
  ['חציל', 'eggplant'], ['חצילים', 'eggplant'], ['קישוא', 'zucchini'], ['קישואים', 'zucchini'], ['מלפפון', 'cucumber'], ['מלפפונים', 'cucumber'], ['חמוצים', 'cucumber'], ['במיה', 'zucchini'],
  ['אורז', 'rice'], ['עדשים', 'legume'], ['חומוס', 'legume'], ['שעועית', 'legume'], ['לוביה', 'legume'], ['אפונה', 'legume'], ['גריסים', 'legume'], ['פסוליה', 'legume'], ['פול', 'legume'], ['גרגירי', 'legume'],
  ['בשר', 'meat'], ['טחון', 'meat'], ['אסאדו', 'meat'], ['צלי', 'meat'], ['כבד', 'meat'], ['אוסובוקו', 'meat'], ['שוק', 'meat'], ['נקניק', 'meat'], ['נקניקיות', 'meat'],
  ['עוף', 'chicken'], ['שוקיים', 'chicken'], ['כרעיים', 'chicken'], ['כנפיים', 'chicken'], ['חזה', 'chicken'], ['פרגיות', 'chicken'], ['הודו', 'chicken'],
  ['דג', 'fish'], ['דגים', 'fish'], ['פילה', 'fish'], ['סלמון', 'fish'], ['טונה', 'fish'], ['אמנון', 'fish'], ['סול', 'fish'],
  ['גבינה', 'cheese'], ['גבינת', 'cheese'], ['בולגרית', 'cheese'], ['צהובה', 'cheese'], ['פרמזן', 'cheese'], ['קוטג\'', 'cream'],
  ['חלב', 'milk'], ['שמנת', 'cream'], ['יוגורט', 'cream'], ['לבן', 'cream'], ['לבנה', 'cream'], ['גביע', 'cream'], ['אשל', 'cream'], ['שוקולד', 'choc'], ['קקאו', 'choc'],
  ['פטרוזיליה', 'herb'], ['כוסברה', 'herb'], ['שמיר', 'herb'], ['נענע', 'herb'], ['בזיליקום', 'herb'], ['רוזמרין', 'herb'], ['טימין', 'herb'], ['כרפס', 'herb'], ['סלרי', 'herb'], ['עשבי', 'herb'], ['ירוקים', 'herb'],
  ['דפנה', 'leaf'], ['תרד', 'leaf'], ['חסה', 'leaf'], ['מנגולד', 'leaf'], ['עלי', 'leaf'], ['עלים', 'leaf'],
  ['כרוב', 'cabbage'], ['כרובית', 'cauli'], ['ברוקולי', 'cauli'], ['פטריות', 'mushroom'], ['פטריה', 'mushroom'],
  ['פסטה', 'pasta'], ['אטריות', 'pasta'], ['מקרונים', 'pasta'], ['ספגטי', 'pasta'], ['איטריות', 'pasta'],
  ['לחם', 'bread'], ['חלה', 'bread'], ['פיתה', 'bread'], ['פירורי', 'bread'], ['מצה', 'matzah'], ['מצות', 'matzah'], ['קמח מצה', 'matzah'],
  ['ביסקוויטים', 'cookie'], ['ביסקוויט', 'cookie'], ['עוגיות', 'cookie'], ['בצק', 'dough'], ['עלים', 'dough'],
  ['יין', 'wine'], ['ברנדי', 'wine'], ['ליקר', 'wine']
];
var PRE = 'ובלהמכש';
function iconFor(text) {
  var t = String(text || '');
  for (var i = 0; i < PHRASES.length; i++) if (t.indexOf(PHRASES[i][0]) !== -1) return PHRASES[i][1];
  var words = t.replace(/[\u05F3\u05F4']/g, '').replace(/[^\u05D0-\u05EA'"]+/g, ' ').trim().split(/\s+/);
  for (var k = 0; k < words.length; k++) {
    var x = words[k];
    for (var j = 0; j < WORDS.length; j++) {
      var w = WORDS[j][0];
      if (x === w || (x.length > w.length && PRE.indexOf(x[0]) !== -1 && x.slice(1) === w)
        || (w.length >= 4 && (x.indexOf(w) === 0 || (PRE.indexOf(x[0]) !== -1 && x.slice(1).indexOf(w) === 0)))) return WORDS[j][1];
    }
  }
  return 'bowl';
}
function svgFor(text) {
  var id = iconFor(text), body;
  if (id.indexOf('spice:') === 0) body = I.spice(id.slice(6)); else body = I[id] || I.bowl;
  return '<svg class="ingic" viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">' + body + '</svg>';
}
window.INGREDIENT_ICON = svgFor;
window.INGREDIENT_ICON_ID = iconFor;
})();
