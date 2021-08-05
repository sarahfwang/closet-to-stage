//don't use this page, everything's on ItemPage I think
//TODO: make images changeable/ editable/ croppable
import React, {Component} from 'react'
import {compose} from 'recompose'
import uuid from 'react-uuid'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCommentsDollar, faPlus, faTrash} from '@fortawesome/free-solid-svg-icons'

import {withFirebase} from '../../firebase';
import {withAuthorization} from '../../auth/Session'

import './itemupdate.scss'

class ItemUpdateForm extends Component {
  constructor(props){
    super(props)  
    
    const userID = this.props.firebase.currentUser().uid //well wait why do we need this? oh to edit, duh
  
    this.itemID = this.props.match.params.itemID //takes itemID from the Route in App

    console.log("this.", this.itemID)
    //console.log(cuid)
    this.state={
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
            style:'',
            isListed: false,  
        },
        userID: userID,

        indicies:[0,1,2,3,4,5], //purely for mapping purposes
        
        lowerCase:{},
       
        imgAddFiles:[],//this time, imgAddFiles only contains files of things TO BE ADDED

        imgAllUrls: [], //urls are just for show (so you can have all of them instead of j the ones being added)
        fbUrls:[], //fbUrls filled in compDidMount
        imgRefs:[],

        error: null,
        progress: 0,
    }
  }

  componentDidMount () {
    this.props.firebase.item(this.itemID).get() // change later?
    .then(doc => {
        this.setState({
            item: doc.data(),
            imgAllUrls: doc.data().fbUrls,
            fbUrls: doc.data().fbUrls,
            imgRefs: doc.data().imagesRef,
        }, () => console.log("state",this.state))
    })
  }

  onChange = event =>{
    this.setState({
        item:{
          ...this.state.item,
          [event.target.name]:event.target.value
        }, 
        //lowerCase is just for database purposes
        lowerCase:{
          ...this.state.lowerCase,
          [event.target.name]: event.target.value.toLowerCase()
        }
    }, () => console.log("onChange", this.state)) 
    
    
  }

  onSumbit = event =>{
    const {lowerCase, imgAddFiles, imgAllUrls, item, userID } = this.state

    event.preventDefault()

    console.log('start of upload')

    //add to items
    if(imgAllUrls.length === 0){
      this.setState({error:"please upload at least one image"})
    }
    else if(userID == null){
      this.setState({error:"user is null"})
    }
    else{
      const itemRef = this.props.firebase.item(this.itemID)

      this.props.firebase.updateItem(itemRef, item)
      .then(() => {
        //doc holds the item's info (no image urls yet)
        //uploadImage uploads imgs into firebase storage
        //and then updates img urls in firestore database 
        this.uploadImage(this.itemID)
      })
    } 
  }

  uploadImage = (id) =>{
    //need id for storing
    const {userID, imgAddFiles} = this.state

    console.log("doc.id:",id)

    //loop: loop thru all imgAddFiles
    //find imgFile.name => stoarge location
    imgAddFiles.forEach(imgFile => {
      //creates reference in storage for new photo

      //change this to a uuidTDOO
      const imagesRef = this.props.firebase.storageRef().child(`items/${id}/${imgFile.name}`)//file has name prop
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
          //urls of img in storage ==> in items in firestore database
          uploadTask.snapshot.ref.getDownloadURL()
            .then(downloadUrl => {
              const itemRef = this.props.firebase.item(id)
              this.props.firebase.updatefbUrls(downloadUrl, itemRef)
            })
            .then(this.onClear)
        }
      )
    })
  }

  handleImageAsFile = (e) =>{
    //uploads image file to state 
      const image = e.target.files[0]

      //creates temporary URL to store in state
      const url = URL.createObjectURL(image)

      console.log("url", url)

      this.setState(state => {

        const imgAddFiles = state.imgAddFiles.concat(image)
        const imgAllUrls = state.imgAllUrls.concat(url)

        return {
          ...state,
          imgAddFiles,
          imgAllUrls,
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

  //deleteImg will temporarily delete img url from state, but then delete from database...how though?
  deleteImg = (url) =>{
    const {fbUrls, imgRefs, imgAllUrls, imgAddFiles, } = this.state

    let i = imgAllUrls.indexOf(url)

    if(i >= fbUrls.length)//if it was a recently added URL, aka. not put in storage yet
    {
      imgAllUrls.splice(i, 1)
      imgAddFiles.splice(i-fbUrls.length, 1)

      console.log(imgAllUrls)
      console.log(imgAddFiles)

      this.setState({
        imgAllUrls,
        imgAddFiles,
      })
    }
    else{
      //must also tame the other lists
      //delete the fb url of it ( make a copy first)
      //delete the imgUrl of it
      //delete the storage with the name of the file
      //fbUrl list and imgRef list should be the same, correspond to the same
      fbUrls.splice(i,1)
      imgAllUrls.splice(i,1)

      const imgRefName = imgRefs[i]
      imgRefs.splice(i,1)

      const id = this.itemID

      const storageRef = this.props.firebase.storageRef().child(`items/${id}/${imgRefName}`)//file has name prop
      storageRef.delete().then(()=>{
        this.props.firebase.item(id).update({imagesRef: imgRefs, fbUrls})
      }).catch(err => {
        console.log(err)
      })

      

      this.setState({
        imgAllUrls,
        fbUrls,
        imgRefs
      })



    }

  }

  render(){
    const {item, images, error, progress, imgAllUrls, indicies} = this.state;
    const colors = ["red", "orange", "yellow", "green", "blue", "purple", "tan", "white", "black"]
    const types = ["leotard", "dress", "pant"] //TODO: add something that will write a new type if it is not listed

    console.log("UID", uuid(), )
    console.log("UID", uuid(), )

    return(
        <div className="list-page">
      <h2> create listing </h2>
      
      <form onSubmit={this.onSumbit}>
        <div className ="form-container">
          <div className="img-col">
            <div className="subheader-desc">
              images
            </div>
            <div className="img-gallery">
                  {indicies.map(i => (
                    imgAllUrls[i]?
                    //if there is an imgUrl for an index 0-5, then show the img
                    //img-cont: for aspect ratio
                    //inner-cont: for img that fills up width and height of container

                    <div className="img-cont" key={imgAllUrls[i]}>
                      <div className="inner-cont ">
                        <img src={imgAllUrls[i]}/>
                      </div>
                      <div className="inner-cont trash-button-cont">
                            <button className="trash-button" onClick ={()=>this.deleteImg(imgAllUrls[i])}>
                              <FontAwesomeIcon className = "trash-icon" icon={faTrash}/>
                            </button>
                      </div>   
                      </div>
                    :(
                      //if not, put a placeholder
                      i == imgAllUrls.length?
                      //if the placeholder comes after the last shown image
                      //put add image icon
                      <div className="img-cont" key={i}>
                        <div className="inner-cont">
                          <div className="add-img-cont">
                            <label className = "img-upload">
                              <FontAwesomeIcon icon={faPlus}/>
                              <input
                              type="file"
                              accept="image/*"
                              onChange ={this.handleImageAsFile}
                              />
                            </label>
                          </div>
                        </div>
                      </div>:
                      //otherwise leave it blank
                      <div className="img-cont" key={i}>
                      <div className="inner-cont">
                        <div className="img-placeholder"></div>
                      </div>
                    </div>)
                  ))}

              </div>

          </div>
            

            <div className="info-col">
              <div className="subheader-desc">
                details
              </div>

              <div className="info-cont"> {/* info container */}
                <div className="info-cont-desc">{/* left description for info cont*/}
                  <div className="magnus">
                      title
                  </div>
                  <div className="mini">
                      include words others would search for
                  </div>
                </div>
                <input
                  className = "in-item-name max"
                  name="itemName"
                  value={item.itemName}
                  type="text"
                  onChange={this.onChange}
                  placeholder="*"
                  maxLength="30"
                  required
                />
              </div>
              
              <div className="info-cont">
              <div className="info-cont-desc">
                  <div className="magnus">
                      price
                  </div>
                </div>
                
                  <label htmlFor="price" className="in-price-label maior">$</label>
                  <input
                    className="in-price maior"
                    name="price"
                    value={item.price}
                    type="number"
                    min ="0.00"
                    max="10000.00"
                    step="1"
                    onChange={this.onChange}
                    placeholder="*00.00"
                  />
                </div>
              
              
              <div className="info-cont">
                <div className="info-cont-desc">
                  <div className="magnus">
                      brand
                  </div>
                </div>
                <input
                  className="in-brand parvus"
                  name="brand"
                  value={item.brand}
                  type="text"
                  onChange={this.onChange}
                  placeholder="brand"
                />
              </div>

              <div className="info-cont">
                <div className="info-cont-desc">
                  <div className="magnus">
                      size
                  </div>
                  <div className="mini">
                      if NA, give your street clothing size
                  </div>
                </div>
                <input
                  className="in-size maior"
                  name="size"
                  value={item.size}
                  type="text"
                  onChange={this.onChange}
                  placeholder="*e.g. 'm' or '4'"
                  list="sizes"
                />

                <datalist id="sizes">
                  <option>xxs</option>
                  <option>xs</option>
                  <option>s</option>
                  <option>m</option>
                  <option>l</option>
                  <option>xl</option>
                  <option>xxl</option>
                  <option>0</option>
                  <option>2</option>
                  <option>4</option>
                  <option>6</option>
                  <option>8</option>
                  <option>10</option>
                  <option>12</option>
                  <option>14</option>
                </datalist>
              </div>

              <div className="info-cont">{/*beware 'notes'*/}
                <div className="info-cont-desc">
                  <div className="magnus">
                      quantity
                  </div>
                </div>
                <input
                  name="quantity" //make this have distinct numbers
                  value={item.quantity}
                  type="number"
                  onChange={this.onChange}
                  placeholder="quantity"
                />
              </div>

              <div className="info-cont">{/*beware 'notes'*/}
                <div className="info-cont-desc">
                  <div className="magnus">
                      description
                  </div>
                </div>
                <textarea
                  className="in-description parvus"
                  name="description"
                  value={item.description}
                  type="text"
                  onChange={this.onChange}
                  placeholder="add notes here..."
                />
              </div>


              <div className="subheader-desc"> optional </div>
              <span className="minor">(helps others find your listing)</span>

              <div className="info-cont">{/*beware 'notes'*/}
                <div className="info-cont-desc">
                  <div className="magnus">
                      type
                  </div>
                </div>
                <input
                  name="type" //make this have distinct numbers
                  value={item.type}
                  type="text"
                  onChange={this.onChange}
                  placeholder="type"
                  list="types"
                  autoComplete="off"
                />
                <datalist id="types">
                  {types.map(type => 
                    <option>{type}</option>)}
                </datalist>
              </div>

              <div className="info-cont">{/*beware 'notes'*/}
                <div className="info-cont-desc">
                  <div className="magnus">
                      style
                  </div>
                </div>
                <input
                  name="style" //make this have distinct numbers
                  value={item.style}
                  type="text"
                  onChange={this.onChange}
                  placeholder="style"
                  list="styles"
                  autoComplete="off"
                />
                <datalist id="styles">
                    <option>contemporary</option>
                    <option>ballet</option>
                    <option>jazz</option>
                    <option>hip-hop</option>
                    <option>tap</option>
                </datalist>
              </div>
          
                
              <div className="info-cont">
                <div className="info-cont-desc">
                  <div className="magnus"> color</div>
                </div>
                <div className="color-selector">
                  {colors.map((color, index) => //loops through color array
                      <div key={index}>
                        <label className="color-select" for={color}>
                          <input type="radio" id={color} name="color" value={color} onChange={this.onChange}/>
                          <span className={`${color}-select`}></span> {/*square of color */}
                        </label> 
                      </div>
                    )}
                </div>
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
)(ItemUpdateForm) //need to study compose

//export default withFirebase(Form) //deosn't stay logged in