
import { ALERT_TYPE } from '../../constants/alert.constant';
import {actions} from '../reducers/alert.reducer';

export default {
  ...actions,
  showAlert(
    config = {
      type: ALERT_TYPE.ALERT,
      icon: 'i',
      text: '',
      heading: 'Message',
      onPositivePress: null,
      positiveText: 'OK',
      onNegativePress: null,
      NegativeText: 'No',
    },
  ) {
    return (dispatch) => {
      dispatch(
        actions.set({
          ...config,
          show: true,
        }),
      );
    };
  },
};
