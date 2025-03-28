import React from 'react';
import { useDispatch } from 'react-redux';
import { navigateTo } from '../../store/routerSlice';

export default function Link({ href, className, style, children }) {
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.preventDefault();
    dispatch(navigateTo(href));
  };

  return (
    <a 
      href={href}
      onClick={handleClick}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
} 