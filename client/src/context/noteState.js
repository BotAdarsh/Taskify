import React from 'react';
import noteContext from './noteContext';

const noteState = (props) =>{
    const state = {
        "name":"Adarsh Chauhan",
        "Class":"5B"
    }
    return(
        <noteContext.Provider   value = {state}>
            {props.children}
        </noteContext.Provider>
    )
}

export default noteState;