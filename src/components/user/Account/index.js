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
        console.log("porps", props)

        this.state = {
            url:"",
            imgName:"",
            scale: 1,

            username: props.authUser.username,//eh prob don't need this in state
            profile: props.authUser.profile, //need this to access pfp url
            email: props.authUser.email,

            progress: 0,
            error: null,

        }

    }

    componentDidMount(){
       
    }
    //when user wants a new pfp
    //first upload into storage
    //get url of img in storage
    //put url into user in firestore db
    //can access photo url now thru authUser context
    onSubmit = (e) => {
        const {imgName} = this.state

        if (this.editor) {
        // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
        // drawn on another canvas, or added to the DOM.
        const imgBlob = this.editor.getImage().toBlob(blob => {
            const cuid = this.props.authUser.uid

            //take out .then() if uploadTask code fails?
            const uploadTask = this.props.firebase.storageRef().child(`users/${cuid}/profile`).put(blob)//.then(()=>this.setState({url:"", imgName:"",}))
            uploadTask.on('state-changed',
                (snapshot) => {
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    this.setState({progress})
                },
                (error) => {
                    this.setState({error})
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        this.props.firebase.user(this.props.authUser.uid).update({
                            profile: downloadURL
                        })
                        .then(()=>
                            this.setState({
                                profile: downloadURL,
                                url:"",
                                imgName:"",
                            }))
                    })
                }
            )
        })
    }

    e.preventDefault()
  }


  setEditorRef = (editor) => this.editor = editor

  render () {
    const {scale, profile, username, email, progress, error} = this.state

    //[252, 249, 244, 0.6]
    return (
        <div className="page">
            <div className="profile-cont">
                <div>
                    {profile? 
                       <img className="profile-circle" src = {profile}/>
                        : 
                        <div className="profile-circle">
                            <div className="empty-profile"></div>
                        </div>
                    }
                    <p>{progress}% uploaded</p>
                    <p>{error}</p>
                </div>
                <div className="info-col">
                    <div className="info-cont">
                        <div className="info-cont-desc magnus">username:</div>
                        <input 
                            className="max"
                            value = {username}
                        />
                    </div>
                    <div className="info-cont">
                        <div className="info-cont-desc magnus">email:</div>
                        <input 
                            className="max"
                            value = {email}
                        />
                    </div>
                </div>
            </div>
            
            <form onSubmit={this.onSubmit}>
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
            </div>
            <button type="submit">upload new profile</button>
            </form>
        </div>
        
    )
  }
}


const condition = authUser => !!authUser

export default compose(
    withFirebase,
    withAuthorization(condition),
) (MyEditor)
