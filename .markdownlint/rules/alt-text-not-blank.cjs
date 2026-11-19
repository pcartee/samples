// Custom markdownlint rule: image descriptions must contain real text.
// MD045 catches images with no alt text at all; this rule also catches alt text
// that is only whitespace (![ ](x.png)) or an empty HTML alt attribute
// (<img alt="" ...>). To mark an image as decorative, request an exception
// (see CONTRIBUTING.md).
'use strict';

const BLANK_HTML_ALT = /<img\b[^>]*\balt\s*=\s*(?:""|''|"\s+"|'\s+')/gi;

function walk(tokens, visit) {
  for (const token of tokens) {
    visit(token);
    if (token.children && token.children.length) walk(token.children, visit);
  }
}

module.exports = {
  names: ['DOCS001', 'alt-text-not-blank'],
  description: 'Image alt text must not be blank',
  tags: ['accessibility', 'images'],
  parser: 'micromark',
  function: (params, onError) => {
    const reported = new Set();
    walk(params.parsers.micromark.tokens, (token) => {
      if (token.type === 'image') {
        const label = token.children.find((child) => child.type === 'label');
        const text = label ? label.text.replace(/^!?\[/, '').replace(/\]$/, '') : '';
        if (text.length > 0 && text.trim().length === 0) {
          onError({ lineNumber: token.startLine, detail: 'Alt text is only whitespace.', context: token.text.slice(0, 60) });
        }
      } else if (token.type === 'htmlFlow' || token.type === 'htmlText') {
        BLANK_HTML_ALT.lastIndex = 0;
        let match;
        while ((match = BLANK_HTML_ALT.exec(token.text)) !== null) {
          const lineNumber = token.startLine + token.text.slice(0, match.index).split('\n').length - 1;
          if (reported.has(lineNumber)) continue;
          reported.add(lineNumber);
          onError({ lineNumber, detail: 'The img alt attribute is empty.', context: match[0].slice(0, 60) });
        }
      }
    });
  },
};
