import * as React from 'react';
import {SvgXml} from 'react-native-svg';

export default React.memo(
  ({width = 40, height = 40, color = '#A1A1AA', style = {}}) => {
    const xml = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M33.9487 17.8975H6.05131C4.9573 17.8975 4 18.8548 4 19.9488C4 21.0427 4.95738 22.0001 6.05131 22.0001H33.9487C35.0427 22.0001 36 21.0427 36 19.9488C36 18.8548 35.0426 17.8975 33.9487 17.8975Z" fill="${color}"/>
    <path d="M33.9487 29.7949H6.05131C4.9573 29.7949 4 30.7523 4 31.8462C4 32.9402 4.95738 33.8975 6.05131 33.8975H33.9487C35.0427 33.8975 36 32.9402 36 31.8462C36 30.7523 35.0426 29.7949 33.9487 29.7949Z" fill="${color}"/>
    <path d="M6.05131 10.1026H33.9487C35.0427 10.1026 36 9.14524 36 8.05131C36 6.95738 35.0426 6 33.9487 6H6.05131C4.9573 6 4 6.95738 4 8.05131C4 9.14524 4.95738 10.1026 6.05131 10.1026Z" fill="${color}"/>
    </svg>    
    `;
    return <SvgXml style={style} xml={xml} width={width} height={height} />;
  },
);
