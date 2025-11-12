import {connect} from 'react-redux';
import SelectorHighlighter from '../components/SelectorHighlighter';
import * as selectors from '../store/selectors';

function mapStateToProps(state) {
  return {
    selector: selectors.getSelector(state),
    parseResult: selectors.getParseResult(state),
  };
}

export default connect(mapStateToProps)(SelectorHighlighter);

