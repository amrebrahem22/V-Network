import React, { useState, useEffect, useRef } from 'react'
import UserCard from '../UserCard'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import MsgDisplay from './MsgDisplay'

const RightSide = () => {
    const { auth, message } = useSelector(state => state)
    const dispatch = useDispatch()

    const { id } = useParams()
    const [user, setUser] = useState([])
    const [text, setText] = useState('')

    const history = useHistory()

    useEffect(() => {
        const newData = message.users.find(user => user._id === id)
        if(newData){
            setUser(newData)
        }
    },[message.data, id])

    return(
        <>
            <div className="message_header" style={{cursor: 'pointer'}} >
                {
                    user.length !== 0 &&
                    <UserCard user={user}>
                        <div>
                            <i className="fas fa-phone-alt"/>

                            <i className="fas fa-video mx-3" />

                            <i className="fas fa-trash text-danger"/>
                        </div>
                    </UserCard>
                }
            </div>

            <div className="chat_container" >
                <div className="chat_display">
                    <div className="chat_row other_message">
                        <MsgDisplay user={user}/>
                    </div>

                    <div className="chat_row you_message">
                        <MsgDisplay user={auth.user} />
                    </div>

                </div>
            </div>

            <form className="chat_input">
                <input type="text" placeholder="Enter you message..."
                value={text} onChange={e => setText(e.target.value)}/>

                <button type="submit" className="material-icons" 
                disabled={text ? false : true}>
                    near_me
                </button>
            </form>
        </>
    )
}

export default RightSide