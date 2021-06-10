import React, {useState, useEffect} from 'react'
import './slideshow.scss'

//props comes from item
const Slideshow = (props) => {
    const[imgSources, setImgSources] = useState([])
   
    const [index, setIndex] = useState(0)

    const plusSlides = (plus) => {
        //updates the index of the slideshow
        let change = index + plus
        console.log("plus")
        
        if(change < 0)
            setIndex(change + imgSources.length)
        else{
            setIndex(change%imgSources.length)
        } 
       
    }

    useEffect(() => {
        setImgSources(props.imgSources)
        console.log(imgSources)
    },[props.imgSources, imgSources])

        return(
        <div className="slideshow">
            <div className="slide fade">
                <img src = {imgSources[index]} alt = ""/>
                <div className="numbertext"> {index + 1} / {imgSources.length}</div>
                <p className="prev" onClick = {() => {plusSlides(-1)}}>&#10094;</p>
                <p className="next" onClick = {() => {plusSlides(1)}}>&#10095;</p>
            </div>

            
            <div>
                <div className = "preview-bar">
                    { //dots
                        imgSources.map((url,index) => 
                            <div key = {index}>
                                <div className = "preview-img-cont" onClick ={()=> {
                                    setIndex(index)
                                }}>
                                    <img src = {url} alt = ""/>
                                </div> 
                            </div>

                           
                        )
                    }
                </div>
    
             </div>
             {/* <div className = "img-col">
                <div className = "item-img-cont">
                    <div className="main-img-cont">
                        <img src = {imgSources[index]}/>

                        
                        <div class="numbertext"> {index + 1} / {imgSources.length}</div>
                        <a className="prev" onClick = {() => {plusSlides(-1)}}>&#10094;</a>
                        <a className="next" onClick = {() => {plusSlides(1)}}>&#10095;</a>
                    </div>
                    
                    <div className="side-img-cont">
                        {
                        imgSources.map(url => 
                            <div>
                                <div className = "img-prev">
                                    <img src = {url}/>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div> */}
          
             
            

        </div>
    )
}

export default Slideshow