import React from 'react';
import './Card.css';

const Card = ({
  children,
  padding = 'medium',
  shadow = 'md',
  className = '',
  onClick
}) => {
  const classNames = [
    'card',
    `card--padding-${padding}`,
    `card--shadow-${shadow}`,
    onClick && 'card--clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
