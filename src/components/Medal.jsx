import React from 'react';

const Medal = (props) => {
  const { medal, country, onIncrement, onDecrement } = props;
  return (
    <div className="medals">
      { 
        ( country[medal.name].page_value !== country[medal.name].saved_value) ?
          <span className="delta">{medal.name} Medals: {country[medal.name].page_value}</span>
        :
          <span>{medal.name} Medals: {country[medal.name].page_value}</span>
      }
      <button onClick={ () => onIncrement(country.id, medal.name) }>+</button>
      <button disabled={ country[medal.name].page_value === 0 } onClick={ () => onDecrement(country.id, medal.name) }>-</button>
    </div>
  );
}

export default Medal;
