import React, {useState} from 'react'
import './slideshow.scss'

const Slideshow = () => {
    const imgSources = ["https://upload.wikimedia.org/wikipedia/commons/c/c3/NGC_4414_%28NASA-med%29.jpg",
        "https://media.nationalgeographic.org/assets/photos/000/290/29094.jpg",
        "https://images.ctfassets.net/hrltx12pl8hq/3MbF54EhWUhsXunc5Keueb/60774fbbff86e6bf6776f1e17a8016b4/04-nature_721703848.jpg?fit=fill&w=480&h=270"]
   
    const [index, setIndex] = useState(0)

    const plusSlides = (plus) => {
        //updates the index of the slideshow
        let change = index + plus
        
        if(change < 0)
            setIndex(change + imgSources.length)
        
        setIndex(change%imgSources.length)
    }

    const currentSlide = (curr) => {
        
    }
        return(
        <div className="slideshow">
            <div className="slide fade">
                <img src = {imgSources[index]}/>
                <div class="numbertext"> {index + 1} / {imgSources.length}</div>
            </div>

            <a className="prev" onClick = {() => {plusSlides(-1)}}>&#10094;</a>
            <a className="next" onClick = {() => {plusSlides(1)}}>&#10095;</a>

            
            { //dots
                imgSources.map((element, index) =>  <span className="dot" onClick={() => {setIndex(index)}}></span>)
            }
         

        </div>
    )
}

export default Slideshow