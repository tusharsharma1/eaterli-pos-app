import {useSelector} from 'react-redux';

function useTheme() {
  let darkMode = useSelector(s => s.settings.generalSettings.darkMode);
  let themeConfig = useSelector(s => s.app.themeConfig);
  let config = darkMode ? themeConfig.dark : themeConfig.light;
  return {...config,darkMode};
}

export default useTheme;
