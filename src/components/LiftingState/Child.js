import React from 'react'

const Child = (props) => {
    return(
        <div>
            <p>child count: {props.count}</p>
            <button onClick={props.handleCountChange}>increase</button>
        </div>
    )
}

export default Child