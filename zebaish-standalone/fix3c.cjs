const fs = require('fs');
const path = require('path');
const filePath = path.join('E:/zebaish-standalone/src/pages/MenuSelection.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const old = '    w.onload = function(){ w.print(); };';
const replacement = `    w.onload = function(){
      try {
        var cn = (eventData.fullName || 'Walk-in').replace(/[^a-zA-Z0-9]/g,'_');
        var cv = (eventData.venue || 'Venue').replace(/[^a-zA-Z0-9]/g,'_');
        var cd = eventData.eventDate || new Date().toISOString().split('T')[0];
        w.document.title = cn + '_' + cv + '_' + cd + '.pdf';
      } catch(ex) {}
      w.print();
    };`;

if (content.includes(old)) {
  content = content.replace(old, replacement);
  console.log('Fix 3: PDF filename updated');
} else {
  console.log('Fix 3: pattern not found');
}

fs.writeFileSync(filePath, content, 'utf8');
