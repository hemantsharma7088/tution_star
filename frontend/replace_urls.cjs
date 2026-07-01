const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.jsx') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('c:/Users/Dell/OneDrive/Documents/Desktop/tution-star/frontend/src');
const apiURLCode = "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api";

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes("'http://localhost:5000/api")) {
        content = content.replace(/'http:\/\/localhost:5000\/api/g, apiURLCode);
        
        // We also need to fix the closing quote of the URL string if it was replaced with backticks
        // E.g. 'http://localhost:5000/api/auth/login' -> `${import.meta.env...}/api/auth/login'
        // We need to change the trailing single quote to a backtick.
        content = content.replace(/(\$\{import\.meta\.env\.VITE_API_URL \|\| 'http:\/\/localhost:5000'\}\/api[^']*)'/g, "$1`");
        
        fs.writeFileSync(file, content);
        console.log('Updated:', file);
    }
});
console.log('Done replacing URLs');
