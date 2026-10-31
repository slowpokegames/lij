// Assemble dist/Lij-games.html by inlining src/cards.js into src/games.src.html.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'src/games.src.html'), 'utf8');
const cards = fs.readFileSync(path.join(root, 'src/cards.js'), 'utf8');
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/Lij-games.html'), src.replace('/*CARDS_JS*/', cards));
console.log('wrote dist/Lij-games.html');
