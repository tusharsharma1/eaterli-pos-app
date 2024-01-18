import * as React from 'react';
import {SvgXml} from 'react-native-svg';

export default React.memo(
  ({width = 40, height = 40, color = '#A1A1AA', style = {}}) => {
    const xml = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.00008 7.99998H35.9996V13.5086H4.00008V7.99998ZM23.1729 17.088V24.6593L20 22.2598L16.8273 24.6593V17.088H4.51025C4.00008 17.088 4.00008 17.5097 4.00008 17.5097V30.5441C4.00008 31.4717 4.7291 32.2307 5.6202 32.2307H34.3801C35.2709 32.2307 36.0001 31.4717 36.0001 30.5441V17.7756C36.0001 17.7756 36.0001 17.088 35.3251 17.088H23.1729Z" fill="#F4F4F6"/>
    </svg>
    `;
    return <SvgXml style={style} xml={xml} width={width} height={height} />;
  },
);
