const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
        walkDir(dirPath, callback);
    } else {
        callback(path.join(dir, f));
    }
  });
}

walkDir('C:\\xampp\\htdocs\\itax\\kra-itax\\src\\app', function(filePath) {
  if (filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Fix imports by consolidating all @angular/core imports
    let coreImports = new Set();
    let hasCoreImport = false;
    
    // Extract everything from multiple @angular/core imports
    const importRegex = /import\s*\{([^}]+)\}\s*from\s*['"]@angular\/core['"];/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        hasCoreImport = true;
        let items = match[1].split(',').map(i => i.trim()).filter(i => i);
        items.forEach(i => coreImports.add(i));
    }

    if (hasCoreImport) {
        // Remove all old imports
        content = content.replace(/import\s*\{([^}]+)\}\s*from\s*['"]@angular\/core['"];\s*\n?/g, '');
        // Inject single unified import at the top
        let unifiedImport = `import { ${Array.from(coreImports).join(', ')} } from '@angular/core';\n`;
        content = unifiedImport + content;
    }
    
    // Remove extra duplicate exact specific lines like `import { inject } from '@angular/core';`
    const specificInjectImport = /import\s*\{\s*inject\s*\}\s*from\s*['"]@angular\/core['"];\s*\n?/g;
    let injectMatchCount = 0;
    content = content.replace(specificInjectImport, (m) => {
        injectMatchCount++;
        return injectMatchCount === 1 && !hasCoreImport ? m : '';
    });

    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf-8');
    }
  }
});
