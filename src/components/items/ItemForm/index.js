//don't use this page, everything's on ItemPage I think
//TODO: make images changeable/ editable/ croppable
import React, {Component} from 'react'
import {compose} from 'recompose'

import { withFirebase } from '../../firebase';
import {withAuthorization} from '../../auth/Session'

import './itemform.scss'
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
  lowerCase:{

  },
  images: {
    imageAsFile:'',
    imageAsUrl:'',
  },
  imgFiles: [],
  imgUrls: [],
  fbUrls:[],
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

    console.log(this.props.firebase.getDb())

    
  }

  onChange = event =>{
    
    this.setState({
        item:{
          ...this.state.item,
          [event.target.name]:event.target.value
        }, 
        lowerCase:{
          ...this.state.lowerCase,
          [event.target.name]: event.target.value.toLowerCase()
        }
    }) 
    
    console.log(this.state)
  }

  onSumbit = event =>{
    const {lowerCase, userID, imgFiles } = this.state
    event.preventDefault()

    console.log('start of upload')

    //add to items
    if(imgFiles.length === 0){
      this.setState({error:"please select at least one image"})
      console.error('please select at least one image')
    }
    else if(userID == null){
      this.setState({error:"user is null"})
    }
    else{
      this.props.firebase.doAddItem({...lowerCase, userID, isListed: true, fbUrls:[]}) //add images as urls!!!
      .then(doc => {
        //doc is the items
        this.uploadImage(doc, doc.id)

        const cuid = this.props.firebase.cuid()

        //add to user
        this.props.firebase.user(cuid).get()
        .then(user=>{
          if(!user.data().userItems)
            this.props.firebase.user(cuid).update({
              //add the item id to the userItems list
              userItems: [doc.id]
            })
          else{
            let userItems = user.data().userItems.concat(doc.id)
            console.log("userItems", userItems)
            
            this.props.firebase.user(cuid).update({
              userItems,
            })
          }

        })
      

    })

    //add to user
      
    }
    
  }

  uploadImage = (ref, id) =>{
    const {userID, imgFiles} = this.state

    console.log("doc.id:",id)

    //loop: going to have to loop thru imgFiles
    //find imgFile.name

    imgFiles.map(imgFile => {
      //file has name prop
      const imagesRef = this.props.firebase.storageRef().child(`users/${userID}/items/${id}/${imgFile.name}`)

      const uploadTask = imagesRef.put(imgFile)

      //uploadTask.on has  callbacks: next, error, complete
      uploadTask.on('state-changed',
        (snapshot) => {

          var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) 
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

              const itemRef = this.props.firebase.item(id)

              console.log(downloadUrl)


              this.props.firebase.updatefbUrls(downloadUrl, itemRef)
            })
            
            .then(this.onClear)

        }
      )

    })

  }

  onClear = () =>{
    this.setState({...INITIAL_STATE})
  }

  handleImageAsFile = (e) =>{
    //uploads image file to state 
      const image = e.target.files[0]

      const url = URL.createObjectURL(image)

      /* this.setState({
        images:{
          ...this.state.images,
          imageAsFile: image,
        }
      }) */

      this.setState(state => {
        const imgUrls = state.imgUrls.concat(url)
        const imgFiles = state.imgFiles.concat(image)

        return {
          ...state,
          imgFiles,
          imgUrls,
        }
      })

      
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
    const {item, images, error, progress, imgUrls} = this.state;
    const colors = ["red", "orange", "yellow", "green", "blue", "purple", "tan", "white", "black"]
    

    return(
      <div>
      <form onSubmit={this.onSumbit}>
        <div className ="form-container">
            <div className="img-col">
              
                {imgUrls.map(url => 
                    <div className="img-cont">
                        <img src={url}/>
                    </div>
                )}
                {/*TODO: add a title called: cover image */}
                <div className="img-cont add-cont">
                  <div className="add-file-cont">
                    
                    <label className = "img-upload">
                      +
                      <input
                      type="file"
                      accept="image/*"
                      onChange ={this.handleImageAsFile}
                      />
                    </label>
                    
                  </div>
              </div>
            </div>

            <div className="info-col">
              <div className = "info-item-name info-cont">
                <input
                  name="itemName"
                  value={item.itemName}
                  type="text"
                  onChange={this.onChange}
                  placeholder="Item Name*"
                  required
                />
              </div>
              <div className ="info-brand-name info-cont">
                <input
                  name="brand"
                  value={item.brand}
                  type="text"
                  onChange={this.onChange}
                  placeholder="brand*"
                  
                />
              </div>
              <div className="info-price info-cont">
                <label htmlFor="price">$</label>
                <input
                  name="price"
                  value={item.price}
                  type="text"
                  onChange={this.onChange}
                  placeholder="00.00*"
                 
                />
              </div>
              <div className="info-size info-cont">
                <input
                  name="size"
                  value={item.size}
                  type="text"
                  onChange={this.onChange}
                  placeholder="size, ex: M, 2*"
             
                />
              </div>
              <div className="info-description info-cont">{/*beware 'notes'*/}
                <textarea
                  name="description"
                  value={item.description}
                  type="text"
                  onChange={this.onChange}
                  placeholder="description*"
      
                />
              </div>
              
                <input
                  name="type"
                  value={item.type}
                  type="text"
                  onChange={this.onChange}
                  placeholder="type"
                />
          
                <input
                  name="quantity" //make this have distinct numbers
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
            </div>
        </div> {/*end of form-container */}
        <div>
                <button type= "submit" >
                  Add
                </button>

                <button onClick={this.onClear}>
                  Clear
                </button>

                <p>{error && `${error}`}</p>
              </div>
      </form>

      <p>{progress}% uploaded</p>
      
     

      

   



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