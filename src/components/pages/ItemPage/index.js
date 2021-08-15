import React from 'react'
import {Link} from 'react-router-dom'

import {withFirebase} from '../../firebase' 
import ItemPageLayout from '../../layouts/ItemPageLayout'

import "./item-page.scss"


class ItemPage extends React.Component{
    constructor(props){
        super(props)

        console.log("itemPage state", this.state)
        console.log("itemPage loc hits", this.props.location)

        
        this.state = {
            items:[],
            filtered: [],
            loading:"false",
         }
       

        //console.log("state", this.state)


    }

    handleFilterResultsChange = (filtered) =>{
        this.setState({filtered})
    }

    handleRoute = (id) => {
        this.props.history.push(`/item-page/${id}`)
    }
   

    componentDidMount= () => {
        let hits = []

        if(this.props.location.state){
            if(this.props.location.state.hits){ //if conjured with a search
                hits = this.props.location.state.hits

                this.setState({
                    items: hits,
                    filtered: hits,
                }, ()=>console.log("inside state", this.state))
            }
        }
        else{
            this.props.firebase.items()
        .where('isListed', '==', true)
        .get()
        .then(snapshot => {
            let tempList = [] 

            snapshot.forEach(doc => {
                tempList.push({id: doc.id, ...doc.data()})
            })

            this.setState({
                items: tempList,
                filtered: tempList,
                })
            })  

        }
    }

    //cat is spec
    
    render(){
        const {items, filtered} = this.state
        return(
            <ItemPageLayout items = {items} filtered = {filtered} handleFilterResultsChange = {this.handleFilterResultsChange} handleRoute = {this.handleRoute} loc={this.props.location}/>
            
        )
    }
    
}
export default withFirebase(ItemPage)