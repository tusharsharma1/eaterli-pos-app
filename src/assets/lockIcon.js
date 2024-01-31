import * as React from 'react';
import {SvgXml} from 'react-native-svg';

export default React.memo(
  ({width = 17, height = 20, color = '#fff', style = {}}) => {
    const xml = `<svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 20V8.96548H2.11968V5.5171C2.11968 2.47 4.65032 0 7.77194 0H8.47871C11.6003 0 14.131 2.47 14.131 5.5171V8.96548H16.2503V20H0ZM7.59161 14.3361L7.06548 17.931H9.18516L8.65903 14.3361C9.17452 14.1306 9.53839 13.6374 9.53839 13.0603C9.53839 12.2984 8.90548 11.681 8.12516 11.681C7.34484 11.681 6.71226 12.2984 6.71226 13.0603C6.71226 13.6374 7.07613 14.1306 7.59161 14.3361ZM12.011 5.86194C12.011 3.7671 10.2713 2.06903 8.12516 2.06903C5.97903 2.06903 4.23935 3.7671 4.23935 5.86194V8.96548H12.011V5.86194Z" fill="#F4F4F6"/>
    </svg>
    `;
    return <SvgXml style={style} xml={xml} width={width} height={height} />;
  },
);
