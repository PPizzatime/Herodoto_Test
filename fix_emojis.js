const fs = require('fs');
const path = 'apps/web/app/office/layout.tsx';
let code = fs.readFileSync(path, 'utf8');

// Replace the invalid Bell symbol
code = code.replace(/\?\?/, '&#128276;');

// Replace the invalid Hamburger symbol
code = code.replace(/= Menu/, '&#9776; Menu');

// Replace the invalid Close symbol
code = code.replace(/>\s*o\s*<\/button>/g, '>\n              &#10005;\n            </button>');

fs.writeFileSync(path, code);
