const fs = require('fs');

function tsxToMarkdown(tsx) {
  let md = tsx.split('return (')[1];
  md = md.substring(md.indexOf('<h1'));
  md = md.split('<Comments')[0];
  
  // Strip divs but keep their content
  md = md.replace(/<div[^>]*>/g, '');
  md = md.replace(/<\/div>/g, '');
  
  // Headings
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1\n');
  
  // Formatting
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**');
  md = md.replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*');
  md = md.replace(/<code[^>]*>(.*?)<\/code>/g, '`$1`');
  
  // Lists
  md = md.replace(/<ul[^>]*>/g, '');
  md = md.replace(/<\/ul>/g, '');
  md = md.replace(/<li[^>]*>(.*?)<\/li>/g, '- $1\n');
  
  // Paragraphs
  md = md.replace(/<p[^>]*>/g, '');
  md = md.replace(/<\/p>/g, '\n\n');
  
  // Newlines
  md = md.replace(/\n\s*\n/g, '\n\n').trim();
  
  return md;
}

const architectureMd = tsxToMarkdown(fs.readFileSync('architecture_temp.txt', 'utf8'));
const techStackMd = tsxToMarkdown(fs.readFileSync('techstack_temp.txt', 'utf8'));
const deploymentMd = tsxToMarkdown(fs.readFileSync('deployment_temp.txt', 'utf8'));

fs.writeFileSync('arch.md', architectureMd);
fs.writeFileSync('tech.md', techStackMd);
fs.writeFileSync('dep.md', deploymentMd);
console.log("Markdown files generated!");
