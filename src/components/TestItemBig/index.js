import React from 'react'
import { getDisplayName } from 'recompose'
import './testitembig.scss'

import { Slide } from 'react-slideshow-image'
import 'react-slideshow-image/dist/styles.css'

import Slideshow from '../items/Slideshow'

class TestItemBig extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            urls: [],
            testInput:"",
            optInput:"",
        }
    }

    componentDidMount(){
        
        const imgInput = document.querySelector('.img-uploads')
        const preview = document.querySelector('.preview')

        this.setState({
            imgInput,
            preview
        })

        imgInput.style.opacity = 0;
        
        imgInput.addEventListener('change', this.updateImageDisplay)
            
    }


    updateImageDisplay = () => {
        const{imgInput, preview} = this.state

        while(preview.firstChild) {
            preview.removeChild(preview.firstChild) //???
        }

        const curFiles = imgInput.files
        if(curFiles.length == 0){
            const para = document.createElement('p')
            para.textContent = 'No files currently selected'
            preview.appendChild(para)
        } else {
            const list = document.createElement('ol')
            preview.appendChild(list)

            for(const file of curFiles){
                const listItem = document.createElement('li')
                const para = document.createElement('p')
                if(file){
                    para.textContent = `File name: ${file.name}`

                    const img  = document.createElement('img')
                    img.src = URL.createObjectURL(file)
                    console.log(img.src)

                    listItem.appendChild(img)
                    listItem.appendChild(para)
                } else{
                    para.textContent = `File name: ${file.name}`
                    listItem.appendChild(para)
                }

                list.appendChild(listItem)
            }
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    render(){
        const {urls} = this.state;
        const words = ["apple","banana","carrot"]
        const ranks = [1,9,3]

        const slideImages = [
            "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
        ]
        return(
            <div>
                <div className="test-i-b-page">
                    <div className="img-col">
                        <div className="img-cont add-cont">
                            <div className="button-cont">
                                <button>Add photos</button>
                            </div>
                        </div>
                        {urls.map(url => 
                            <div className="img-cont">
                                <img src={url}/>
                            </div>
                        )}
                        
                      
                    </div>
                    <div className="info-col"> 
                        <div className="info-item-name info-cont">
                            <input 
                                type = "text"
                                placeholder="Enter item name"
                                autoComplete="off"
                            ></input>
                        </div>
                        <div className="info-brand-name info-cont">
                            <input 
                                type = "text"
                                placeholder="Enter brand"
                                autoComplete="off"
                            ></input>
                        </div>  
                        <div className="info-price info-cont">
                            <label>$</label>
                            <input 
                                type = "text"
                                placeholder="Enter price"
                                autoComplete="off"
                            ></input>
                        </div>
                        <div className="info-size info-cont">
                            <input 
                                type = "text"
                                placeholder="Enter size"
                                autoComplete="off"
                            ></input>
                        </div>
                        <div className="info-notes info-cont">
                            <textarea 
                                type = "text"
                                placeholder="Enter notes"
                                autoComplete="off"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="img-test">
                    <form>
                        <div>
                            <label for="img-uploads">Choose images to upload</label>
                            <input type="file" id="img-uploads"  className="img-uploads" acccept="image/*"/>
                        </div>
                        <div className="preview">
                            <p>No files currently selected for upload</p>
                        </div>
                        <div>
                            <button>Submit</button>
                        </div>
                    </form>
                </div>

                <div>
                    {words.map((word, index) => (
                        <p>{word}, {ranks[index]}</p> 
                    ))}
                </div>

                <form>
                    start of form
                    <div>
                        <input
                            type = "text"
                            name="testInput"
                            value = {this.state.testInput}
                            onChange = {this.onChange}
                            required = "required"
                        />
                    </div>
                    
                    <input
                        type = "text"
                        name="optInput"
                        value = {this.state.optInput}
                        onChange = {this.onChange}
                        
                    />
                <button type="submit">
                    sumbit
                </button>
                </form>

                {/*slideshow */}
                <Slideshow />

               
            </div>
        )
       
        

    }
    
}
export default TestItemBig