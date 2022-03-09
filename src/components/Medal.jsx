import React from 'react';

const Medal = (props) => {
  const { medal, country, onIncrement, onDecrement, canPatch } = props;
  return (
    <div className="medals">
      { medal.name } Medals: { country[medal.name] }
      { canPatch && 
        <React.Fragment>
          <button onClick={ () => onIncrement(country.id, medal.name) }>+</button>
          <button disabled={ country[medal.name] === 0 } onClick={ () => onDecrement(country.id, medal.name) }>-</button>
        </React.Fragment>
      }
    </div>
  );
}

export default Medal;
