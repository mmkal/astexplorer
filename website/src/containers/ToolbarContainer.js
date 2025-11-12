import {connect} from 'react-redux';
import {
  save,
  selectCategory,
  openSettingsDialog,
  openShareDialog,
  selectTransformer,
  hideTransformer,
  setParser,
  reset,
  setKeyMap,
  setSelector,
} from '../store/actions';
import Toolbar from '../components/Toolbar';
import * as selectors from '../store/selectors';

function mapStateToProps(state) {
  const parser = selectors.getParser(state);

  return {
    forking: selectors.isForking(state),
    saving: selectors.isSaving(state),
    canSave: selectors.canSave(state),
    canFork: selectors.canFork(state),
    category: parser.category,
    parser,
    transformer: selectors.getTransformer(state),
    keyMap: selectors.getKeyMap(state),
    showTransformer: selectors.showTransformer(state),
    snippet: selectors.getRevision(state),
    selector: selectors.getSelector(state),
    parseResult: selectors.getParseResult(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onParserChange: parser => {
      dispatch(setParser(parser));
    },
    onCategoryChange: category => {
      dispatch(selectCategory(category));
    },
    onParserSettingsButtonClick: () => {
      dispatch(openSettingsDialog());
    },
    onShareButtonClick: () => {
      dispatch(openShareDialog());
    },
    onTransformChange: transformer => {
      dispatch(transformer ? selectTransformer(transformer) : hideTransformer());
    },
    onKeyMapChange: keyMap => {
      dispatch(setKeyMap(keyMap))
    },
    onSelectorChange: selector => {
      dispatch(setSelector(selector));
    },
    onSave: () => dispatch(save(false)),
    onFork: () => dispatch(save(true)),
    onNew: () => {
      if (global.location.hash) {
        global.location.hash = '';
      } else {
        dispatch(reset());
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);

