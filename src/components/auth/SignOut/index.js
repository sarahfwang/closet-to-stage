import React from 'react'
import {withFirebase} from '../../firebase'

import "./signout.css"
const SignOutButton = (props) =>{ //can also put ({firebase})

    return(
        <div className="sign-out">
            <button onClick={()=>{props.firebase.doSignOut(); console.log("hi")}}> 
                SignOut
            </button>
        </div>
    )
}

export default withFirebase(SignOutButton)