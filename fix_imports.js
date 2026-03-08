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

    let needsChangeDetection = content.includes('ChangeDetectionStrategy.OnPush');
    let needsInject = content.includes('inject(');
    let needsInput = content.includes('input<') || content.includes('input(');
    let needsOutput = content.includes('output<') || content.includes('output(');
    let needsModel = content.includes('model<') || content.includes('model(');
    
    const importRegex = /import\s*\{([^}]+)\}\s*from\s*['"]@angular\/core['"];/g;
    let coreImportsMatch = importRegex.exec(content);
    
    if (coreImportsMatch) {
       let itemsSet = new Set(coreImportsMatch[1].split(',').map(i => i.trim()).filter(i => i));
       if (needsChangeDetection) itemsSet.add('ChangeDetectionStrategy');
       if (needsInject) itemsSet.add('inject');
       if (needsInput) itemsSet.add('input');
       if (needsOutput) itemsSet.add('output');
       if (needsModel) itemsSet.add('model');
       
       let newImport = `import { ${Array.from(itemsSet).join(', ')} } from '@angular/core';`;
       content = content.replace(/import\s*\{([^}]+)\}\s*from\s*['"]@angular\/core['"];\s*\n?/g, ''); // strip all
       content = newImport + '\n' + content;
    } else if (needsChangeDetection || needsInject || needsInput || needsOutput || needsModel) {
       let itemsSet = new Set();
       if (needsChangeDetection) itemsSet.add('ChangeDetectionStrategy');
       if (needsInject) itemsSet.add('inject');
       if (needsInput) itemsSet.add('input');
       if (needsOutput) itemsSet.add('output');
       if (needsModel) itemsSet.add('model');
       
       content = `import { ${Array.from(itemsSet).join(', ')} } from '@angular/core';\n` + content;
    }

    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf-8');
    }
  }
});
