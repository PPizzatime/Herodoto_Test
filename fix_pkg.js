const fs = require('fs');
const path = 'apps/web/package.json';
const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
pkg.dependencies['react-markdown'] = '^9.0.1';
fs.writeFileSync(path, JSON.stringify(pkg, null, 2));
