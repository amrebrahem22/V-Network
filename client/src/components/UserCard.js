import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'

const UserCard = ({user, handleClose}) => {



    return (
        <div className={`d-flex p-2 align-items-center justify-content-between w-100`}>
            <div>
                <Link to={`/profile/${user._id}`} onClick={handleClose}
                className="d-flex align-items-center">
                    
                    <Avatar src={user.avatar} size="big-avatar" />

                    <div className="ml-1" style={{transform: 'translateY(-2px)'}}>
                        <span className="d-block">{user.username}</span>
                        
                        <small style={{opacity: 0.7}}>
                            {user.fullname}
                        </small>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default UserCard