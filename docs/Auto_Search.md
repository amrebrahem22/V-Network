# Auto Search

- in `controllers/userCtrl.js`
```js
const Users = require('../models/userModel')

const userCtrl = {
    searchUser: async (req, res) => {
        try {
            const users = await Users.find({username: {$regex: req.query.username}})
            .limit(10).select("fullname username avatar")

            res.json({users})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}


module.exports = userCtrl
```

- create the auth middleware in `middlewares/auth.js`
```js
const Users = require("../models/userModel")
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")

        if(!token) return res.status(400).json({msg: "Invalid Authentication."})

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if(!decoded) return res.status(400).json({msg: "Invalid Authentication."})

        const user = await Users.findOne({_id: decoded.id})

        req.user = user
        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}


module.exports = auth
```

- in `routes/userRouter.js`
```js
const router = require('express').Router()
const auth = require("../middlewares/auth")
const userCtrl = require("../controllers/userCtrl")


router.get('/search', auth, userCtrl.searchUser)

module.exports = router
```

- in `server.js`
```js
app.use('/api', require('./routes/userRouter'))
```
- create the user card to display in the search in `client/src/components/UserCard.js`
```jsx
import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'

const UserCard = ({user}) => {

    return (
        <div className={`d-flex p-2 align-items-center justify-content-between w-100`}>
            <div>
                <Link to={`/profile/${user._id}`}
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
```
- then create the search component `client/src/components/Header/Search.js`
```jsx
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getDataAPI } from '../../utils/fetchData'
import GLOBAL_TYPES from '../../redux/actions/globalTypes'
import UserCard from '../UserCard'
import LoadIcon from '../../images/loading.gif'

const Search = () => {
    // 1. search controller
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])

    const { auth } = useSelector(state => state)
    const dispatch = useDispatch()

    const [load, setLoad] = useState(false)

    // 2. when submitting
    const handleSearch = async (e) => {
        e.preventDefault()
        // if search is empty do nothing
        if(!search) return;

        try {
            // send a request to get all users with this username in the search through regular expression in the backend
            setLoad(true)
            const res = await getDataAPI(`search?username=${search}`, auth.token)
            setUsers(res.data.users)
            setLoad(false)
        } catch (err) {
            dispatch({
                type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}
            })
        }
    }

    const handleClose = () => {
        setSearch('')
        setUsers([])
    }

    return (
        <form className="search_form" onSubmit={handleSearch}>
            <input type="text" name="search" value={search} id="search" title="Enter to Search"
            onChange={e => setSearch(e.target.value.toLowerCase().replace(/ /g, ''))} />

            <div className="search_icon" style={{opacity: search ? 0 : 0.3}}>
                <span className="material-icons">search</span>
                <span>Enter to Search</span>
            </div>

            <div className="close_search" onClick={handleClose}
            style={{opacity: users.length === 0 ? 0 : 1}} >
                &times;
            </div>

            <button type="submit" style={{display: 'none'}}>Search</button>

            { load && <img className="loading" src={LoadIcon} alt="loading"  /> }

            <div className="users">
                {
                    search && users.map(user => (
                        <UserCard 
                        key={user._id} 
                        user={user} 
                        border="border"
                        handleClose={handleClose} 
                        />
                    ))
                }
            </div>
        </form>
    )
}

export default Search
```
- then add the search component in the header in `client/src/components/Header/Header.js`
```jsx
import Search from './Search'

const Header = () => (
    <Search />
)
```