
// Simple utilities for parsing and modifying LaTeX documents
// This is a simplified version - a real implementation would use a proper LaTeX parser

export const LatexParser = {
  // Extract sections from a LaTeX document
  extractSections: (latex: string): Record<string, string> => {
    const sections: Record<string, string> = {};
    const sectionRegex = /\\section\{([^}]+)\}([\s\S]*?)(?=\\section\{|\\end\{document\}|$)/g;
    
    let match;
    while ((match = sectionRegex.exec(latex)) !== null) {
      const sectionName = match[1];
      const sectionContent = match[2].trim();
      sections[sectionName] = sectionContent;
    }
    
    return sections;
  },
  
  // Extract skills from the Skills section
  extractSkills: (latex: string): string[] => {
    const sections = LatexParser.extractSections(latex);
    const skillsSection = sections['Skills'] || '';
    
    // Very simplistic extraction - in real life, this would be more sophisticated
    const skills = skillsSection
      .replace(/\\textbf\{([^}]+)\}/g, '$1') // Remove \textbf{}
      .replace(/\\item\s+/g, '') // Remove \item
      .split(/[,\n]/) // Split by commas or newlines
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
    
    return skills;
  },
  
  // Modify a section in the LaTeX document
  modifySection: (latex: string, sectionName: string, newContent: string): string => {
    const sectionRegex = new RegExp(`(\\\\section\\{${sectionName}\\})([\\s\\S]*?)(?=\\\\section\\{|\\\\end\\{document\\}|$)`, 'g');
    
    return latex.replace(sectionRegex, `$1\n${newContent}\n`);
  },
  
  // Insert content at a specific point in the LaTeX document
  insertAtCommand: (latex: string, command: string, contentToInsert: string): string => {
    const commandRegex = new RegExp(`(\\\\${command}[^\\n]*)`, 'g');
    
    return latex.replace(commandRegex, `$1\n${contentToInsert}`);
  },
  
  // Simple diff to highlight changes between two LaTeX documents
  diff: (original: string, modified: string): { added: string[], removed: string[] } => {
    const originalLines = original.split('\n');
    const modifiedLines = modified.split('\n');
    
    const added = modifiedLines.filter(line => !originalLines.includes(line));
    const removed = originalLines.filter(line => !modifiedLines.includes(line));
    
    return { added, removed };
  }
};

export default LatexParser;
