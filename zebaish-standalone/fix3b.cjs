const fs = require('fs');
const path = require('path');
const filePath = path.join('E:/zebaish-standalone/src/pages/MenuSelection.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find and replace the w.onload line
const idx = content.indexOf('w.onload');
if (idx > -1) {
  // Find the end of the w.onload statement
  const endIdx = content.indexOf(';};', idx);
  if (endIdx > -1) {
    const oldBlock = content.substring(idx, endIdx + 3);
    const newBlock = `w.onload = function(){
      try {
        var cn = (eventData.fullName || 'Walk-in').replace(/[^a-zA-Z0-9]/g,'_');
        var cv = (eventData.venue || 'Venue').replace(/[^a-zA-Z0-9]/g,'_');
        var cd = eventData.eventDate || new Date().toISOString().split('T')[0];
        w.document.title = cn + '_' + cv + '_' + cd + '.pdf';
      } catch(ex) {}
      w.print();
    };`;
    content = content.replace(oldBlock, newBlock);
    console.log('Fix 3: PDF filename updated');
  } else {
    console.log('Fix 3: Could not find end of w.onload block');
  }
} else {
  console.log('Fix 3: w.onload not found');
}

fs.writeFileSync(filePath, content, 'utf8');
