import * as React from 'react';
import {SvgXml} from 'react-native-svg';

export default React.memo(
  ({width = 20, height = 20, color = '#F4F4F6', style = {}}) => {
    const xml = `<svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 6L4 24H16L19 6H1ZM20 2V4H0V2H5.711C6.611 2 7.342 0.901 7.342 0H12.658C12.658 0.901 13.388 2 14.289 2H20Z" fill="${color}"/>
    </svg>
    `;
    return <SvgXml style={style} xml={xml} width={width} height={height} />;
  },
);
