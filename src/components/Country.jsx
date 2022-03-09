import React from 'react';
import Medal from './Medal';

const Country = (props) => {
  const { country, medals, onIncrement, onDecrement, onDelete, onSave, onReset, canDelete, canPatch } = props;

  const getMedalsTotal = (country, medals) => {
    let sum = 0;
    medals.forEach(medal => { sum += country[medal.name]; });
    return sum;
  }
  return (
    <div className="country">
      <div className="name">
        { country.name }
        <span className="badge">
          { getMedalsTotal(country, medals) }
        </span>
      </div>
      { medals.map(medal =>
        <Medal 
          key={ medal.id } 
          country={ country } 
          medal={ medal } 
          canPatch={ canPatch }
          onIncrement={ onIncrement } 
          onDecrement={ onDecrement } />
      ) }
      { canDelete && <button onClick={() => onDelete(country.id)}>delete</button> }
      <hr />
    </div>
  );
}

export default Country;
