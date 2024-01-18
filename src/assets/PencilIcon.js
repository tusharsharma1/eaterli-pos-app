import * as React from 'react';
import {SvgXml} from 'react-native-svg';

export default React.memo(
  ({width = 20, height = 20, color = '#F4F4F6', style = {}}) => {
    const xml = `<svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.4086 0L18.0108 3.60216L15.2648 6.34941L11.6626 2.74725L14.4086 0ZM0 14.3942V17.9964H3.60216L13.5669 8.04603L9.96478 4.44387L0 14.3942ZM0 21.5986H19.2115V24H0V21.5986Z" fill="${color}"/>
    </svg>
    `;
    return <SvgXml style={style} xml={xml} width={width} height={height} />;
  },
);
