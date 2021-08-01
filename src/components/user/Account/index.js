/* import React, {useState} from 'react'

import {compose} from 'recompose'

import {withFirebase} from '../../firebase'
import {withAuthorization} from '../../auth/Session'
import AvatarEditor from 'react-avatar-editor'

const Account = (props) => {
    const [avatarFile, setAvatarFile] = useState()
    const [avatarUrl, setAvatarUrl] = useState()
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)

    

    const onClickSave = (event) => {
       
        const canvas = this.getImage()
        
        const url = URL.createObjectURL(canvas)

        console.log("img", canvas)
        console.log("url",url)

       
    }

  

    return (
        <div>
            <div>
                <p>username: {props.authUser.username}</p>
                <p>email: {props.authUser.email}</p>
            </div>
            <div>
                upload avatar:
                <input 
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange = {(e)=> {
                        const image = e.target.files[0]
                        const url = URL.createObjectURL(image)
                        
                        //setAvatarFile(image)
                        setAvatarUrl(url)

                        //console.log(image)
                    }}
                />
            </div>  
            <AvatarEditor 
                image = {avatarUrl}
                borderRadius = {100}
                width = {200}
                height = {200}
                scale = {scale}
                rotate = {rotate}
            />
            <input type="range" name="scale" step="0.01" min="1" max="2" defaultValue = {scale} onChange = {e=>setScale(parseFloat(e.target.value))}style={{width: "8em"}}/>
            <label htmlFor="scale">zoom</label>

            <button onClick ={()=>setRotate(rotate+90)}>rotate</button>
            <button onClick = {onClickSave}>Save </button>
        </div>
    )
}

const condition = authUser => !! authUser

export default compose(
  withFirebase,
  withAuthorization(condition),
)(Account) 


/* import {compose} from 'recompose'

import {withFirebase} from '../../firebase'
import {withAuthorization} from '../../auth/Session'

export default compose(
  withFirebase,
  withAuthorization(condition),
)(Account)  */

import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import { compose } from 'recompose'

import {withFirebase} from '../../firebase'
import {withAuthorization} from '../../auth/Session'
import './account.scss'

class MyEditor extends React.Component {

    constructor(props){
        super(props)
        //props.authUser should contain a url to the profile picture
        console.log("authuser", props.authUser)
        console.log("profile", props.authUser.profile)

        this.state = {
            url:"",
            imgName:"",
            scale: 1,

            authUser: props.authUser
        }

    }

    componentDidMount(){
       
    }
    
    onSubmit = () => {
        const {imgName} = this.state

        if (this.editor) {
        // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
        // drawn on another canvas, or added to the DOM.
        const imgBlob = this.editor.getImage().toBlob(blob => {
            const cuid = this.props.authUser.uid

            this.props.firebase.storageRef().child(`users/${cuid}/profile`).put(blob)
            .then(()=>this.setState({url:"", imgName:"",}))
        })
    }
  }


  setEditorRef = (editor) => this.editor = editor

  render () {
    const {scale, authUser} = this.state

    //[252, 249, 244, 0.6]
    return (
        <div className="page">
            <div className="profile-cont">
                <div>
                    {authUser.profile? 
                        <div className="profile-circle">

                        </div>: 
                        <div className="profile-circle">
                            <div className="empty-profile"></div>
                        </div>
                    }
                </div>
                <div className="info-col">
                    <div className="info-cont">
                        <div className="info-cont-desc magnus">username:</div>
                        <input 
                            className="max"
                            value = {authUser.username}
                        />
                    </div>
                    <div className="info-cont">
                        <div className="info-cont-desc magnus">email:</div>
                        <input 
                            className="max"
                            value = {authUser.email}
                        />
                    </div>
                </div>
            </div>
            
            <div className="avatar-cont">
                <AvatarEditor
                    ref={this.setEditorRef}
                    image={this.state.url}
                    width={250}
                    height={250}
                    border={50}
                    color={[30, 30, 30, 0.7]}
                    scale={scale}
                    borderRadius = {175}
                />
                <input 
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange = {(e)=> {
                        const image = e.target.files[0]
                        const url = URL.createObjectURL(image)
                        const imgName = image.name
            
                        this.setState({url, imgName}, ()=>console.log(this.state.url))
                    }}
                />
                <input type="range" name="scale" step="0.01" min="1" max="2" defaultValue = {scale} onChange = {e=> this.setState({scale: parseFloat(e.target.value)})}style={{width: "8em"}}/>
                <label htmlFor="scale">zoom</label>

                <button onClick = {this.onSubmit}>try me</button>
            </div>
        </div>
        
    )
  }
}


const condition = authUser => !!authUser

export default compose(
    withFirebase,
    withAuthorization(condition),
) (MyEditor)
