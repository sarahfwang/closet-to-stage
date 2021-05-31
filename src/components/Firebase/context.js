import React from 'react'

const FirebaseContext = React.createContext(null)

export const withFirebase = Component => props => (
    <FirebaseContext.Consumer>
        {value => <Component {...props} firebase ={value}/>}
    </FirebaseContext.Consumer>
)
export default FirebaseContext