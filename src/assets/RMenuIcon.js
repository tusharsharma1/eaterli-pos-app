import * as React from 'react';
import {SvgXml} from 'react-native-svg';

export default React.memo(
  ({width = 40, height = 40, color = '#F4F4F6', style = {}}) => {
    const xml = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M29.3334 18.6667H10.6667V16H29.3334V18.6667ZM29.3334 21.3333H10.6667V24H29.3334V21.3333ZM29.3334 26.6667H10.6667V29.3333H29.3334V26.6667ZM33.3334 12V33.3333H6.66674V12H33.3334ZM36.0001 4H4.00008V36H36.0001V4Z" fill="${color}"/>
    </svg>
    `;
    return <SvgXml style={style} xml={xml} width={width} height={height} />;
  },
);
