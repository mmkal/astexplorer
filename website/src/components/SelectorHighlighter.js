import PropTypes from 'prop-types';
import React from 'react';
import {publish} from '../utils/pubsub';
import {matchSelector, getRangesForNodes} from '../utils/selectorMatcher';
import {treeAdapterFromParseResult} from '../core/TreeAdapter';

/**
 * Component that watches for selector changes and publishes highlight events.
 * This component doesn't render anything - it's just a side-effect component.
 */
export default class SelectorHighlighter extends React.Component {
  componentDidMount() {
    this.updateHighlights();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.selector !== this.props.selector ||
      prevProps.parseResult !== this.props.parseResult
    ) {
      this.updateHighlights();
    }
  }

  componentWillUnmount() {
    // Clear highlights when unmounting
    publish('SELECTOR_HIGHLIGHT', {ranges: [], matchedNodes: new Set()});
  }

  updateHighlights() {
    const {selector, parseResult} = this.props;

    if (!selector || !selector.trim() || !parseResult || !parseResult.ast) {
      publish('SELECTOR_HIGHLIGHT', {ranges: [], matchedNodes: new Set()});
      return;
    }

    // Check if this is an ESTree parser by checking if AST nodes have 'type' property
    // This is a heuristic - ESTree format uses 'type' property on nodes
    const isESTree = parseResult.ast && 
      typeof parseResult.ast === 'object' && 
      parseResult.ast.type === 'Program';
    
    if (!isESTree) {
      publish('SELECTOR_HIGHLIGHT', {ranges: [], matchedNodes: new Set()});
      return;
    }

    // Match selector against AST (returns a Promise)
    matchSelector(parseResult.ast, selector).then((matches) => {
      // Check if component is still mounted and props haven't changed
      if (
        this.props.selector !== selector ||
        this.props.parseResult !== parseResult
      ) {
        return; // Props changed, ignore this result
      }

      if (matches === null) {
        // Error occurred (invalid selector)
        publish('SELECTOR_HIGHLIGHT', {ranges: [], matchedNodes: new Set(), error: true});
        return;
      }

      // Get ranges for matched nodes
      const treeAdapter = treeAdapterFromParseResult(parseResult, {});
      const ranges = getRangesForNodes(matches, treeAdapter);

      // Publish highlight event with matched nodes for tree visualization
      publish('SELECTOR_HIGHLIGHT', {ranges, matches, matchedNodes: new Set(matches)});
    }).catch((error) => {
      console.error('Selector matching failed:', error);
      publish('SELECTOR_HIGHLIGHT', {ranges: [], matchedNodes: new Set(), error: true});
    });
  }

  render() {
    return null;
  }
}

SelectorHighlighter.propTypes = {
  selector: PropTypes.string,
  parseResult: PropTypes.object,
};

