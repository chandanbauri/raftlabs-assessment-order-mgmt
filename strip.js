const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');


    content = content.replace(/\/\*[\s\S]*?\*\


    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        let commentIndex = line.indexOf('
        while (commentIndex !== -1) {

            if (commentIndex > 0 && line[commentIndex - 1] === ':') {
                commentIndex = line.indexOf('
                continue;
            }


            line = line.substring(0, commentIndex).trimRight();
            break;
        }
        lines[i] = line;
    }

    content = lines.join('\n');

    fs.writeFileSync(filePath, content);
}

function walk(dir) {
    if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('dist')) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
            walk(full);
        } else if (full.endsWith('.go') || full.endsWith('.ts') || full.endsWith('.tsx') || full.endsWith('.js')) {
            processFile(full);
        }
    }
}

walk('.');
