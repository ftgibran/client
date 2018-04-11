import React from 'react';
import { omit } from 'lodash';
import { compose } from 'recompose';
import { withData, withProgress } from 'spunky';

import authActions from '../actions/authActions';

const DATA_PROP = '__authData__';
const PROGRESS_PROP = '__authProgress__';

export default function withAuthChange(progress, callback) {
  const mapDataToProps = (data) => ({
    [DATA_PROP]: data
  });

  return (Component) => {
    class WrappedComponent extends React.Component {
      componentDidUpdate(prevProps) {
        if (prevProps[PROGRESS_PROP] !== progress && this.props[PROGRESS_PROP] === progress) {
          callback(this.props[DATA_PROP], omit(this.props, DATA_PROP, PROGRESS_PROP));
        }
      }

      render() {
        const passDownProps = omit(this.props, DATA_PROP, PROGRESS_PROP);
        return <Component {...passDownProps} />;
      }
    }

    return compose(
      withProgress(authActions, { propName: PROGRESS_PROP }),
      withData(authActions, mapDataToProps)
    )(WrappedComponent);
  };
}
