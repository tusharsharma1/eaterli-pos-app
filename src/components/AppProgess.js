import React from 'react';
import {useSelector} from 'react-redux';

import AppLoader from './AppLoader';
function AppProgess({width, height}) {
  const {progressMessage, inProgress} = useSelector(s => ({
    inProgress: s.app.inProgress,
    progressMessage: s.app.progressMessage,
  }));
  if (!inProgress) {
    return null;
  }
  return (
    <>
      <AppLoader width={width} height={height} message={progressMessage} />
    </>
  );
}

export default AppProgess;
