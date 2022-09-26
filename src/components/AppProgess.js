import React from 'react';
import {useSelector} from 'react-redux';

import AppLoader from './AppLoader';
function AppProgess() {
  const {progressMessage, inProgress} = useSelector(s => ({
    inProgress: s.app.inProgress,
    progressMessage: s.app.progressMessage,
  }));
  if (!inProgress) {
    return null;
  }
  return (
    <>
      <AppLoader message={progressMessage} />
    </>
  );
}

export default AppProgess;
