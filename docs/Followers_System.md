# Followers System

- in `models/userModel.js`
```js
const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25
    },
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar:{
        type: String,
        default: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png'
    },
    role: {type: String, default: 'user'},
    gender: {type: String, default: 'male'},
    mobile: {type: String, default: ''},
    address: {type: String, default: ''},
    story: {
        type: String, 
        default: '',
        maxlength: 200
    },
    website: {type: String, default: ''},
    followers: [{type: mongoose.Types.ObjectId, ref: 'user'}],
    following: [{type: mongoose.Types.ObjectId, ref: 'user'}],
    saved: [{type: mongoose.Types.ObjectId, ref: 'user'}]
}, {
    timestamps: true
})


module.exports = mongoose.model('user', userSchema)
```

- and in `controllers/userCtrl.js`
```js
const Users = require('../models/userModel')

const userCtrl = {
    follow: async (req, res) => {
        try {
            // get the upcoming user with the current user id to follow
            // if the logged in user in this user followers return a message
            const user = await Users.find({_id: req.params.id, followers: req.user._id})
            if(user.length > 0) return res.status(500).json({msg: "You followed this user."})

            // otherwise add the logged in user to this user followers
            const newUser = await Users.findOneAndUpdate({_id: req.params.id}, { 
                $push: {followers: req.user._id}
            }, {new: true}).populate("followers following", "-password")

            // and also add it to the logged in user following
            await Users.findOneAndUpdate({_id: req.user._id}, {
                $push: {following: req.params.id}
            }, {new: true})

            res.json({newUser})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unfollow: async (req, res) => {
        try {

            const newUser = await Users.findOneAndUpdate({_id: req.params.id}, { 
                $pull: {followers: req.user._id}
            }, {new: true}).populate("followers following", "-password")

            await Users.findOneAndUpdate({_id: req.user._id}, {
                $pull: {following: req.params.id}
            }, {new: true})

            res.json({newUser})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = userCtrl;
```
- `routes/userRouter.js`
```js
router.patch('/user/:id/follow', auth, userCtrl.follow)
router.patch('/user/:id/unfollow', auth, userCtrl.unfollow)
```
- in `client/src/redux/actions/globalTypes.js`
```js
const GLOBAL_TYPES = {
    AUTH: 'AUTH',
    ALERT: 'ALERT',
    THEME: 'THEME',
}

export const EditData = (data, id, post) => {
    const newData = data.map(item => 
        (item._id === id ? post : item)
    )
    return newData;
}

export const DeleteData = (data, id) => {
    const newData = data.filter(item => item._id !== id)
    return newData;
}

export default GLOBAL_TYPES
```
- and in `client/src/redux/actions/profileAction.js`
```js
import GLOBAL_TYPES, { DeleteData  } from './globalTypes'
import { getDataAPI, patchDataAPI } from '../../utils/fetchData'
import { imageUpload } from '../../utils/imageUpload'


export const PROFILE_TYPES = {
    LOADING: 'LOADING_PROFILE',
    GET_USER: 'GET_PROFILE_USER',
    FOLLOW: 'FOLLOW',
    UNFOLLOW: 'UNFOLLOW',
}

// users => will be the profile users, and user => is the user profile 
export const follow = ({users, user, auth}) => async (dispatch) => {
    let newUser;
    
    // will check if the user profile not in the profile users
    if(users.every(item => item._id !== user._id)){
        newUser = {...user, followers: [...user.followers, auth.user]}
    }else{
        users.forEach(item => {
            if(item._id === user._id){
                newUser = {...item, followers: [...item.followers, auth.user]}
            }
        })
    }
            
    // dispatch follow
    dispatch({ type: PROFILE_TYPES.FOLLOW, payload: newUser })

    // dispatch Login
    dispatch({
        type: GLOBAL_TYPES.AUTH, 
        payload: {
            ...auth,
            user: {...auth.user, following: [...auth.user.following, newUser]}
        }
    })

    // then add it to database
    try {
        await patchDataAPI(`user/${user._id}/follow`, null, auth.token)

    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
    }

}

export const unfollow = ({users, user, auth, socket}) => async (dispatch) => {

    let newUser;

    if(users.every(item => item._id !== user._id)){
        newUser = {...user, followers: DeleteData(user.followers, auth.user._id)}
    }else{
        users.forEach(item => {
            if(item._id === user._id){
                newUser = {...item, followers: DeleteData(item.followers, auth.user._id)}
            }
        })
    }

    dispatch({ type: PROFILE_TYPES.UNFOLLOW, payload: newUser })

    dispatch({
        type: GLOBAL_TYPES.AUTH, 
        payload: {
            ...auth,
            user: { 
                ...auth.user, 
                following: DeleteData(auth.user.following, newUser._id) 
            }
        }
    })

    try {
        await patchDataAPI(`user/${user._id}/unfollow`, null, auth.token)

    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
    }
   
}
```
- and in `client/src/redux/reducers/profileReducer.js`
```js
import { PROFILE_TYPES } from '../actions/profileAction'
import { EditData } from '../actions/globalTypes'

const initialState = {
    loading: false,
    users: [],
    posts: []
}

// add FOLLOW and UNFOLLOW
const profileReducer = (state = initialState, action) => {
    switch (action.type){
        case PROFILE_TYPES.LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case PROFILE_TYPES.GET_USER:
            return {
                ...state,
                users: [...state.users, action.payload.user]
            };

        case PROFILE_TYPES.FOLLOW:
            return {
                ...state,
                users: EditData(state.users, action.payload._id, action.payload)
            };
        case PROFILE_TYPES.UNFOLLOW:
            return {
                ...state,
                users: EditData(state.users, action.payload._id, action.payload)
            };
        default:
            return state;
    }
}

export default profileReducer
```
- and in `client/src/components/profile/Info.js`
```jsx
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import Avatar from '../Avatar'
import EditProfile from './EditProfile'
import FollowBtn from '../FollowBtn'
import Followers from './Followers'
import Following from './Following'
import { getProfileUsers } from '../../redux/actions/profileAction'

const Info = () => {
    const { profile, auth } = useSelector(state => state)
    const dispatch = useDispatch()
    const [userData, setUserData] = useState([])
    const [onEdit, setOnEdit] = useState(false)

    const [showFollowers, setShowFollowers] = useState(false)
    const [showFollowing, setShowFollowing] = useState(false)

    const { id } = useParams()

    // if this is the logged in profile profile set the user data to an array of this user
    // else fetch the user data
    useEffect(() => {
        if(id === auth.user._id){
            setUserData([auth.user])
        }else{
            dispatch(getProfileUsers({users: profile.users, id, auth}))
            const newData = profile.users.filter(user => user._id === id)
            console.log(profile.users)
            setUserData(newData)
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
                                {
                                    user._id === auth.user._id
                                    ?  <button className="btn btn-outline-info"
                                    onClick={() => setOnEdit(true)}>
                                        Edit Profile
                                    </button>
                                    
                                    : <FollowBtn user={user} />
                                }
                               
                                
                            </div>

                            <div className="follow_btn">
                                <span className="mr-4" onClick={() => setShowFollowers(true)}>
                                    {user.followers.length} Followers
                                </span>
                                <span className="ml-4" onClick={() => setShowFollowing(true)}>
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

                        {
                            onEdit && <EditProfile setOnEdit={setOnEdit} />
                        }

                        {
                            showFollowers &&
                            <Followers 
                            users={user.followers} 
                            setShowFollowers={setShowFollowers} 
                            />
                        }
                        {
                            showFollowing &&
                            <Following 
                            users={user.following} 
                            setShowFollowing={setShowFollowing} 
                            />
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default Info
```
- and in `client/src/components/profile/Following.js`
```jsx
import React from 'react'
import UserCard from '../UserCard'
import FollowBtn from '../FollowBtn'
import { useSelector } from 'react-redux'

const Following = ({users, setShowFollowing}) => {
    const { auth } = useSelector(state => state)
    return (
        <div className="follow">
            <div className="follow_box">
                <h5 className="text-center">Following</h5>
                <hr/>

                <div className="follow_content">
                    {
                        users.map(user => (
                            <UserCard key={user._id} user={user} setShowFollowing={setShowFollowing} >
                                {
                                    auth.user._id !== user._id && <FollowBtn user={user} />
                                }
                            </UserCard>
                        ))
                    }
                </div>

                <div className="close" onClick={() => setShowFollowing(false)}>
                    &times;
                </div>

            </div>
        </div>
    )
}

export default Following
```
- and in `client/src/components/profile/Followers.js`
```jsx
import React from 'react'
import UserCard from '../UserCard'
import FollowBtn from '../FollowBtn'
import { useSelector } from 'react-redux'

const Followers = ({users, setShowFollowers}) => {
    const { auth } = useSelector(state => state)
    return (
        <div className="follow">
            <div className="follow_box">
                <h5 className="text-center">Followers</h5>
                <hr/>

                <div className="follow_content">
                    {
                        users.map(user => (
                            <UserCard key={user._id} user={user} setShowFollowers={setShowFollowers} >
                                {
                                    auth.user._id !== user._id && <FollowBtn user={user} />
                                }
                            </UserCard>
                        ))
                    }
                </div>


                <div className="close" onClick={() => setShowFollowers(false)}>
                    &times;
                </div>

            </div>
        </div>
    )
}

export default Followers
```
- and in `client/src/components/UserCard.js`
```jsx
import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'

const UserCard = ({children, user, handleClose, setShowFollowers, setShowFollowing}) => {

    const handleCloseAll = () => {
        if(handleClose) handleClose()
        if(setShowFollowers) setShowFollowers(false)
        if(setShowFollowing) setShowFollowing(false)
    }

    return (
        <div className={`d-flex p-2 align-items-center justify-content-between w-100`}>
            <div>
                <Link to={`/profile/${user._id}`} onClick={handleCloseAll}
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
            {children}
        </div>
    )
}

export default UserCard
```
- and in `client/src/components/FollowBtn.js`
```jsx
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { follow, unfollow } from '../redux/actions/profileAction'

const FollowBtn = ({user}) => {
    const [followed, setFollowed] = useState(false)

    const { auth, profile, socket } = useSelector(state => state)
    const dispatch = useDispatch()

    const [load, setLoad] = useState(false)

    useEffect(() => {
        if(auth.user.following.find(item => item._id === user._id)){
            setFollowed(true)
        }
        return () => setFollowed(false)
    }, [auth.user.following, user._id])

    const handleFollow =  async () => {
        if(load) return;

        setFollowed(true)
        setLoad(true)
        await dispatch(follow({users: profile.users, user, auth, socket}))
        setLoad(false)
    }

    const handleUnFollow = async () => {
        if(load) return;

        setFollowed(false)
        setLoad(true)
        await dispatch(unfollow({users: profile.users, user, auth, socket}))
        setLoad(false)
    }

    return (
        <>
        {
            followed
            ? <button className="btn btn-outline-danger"
            onClick={handleUnFollow}>
                UnFollow
            </button>
            : <button className="btn btn-outline-info"
            onClick={handleFollow}>
                Follow
            </button>
        }
        </>
    )
}

export default FollowBtn
```