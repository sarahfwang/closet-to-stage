//don't use this page, everything's on ItemPage I think

import React, {Component} from 'react'
import {compose} from 'recompose'

import { withFirebase } from '../../firebase';
import {withAuthorization} from '../../auth/Session'

import './itemform.css'
//TODO: HANDLE ERRORS

const INITIAL_STATE={
  item:{
    itemName:'',
    type:'', //turn into a suggester input later
    style:'',
    description:'',
    color:'',
    size:'',
    quantity:'',
    brand:'',
    price:'',
    isListed: false,  
  },
  userID: null,
  images: {
    imageAsFile:'',
    imageAsUrl:'',
  },
  error: null,
  progress: 0,
}

class Form extends Component {
  constructor(props){
    super(props)  
    
    let cuid = this.props.firebase.currentUser().uid
    //console.log(cuid)
    this.state={...INITIAL_STATE, userID: cuid}

    console.log(this.state)
  }

  componentDidMount () {
    console.log(this.props.firebase.currentUser().uid)
  }

  onChange = event =>{
    
    this.setState({
        item:{
          ...this.state.item,
          [event.target.name]:event.target.value
        } 
    }) 
    
    console.log(this.state)
  }

  onSumbit = event =>{
    const { item, userID, images: {imageAsFile} } = this.state
    event.preventDefault()

    console.log('start of upload')

    if(imageAsFile === ''){
      this.setState({error:"not an image file"})
      console.error('not an image file')
    }
    else{
      this.props.firebase.doAddItem({...item, imageAsUrl:'', userID, isListed: true})
      .then(doc => {
        this.uploadImage(doc, doc.id)
      })
    }
    
  }

  uploadImage = (ref, id) =>{
    const {userID, images: {imageAsFile}} = this.state

    console.log("doc.id:",id)

    const imagesRef = this.props.firebase.storageRef().child(`users/${userID}/items/${id}/${imageAsFile.name}`)

    const uploadTask = imagesRef.put(imageAsFile)
    
    //uploadTask.on has three callbacks: next, error, complete
      uploadTask.on('state-changed',
        (snapshot) => {

          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 
          this.setState({progress})

          console.log(snapshot)
        }, (error) => {

          //handle errors
          this.setState({error})
          console.log(error)
        }, () => {
          //once complete

          uploadTask.snapshot.ref.getDownloadURL()
            .then(downloadUrl => {
              
              this.setState({ //fixed mistake: this.state.images
                images:{
                  ...this.state.images,
                  imageAsUrl: downloadUrl,
                }
              })

              console.log('File available at', this.state.images.imageAsUrl)
            })
            .then(()=>{
              const imageAsUrl = this.state.images.imageAsUrl

              ref.update({imageAsUrl})
                .then(()=>{
                  console.log("updated firestore imageAsUrl")
                })

            })
            .then(this.onClear)

        }
      )
    
  }

  onClear = event =>{
    this.setState({...INITIAL_STATE})
  }

  handleImageAsFile = (e) =>{
    //uploads image file to state 
      const image = e.target.files[0]

      this.setState({
        images:{
          ...this.state.images,
          imageAsFile: image,
        }
      })

      //preview image
      var reader = new FileReader();
      reader.onload = () => {
        var output = document.getElementById('preview_img')
        output.src = reader.result
      }
  
      reader.readAsDataURL(e.target.files[0])
      
  }

  previewImg = (e) => {
    var reader = new FileReader();
    reader.onload = () => {
      var output = document.getElementById('preview_img')
      output.src = reader.result
    }

    reader.readAsDataURL(e.target.files[0])

  }

  render(){
    const {item, images, error, progress} = this.state;
    const colors = ["red", "orange", "yellow", "green", "blue", "purple", "tan", "white", "black"]

    return(
      <div>
      <form>
        <div className ="form-container">
          <div className="row">

            <div className="col-img">
              <h1>hi</h1>
            </div>

            <div className="col-notes">
              <input
                className="itemName"
                value={item.itemName}
                type="text"
                onChange={this.onChange}
                placeholder="Item Name"
              />
              <label htmlFor="price">$</label>
                <input
                  name="price"
                  value={item.price}
                  type="text"
                  onChange={this.onChange}
                  placeholder="00.00"
                />
                <input
                  className="description"
                  value={item.description}
                  type="text"
                  onChange={this.onChange}
                  placeholder="description"
                />
                <input
                  className="type"
                  value={item.type}
                  type="text"
                  onChange={this.onChange}
                  placeholder="type"
                />
          
                <input
                  className="brand"
                  value={item.brand}
                  type="text"
                  onChange={this.onChange}
                  placeholder="brand"
                />
            
                <input
                  className="quantity" //make this have distinct numbers
                  value={item.quantity}
                  type="text"
                  onChange={this.onChange}
                  placeholder="quantity"
                />
                <div className="color-selector">
              
                  {colors.map(color => 
                    <div>
                      <label htmlFor={color}>
                        <input type="radio" id={color} name="color" value={color} onChange={this.onChange}/>
                        <span className={`${color}-select`}></span>
                      </label>
                </div>

                )}
              </div>
                <input
                name="size"
                value={item.size}
                type="text"
                onChange={this.onChange}
                placeholder="size, ex: M, 2"
              />
            
                <input
                  type="file"
                  accept="image/*"
                  onChange ={this.handleImageAsFile}
                />
              </div>

          </div>

          <div className="row">
            <button onClick={this.onSumbit}>
              Add
            </button>

            <button onClick={this.onClear}>
              Clear
            </button>

            <p>{error && `${error}`}</p>
          </div>

        </div> {/*end of form-container */}
        
      </form>

      <p>{progress}% uploaded</p>
      {/*images.imageAsUrl?<img src={images.imageAsUrl} alt="image tag"/> : <h1></h1>*/}
      <h1>test</h1>

      preview
      <input type="file" accept="image/*" onChange={this.previewImg}/>
      <img id="preview_img"/>
      </div>
      
      )
  }
}
const condition = authUser => !! authUser

export default compose(
  withFirebase,
  withAuthorization(condition), //somehow this fixed my staying logged in error???
)(Form) //need to study compose

//export default withFirebase(Form) //deosn't stay logged in