import React from 'react';
import './stateIndicator.css';

const StateIndicator = ({ state }) => {
  const stateColors = {
    IN_WORK: '#2196F3',
    PROTOTYPE_IN_WORK: '#FF9800',
    PROTOTYPE: '#9C27B0',
    RELEASED: '#4CAF50',
    OBSOLETE: '#757575'
  };

  const stateLabels = {
    IN_WORK: 'In Work',
    PROTOTYPE_IN_WORK: 'Prototype In Work',
    PROTOTYPE: 'Prototype',
    RELEASED: 'Released',
    OBSOLETE: 'Obsolete'
  };

  return (
    <span 
      className="state-indicator"
      style={{ backgroundColor: stateColors[state] }}
    >
      ● {stateLabels[state]}
    </span>
  );
};

export default StateIndicator;
