// Porodična statistika – trajno se čuva u podaci/statistika.json
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', 'podaci', 'statistika.json');

function citaj() {
  try { return JSON.parse(fs.readFileSync(F, 'utf8')); } catch { return { igraci: {}, igre: [] }; }
}

function zabeleziIgru({ kviz, igraci }) {
  const s = citaj();
  const pobednik = igraci[0];
  for (const ig of igraci) {
    const k = ig.ime.toLowerCase();
    const st = (s.igraci[k] ||= { ime: ig.ime, avatar: ig.avatar, igre: 0, pobede: 0, poeni: 0, tacnih: 0, odgovorenih: 0, najduzaRec: '', rekord: 0 });
    st.ime = ig.ime;
    st.avatar = ig.avatar;
    st.igre++;
    if (igraci.length > 1 && ig === pobednik && ig.poeni > 0) st.pobede++;
    st.poeni += ig.poeni;
    st.tacnih += ig.tacnih;
    st.odgovorenih += ig.odgovorenih;
    st.rekord = Math.max(st.rekord || 0, ig.poeni);
    if ([...(ig.najduzaRec || '')].length > [...(st.najduzaRec || '')].length) st.najduzaRec = ig.najduzaRec;
  }
  s.igre.unshift({ datum: new Date().toISOString(), kviz, rang: igraci.map((i) => ({ ime: i.ime, avatar: i.avatar, poeni: i.poeni })) });
  s.igre = s.igre.slice(0, 50);
  fs.writeFileSync(F, JSON.stringify(s, null, 1));
}

module.exports = { citaj, zabeleziIgru };
