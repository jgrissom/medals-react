import React from 'react';

const Medal = (props) => {
  const { medal, country, onIncrement, onDecrement } = props;
  return (
    <div className="medals">
      { medal.name } Medals: { country[medal.name] }
      <button onClick={ () => onIncrement(country.id, medal.name) }>+</button>
      <button disabled={ country[medal.name] === 0 } onClick={ () => onDecrement(country.id, medal.name) }>-</button>
    </div>
  );
}

export default Medal;
