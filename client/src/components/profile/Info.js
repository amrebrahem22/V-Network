import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import Avatar from '../Avatar'
import { getProfileUsers } from '../../redux/actions/profileAction'

const Info = () => {
    const { profile, auth } = useSelector(state => state)
    const dispatch = useDispatch()
    const [userData, setUserData] = useState([])

    const { id } = useParams()

    useEffect(() => {
        if(id === auth.user._id){
            setUserData([auth.user])
        }else{
            dispatch(getProfileUsers({users: profile.users, id, auth}))
        }
    }, [id, auth, dispatch, profile.users])
    

    return (
        <div className="info">
            {
                userData.map(user => (
                    <div className="info_container" key={user._id}>
                        <Avatar src={user.avatar} size="supper-avatar" />

                        <div className="info_content">
                            <div className="info_content_title">
                                <h2>{user.username}</h2>
                                <button className="btn btn-outline-info">
                                    Edit Profile
                                </button>
                               
                                
                            </div>

                            <div className="follow_btn">
                                <span className="mr-4">
                                    {user.followers.length} Followers
                                </span>
                                <span className="ml-4">
                                    {user.following.length} Following
                                </span>
                            </div>

                            <h6>{user.fullname} <span className="text-danger">{user.mobile}</span></h6>
                            <p className="m-0">{user.address}</p>
                            <h6 className="m-0">{user.email}</h6>
                            <a href={user.website} target="_blank" rel="noreferrer">
                                {user.website}
                            </a>
                            <p>{user.story}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Info