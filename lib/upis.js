// Bezbedan upis datoteke: prvo u privremenu pa preimenovanje – ako server stane usred upisa
// (nestanak struje, restart), stara datoteka ostaje cela umesto polovičnog JSON-a.
const fs = require('fs');

module.exports = function upisi(datoteka, tekst) {
  const privremena = `${datoteka}.${process.pid}.tmp`;
  fs.writeFileSync(privremena, tekst);
  fs.renameSync(privremena, datoteka);
};
