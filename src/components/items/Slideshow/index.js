import React, {useState, useEffect} from 'react'
import './slideshow.scss'

class Slideshow extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            imgSources: [],
            index: 0,
        }
    }
   
    componentDidMount(){

        console.log(this.props)
        
        this.setState({
            imgSources: this.props.imgSources,
        }, ()=>{console.log(this.state)})
       

    }
   

    plusSlides = (plus) => {
        //updates the index of the slideshow
        const {index, imgSources} = this.state;

        let change = index + plus
        
        if(change < 0)
            this.setState({index: change + imgSources.length})
        else{
            this.setState({index: change%imgSources.length})
        }
        
        
    }

    render(){
        const {index, imgSources} = this.state

        return(
            <div className="slideshow">
                <div className="slide fade">
                    <img src = {imgSources[index]} className="fade"/>
                    <div class="numbertext"> {index + 1} / {imgSources.length}</div>
                    <a className="prev" onClick = {() => {this.plusSlides(-1)}}>&#10094;</a>
                    <a className="next" onClick = {() => {this.plusSlides(1)}}>&#10095;</a>
                </div>
    
                
                <div>
                    <div className = "preview-bar">
                        { //dots
                            imgSources.map((url, index) => 
                                <div>
                                    <div className = "preview-img-cont fade" onClick ={()=>{this.setState({index})}}>
                                        <img src = {url}/>
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
        
}

export default Slideshow