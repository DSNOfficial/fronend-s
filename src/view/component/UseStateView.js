import React,{useState} from 'react'


const UseStateView = () => {

const [name,setName]= useState('dara')

const onChangeIfo =() =>{ // arrow fuction
    setName("Maly")
}

  return (
    <div>
        <h1>Name :{name}</h1>
        <button onClick={onChangeIfo}>
            Change Info

        </button>
      
    </div>
  )
}

export default UseStateView
