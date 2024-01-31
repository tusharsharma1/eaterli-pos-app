import * as React from 'react';
import {SvgXml} from 'react-native-svg';

export default React.memo(
  ({width = 20, height = 20, color = '#fff', style = {}}) => {
    const xml = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="#F4F4F6"/>
    <path d="M10 11.6667C2.375 11.6667 0 16.6667 0 16.6667V19.1667H20V16.6667C20 16.6667 17.625 11.6667 10 11.6667Z" fill="#F4F4F6"/>
    </svg>
    `;
    return <SvgXml style={style} xml={xml} width={width} height={height} />;
  },
);
