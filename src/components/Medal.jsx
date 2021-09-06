import React from 'react';

const Medal = (props) => {
  const { medal, country, onIncrement, onDecrement } = props;
  return (
    <div className="medals">
      { medal.name } Medals: { country[medal.name].page_value }
      <button onClick={ () => onIncrement(country.id, medal.name) }>+</button>
      <button disabled={ country[medal.name].page_value === 0 } onClick={ () => onDecrement(country.id, medal.name) }>-</button>
    </div>
  );
}

export default Medal;
