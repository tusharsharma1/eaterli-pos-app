import {useSelector} from 'react-redux';

function useTheme() {
  let darkMode = useSelector(s => s.app.darkMode);
  let themeConfig = useSelector(s => s.app.themeConfig);
  let config = darkMode ? themeConfig.dark : themeConfig.light;
  return {...config,darkMode};
}

export default useTheme;
