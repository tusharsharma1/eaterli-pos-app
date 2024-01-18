import * as React from 'react';
import {SvgXml} from 'react-native-svg';

export default React.memo(
  ({width = 40, height = 40, color = '#A1A1AA', style = {}}) => {
    const xml = `<svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.0002 18.1333H5.86687V20.2667H8.0002V18.1333Z" fill="#F4F4F6"/>
    <path d="M8.0002 10.6667H5.86687V12.8H8.0002V10.6667Z" fill="#F4F4F6"/>
    <path d="M8.0002 25.6H5.86687V27.7333H8.0002V25.6Z" fill="#F4F4F6"/>
    <path d="M21.3336 2.1333H19.2002V3.19997C19.2002 4.96423 17.7645 6.39997 16.0002 6.39997H7.4669C5.70263 6.39997 4.2669 4.96423 4.2669 3.19997V2.1333H2.13356C0.957029 2.1333 0.000228882 3.0901 0.000228882 4.26663V29.8666C0.000228882 31.0432 0.957029 32 2.13356 32H21.3336C22.5101 32 23.4669 31.0432 23.4669 29.8666V4.26663C23.4669 3.0901 22.5101 2.1333 21.3336 2.1333ZM9.0669 28.2666C9.0669 28.561 8.82796 28.8 8.53356 28.8H5.33356C5.03916 28.8 4.80023 28.561 4.80023 28.2666V25.0666C4.80023 24.7722 5.03916 24.5333 5.33356 24.5333H8.53356C8.82796 24.5333 9.0669 24.7722 9.0669 25.0666V28.2666ZM9.0669 20.8C9.0669 21.0944 8.82796 21.3333 8.53356 21.3333H5.33356C5.03916 21.3333 4.80023 21.0944 4.80023 20.8V17.6C4.80023 17.3056 5.03916 17.0666 5.33356 17.0666H8.53356C8.82796 17.0666 9.0669 17.3056 9.0669 17.6V20.8ZM9.0669 13.3333C9.0669 13.6277 8.82796 13.8666 8.53356 13.8666H5.33356C5.03916 13.8666 4.80023 13.6277 4.80023 13.3333V10.1333C4.80023 9.8389 5.03916 9.59997 5.33356 9.59997H8.53356C8.82796 9.59997 9.0669 9.8389 9.0669 10.1333V13.3333ZM18.1336 28.8H11.7336C11.4392 28.8 11.2002 28.561 11.2002 28.2666C11.2002 27.9722 11.4392 27.7333 11.7336 27.7333H18.1336C18.428 27.7333 18.6669 27.9722 18.6669 28.2666C18.6669 28.561 18.428 28.8 18.1336 28.8ZM18.1336 25.6H11.7336C11.4392 25.6 11.2002 25.361 11.2002 25.0666C11.2002 24.7722 11.4392 24.5333 11.7336 24.5333H18.1336C18.428 24.5333 18.6669 24.7722 18.6669 25.0666C18.6669 25.361 18.428 25.6 18.1336 25.6ZM18.1336 21.3333H11.7336C11.4392 21.3333 11.2002 21.0944 11.2002 20.8C11.2002 20.5056 11.4392 20.2666 11.7336 20.2666H18.1336C18.428 20.2666 18.6669 20.5056 18.6669 20.8C18.6669 21.0944 18.428 21.3333 18.1336 21.3333ZM18.1336 18.1333H11.7336C11.4392 18.1333 11.2002 17.8944 11.2002 17.6C11.2002 17.3056 11.4392 17.0666 11.7336 17.0666H18.1336C18.428 17.0666 18.6669 17.3056 18.6669 17.6C18.6669 17.8944 18.428 18.1333 18.1336 18.1333ZM18.1336 13.8666H11.7336C11.4392 13.8666 11.2002 13.6277 11.2002 13.3333C11.2002 13.0389 11.4392 12.8 11.7336 12.8H18.1336C18.428 12.8 18.6669 13.0389 18.6669 13.3333C18.6669 13.6277 18.428 13.8666 18.1336 13.8666ZM18.1336 10.6666H11.7336C11.4392 10.6666 11.2002 10.4277 11.2002 10.1333C11.2002 9.8389 11.4392 9.59997 11.7336 9.59997H18.1336C18.428 9.59997 18.6669 9.8389 18.6669 10.1333C18.6669 10.4277 18.428 10.6666 18.1336 10.6666Z" fill="#F4F4F6"/>
    <path d="M7.467 5.33333H16.0003C17.1769 5.33333 18.1337 4.37653 18.1337 3.2V2.13333C18.1337 0.9568 17.1769 0 16.0003 0H7.467C6.29046 0 5.33366 0.9568 5.33366 2.13333V3.2C5.33366 4.37653 6.29046 5.33333 7.467 5.33333Z" fill="#F4F4F6"/>
    </svg>
    `;
    return <SvgXml style={style} xml={xml} width={width} height={height} />;
  },
);