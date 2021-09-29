import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Avatar from '../Avatar'
import GLOBAL_TYPES from '../../redux/actions/globalTypes'
import { addMessage } from '../../redux/actions/messageAction'

const CallModal = () => {
    const { call } = useSelector(state => state)
    const dispatch = useDispatch()

    const [mins, setMins] = useState(0)
    const [second, setSecond] = useState(0)
    const [total, setTotal] = useState(0)

    const [answer, setAnswer] = useState(false)

    // Set Time
    useEffect(() => {
        const setTime = () => {
            setTotal(t => t + 1)
            setTimeout(setTime, 1000)
        }
        setTime()

        return () => setTotal(0)
    },[])

    useEffect(() => {
        setSecond(total%60)
        setMins(parseInt(total/60))
    },[total])


    const handleEndCall = () => {
        dispatch({type: GLOBAL_TYPES.CALL, payload: null })
    }

    useEffect(() => {
        if(answer){
            setTotal(0)
        }else{
            const timer = setTimeout(() => {
                dispatch({type: GLOBAL_TYPES.CALL, payload: null })
            }, 15000)
    
            return () => clearTimeout(timer)
        }
        
    },[dispatch, answer, call])

    // Answer Call
    const handleAnswer = () => {
        setAnswer(true)
    }


    return (
        <div className="call_modal">
            <div className="call_box" style={{
                display: (answer && call.video) ? 'none' : 'flex'
            }} >

                <div className="text-center" style={{padding: '40px 0'}} >
                    <Avatar src={call.avatar} size="supper-avatar" />
                    <h4>{call.username}</h4>
                    <h6>{call.fullname}</h6>

                    {
                        answer 
                        ? <div>
                            <span>{ mins.toString().length < 2 ? '0' + mins : mins }</span>
                            <span>:</span>
                            <span>{ second.toString().length < 2 ? '0' + second : second }</span>
                        </div>
                        : <div>
                            {
                                call.video
                                ? <span>calling video...</span>
                                : <span>calling audio...</span>
                            }
                        </div>
                    }
                    
                </div>
                
                {
                    !answer && 
                    <div className="timer">
                        <small>{ mins.toString().length < 2 ? '0' + mins : mins }</small>
                        <small>:</small>
                        <small>{ second.toString().length < 2 ? '0' + second : second }</small>
                    </div>
                }
                

                <div className="call_menu">
                    <button className="material-icons text-danger"
                    onClick={handleEndCall}>
                        call_end
                    </button>
                    
                    {
                        call.video
                        ? <button className="material-icons text-success"
                        onClick={handleAnswer}>
                            videocam
                        </button>
                        : <button className="material-icons text-success"
                        onClick={handleAnswer}>
                            call
                        </button>
                    }
                    
                </div>
                
            </div>

                <div className="time_video">
                    <span>{ mins.toString().length < 2 ? '0' + mins : mins }</span>
                    <span>:</span>
                    <span>{ second.toString().length < 2 ? '0' + second : second }</span>
                </div>

                <button className="material-icons text-danger end_call"
                onClick={handleEndCall}>
                    call_end
                </button>

            </div>
    )
                
}

export default CallModal