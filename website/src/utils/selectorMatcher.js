/**
 * Utility for matching ESLint selectors against AST nodes using esquery.
 */

// Use webpack's async require pattern like the parsers do
let esqueryPromise = null;

function loadEsquery() {
  if (esqueryPromise === null) {
    esqueryPromise = new Promise((resolve, reject) => {
      try {
        require(['esquery'], (esqueryModule) => {
          try {
            // esquery exports { query } as named export
            let queryFn = null;
            if (typeof esqueryModule === 'function') {
              queryFn = esqueryModule;
            } else if (typeof esqueryModule.query === 'function') {
              queryFn = esqueryModule.query;
            } else if (typeof esqueryModule.default === 'function') {
              queryFn = esqueryModule.default;
            } else {
              console.error('esquery module structure:', esqueryModule);
              reject(new Error('Could not find esquery.query function. Available keys: ' + Object.keys(esqueryModule || {}).join(', ')));
              return;
            }
            resolve(queryFn);
          } catch (e) {
            reject(e);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  return esqueryPromise;
}

/**
 * Matches a selector against an AST and returns a Promise that resolves to an array of matching nodes.
 * @param {Object} ast - The AST to search
 * @param {string} selector - The ESLint selector string
 * @returns {Promise<Array<Object>>} Promise that resolves to array of matching AST nodes, or null if error
 */
export function matchSelector(ast, selector) {
  if (!ast || !selector || !selector.trim()) {
    return Promise.resolve([]);
  }

  return loadEsquery().then(
    (queryFn) => {
      try {
        const matches = queryFn(ast, selector);
        return matches || [];
      } catch (error) {
        console.error('Selector matching error:', error);
        return null;
      }
    },
    (error) => {
      console.error('Failed to load esquery:', error);
      return null;
    }
  );
}

/**
 * Gets ranges for matching nodes using a treeAdapter.
 * @param {Array<Object>} nodes - Array of matching AST nodes
 * @param {Object} treeAdapter - TreeAdapter instance with getRange method
 * @returns {Array<Array<number>>} Array of [start, end] ranges
 */
export function getRangesForNodes(nodes, treeAdapter) {
  if (!nodes || !treeAdapter) {
    return [];
  }

  const ranges = [];
  for (const node of nodes) {
    const range = treeAdapter.getRange(node);
    if (range && Array.isArray(range) && range.length === 2) {
      ranges.push(range);
    }
  }
  return ranges;
}

