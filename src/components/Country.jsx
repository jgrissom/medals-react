import React from 'react';
import Medal from './Medal';

const Country = (props) => {
  const { country, medals, onIncrement, onDecrement, onDelete, onSave, onReset, canDelete, canPatch } = props;

  const getMedalsTotal = (country, medals) => {
    let sum = 0;
    medals.forEach(medal => { sum += country[medal.name].page_value; });
    return sum;
  }
  const renderSaveButton = () => {
    let unsaved = false;
    medals.forEach(medal => {
      if (country[medal.name].page_value !== country[medal.name].saved_value) {
        unsaved = true;
      }
    });
    return unsaved;
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
      { renderSaveButton() ?
        <React.Fragment>
          <button style={{marginLeft:'8px'}} onClick={ () => onSave(country.id) }>save</button>
          <button style={{marginLeft:'8px'}} onClick={ () => onReset(country.id) }>reset</button>
        </React.Fragment>
        :
        canDelete && <button onClick={() => onDelete(country.id)}>delete</button>
      }
      <hr />
    </div>
  );
}

export default Country;
