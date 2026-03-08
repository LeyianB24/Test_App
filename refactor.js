const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('C:\\xampp\\htdocs\\itax\\kra-itax\\src\\app', function(filePath) {
  if (filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // 1. Remove standalone: true
    content = content.replace(/standalone:\s*true\s*,?\s*\n?/g, '');

    // 2. Add OnPush Change Detection
    if (content.includes('@Component(') && !content.includes('ChangeDetectionStrategy.OnPush')) {
      content = content.replace(/(@Component\s*\(\s*\{)/, '$1\n  changeDetection: ChangeDetectionStrategy.OnPush,');
      // Import ChangeDetectionStrategy if not present
      if (!content.includes('ChangeDetectionStrategy')) {
        content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]@angular\/core['"];/g, (match, p1) => {
          return `import { ${p1.trim()}, ChangeDetectionStrategy } from '@angular/core';`;
        });
        if (!content.includes('ChangeDetectionStrategy')) {
          content = `import { ChangeDetectionStrategy } from '@angular/core';\n` + content;
        }
      }
    }

    // 3. Inputs -> Signals
    content = content.replace(/@Input\(\)\s+(?:public\s+)?([a-zA-Z0-9_]+)\??\s*(?::\s*([^=;]+))?\s*(?:=\s*([^;]+))?;/g, (match, prop, type, init) => {
      type = type ? type.trim() : 'any';
      init = init ? init.trim() : '';
      if (init) {
        return `${prop} = input<${type}>(${init});`;
      } else {
        return `${prop} = input<${type}>();`;
      }
    });

    // 4. Outputs -> Signals
    content = content.replace(/@Output\(\)\s+(?:public\s+)?([a-zA-Z0-9_]+)\s*=\s*new\s+EventEmitter(?:<([^>]+)>)?\(\);/g, (match, prop, type) => {
      type = type ? `<${type}>` : '';
      return `${prop} = output${type}();`;
    });

    // Add imports
    if (content.match(/input</) && !content.includes(' input,')) {
         content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]@angular\/core['"];/g, (match, p1) => {
             if (!p1.includes('input')) {
                 return `import { ${p1.trim()}, input } from '@angular/core';`;
             }
             return match;
         });
    }
    if (content.match(/output(?:<|\()/) && !content.includes(' output,')) {
         content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]@angular\/core['"];/g, (match, p1) => {
             if (!p1.includes('output')) {
                 return `import { ${p1.trim()}, output } from '@angular/core';`;
             }
             return match;
         });
    }
    
    // Convert constructor params to inject() roughly
    // public themeService: ThemeService -> public themeService = inject(ThemeService);
    content = content.replace(/constructor\s*\(\s*((?:(?:public|private|protected|readonly)?\s*[a-zA-Z0-9_]+\s*:\s*[a-zA-Z0-9_<>]+\s*,?\s*)+)\s*\)\s*\{/g, (match, params) => {
        let lines = params.split(',').map(p => p.trim()).filter(p => p.length > 0);
        let injected = lines.map(line => {
            let parts = line.split(':').map(p => p.trim());
            let mods = parts[0].split(/\s+/);
            let name = mods.pop(); // last is name
            let type = parts[1];
            return `${mods.join(' ')} ${name} = inject(${type});`.trim();
        });
        
        let injects = injected.join('\n  ');
        return `// TODO: Check constructor replacements\n  ${injects}\n  constructor() {`;
    });

    if (content.includes('inject(') && !content.includes(' inject,')) {
         content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]@angular\/core['"];/g, (match, p1) => {
             if (!p1.includes('inject')) {
                 return `import { ${p1.trim()}, inject } from '@angular/core';`;
             }
             return match;
         });
         if (!content.includes(' inject,')) {
            content = `import { inject } from '@angular/core';\n` + content;
         }
    }


    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated TS ${filePath}`);
    }
  } else if (filePath.endsWith('.html')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    content = content.replace(/\[ngClass\]=/g, '[class]=');
    content = content.replace(/\[ngStyle\]=/g, '[style]=');
    // Using simple regex for img src -> ngSrc could overlap with other srcs.
    content = content.replace(/<img([^>]*)src="([^"]+)"([^>]*)>/gi, (match, p1, p2, p3) => {
        // if it already has ngSrc ignore
        if (p1.includes('ngSrc') || p3.includes('ngSrc')) return match;
        // if base64 ignore
        if (p2.startsWith('data:')) return match;
        return `<img${p1}ngSrc="${p2}"${p3}>`;
    });

    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated HTML ${filePath}`);
    }
  }
});
