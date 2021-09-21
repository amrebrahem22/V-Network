import React from 'react'
import Avatar from '../Avatar'

const MsgDisplay = ({user}) => {
    return (
        <>
            <div className="chat_title">
                <Avatar src={user.avatar} size="small-avatar" />
                <span>{user.username}</span>
            </div>

            <div className="you_content">
                <div className="chat_text">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam ullam atque quod exercitationem reprehenderit sunt cumque consectetur eius, natus
                </div>
            </div>

            <div className="chat_time">
                10 Minutes ago
            </div>
        </>
    )
}

export default MsgDisplay
