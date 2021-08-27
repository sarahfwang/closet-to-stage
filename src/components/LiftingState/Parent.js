import React, {useState, useEffect} from 'react'
import Child from './Child'

class parent extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            result:"",
        }
    }
    componentDidMount(){
        const arr = [6,7,8,9,10]

        const promise = new Promise((resolve, reject)=> {
            let count = 0

            arr.forEach(num => {
                console.log("num", num)
                count++
            })

            if (count == arr.length){
                resolve("Promise resolved");
            }
            else {
                reject("Promise rejected");
            }

        })

        promise.then(result => {
            this.setState({result}, ()=> console.log("promise state resolved", this.state))
        }, error => {
            this.setState({result: error}, ()=> console.log("promise state failed", this.sttae))
        })
    }

    handleCountChange = () => {
        console.log("handleCountChange")

        let newCount = this.state.count
        newCount = newCount + 1
        this.setState({
            count: newCount
        },()=> console.log(this.state))
    }

    render(){
        return(
            <div>
                <h1>Parent</h1>
                <p>parent count: {this.state.count}</p>
                <Child count={this.state.count} handleCountChange={this.handleCountChange}/>
            </div>
        )

    }
    
}

export default parent