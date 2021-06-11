import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../redux/actions/authActions'


const Register = () => {
    const initialState = { fullname: '', username: '', email: '', gender: 'male', password: '', cf_password: '' }
    const [userData, setUserData] = useState(initialState)
    const { fullname, username, email, password, cf_password } = userData

    const [typePass, setTypePass] = useState(false)
    const [typePass2, setTypePass2] = useState(false)

    const { auth, alert } = useSelector(state => state)
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        if(auth.token) history.push("/")
    }, [auth.token, history])

    const handleChangeInput = e => {
        const { name, value } = e.target
        setUserData({...userData, [name]:value})
    }

    const handleSubmit = e => {
        e.preventDefault()
        dispatch(register(userData))
    }

    return (
        <div className="auth_page">
            <form onSubmit={handleSubmit}>
                <h3 className="text-uppercase text-center mb-4">V-Network</h3>

                <div className="form-group">
                    <label htmlFor="fullname">Full Name</label>
                    <input type="text" className="form-control" id="fullname" name="fullname" onChange={handleChangeInput} value={fullname} style={{ background: `${alert.fullname ? '#fd2d6a14' : ''}` }} />
                    <small id="emailHelp" className="form-text text-danger">
                        {alert.fullname ? alert.fullname : '' }
                    </small>
                </div>
                
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" className="form-control" id="username" name="username" onChange={handleChangeInput} value={username.toLowerCase().replace(/ /g, '')} style={{ background: `${alert.username ? '#fd2d6a14' : ''}` }} />

                    <small id="emailHelp" className="form-text text-danger">
                        {alert.username ? alert.username : '' }
                    </small>
                </div>
                
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" name="email"
                    aria-describedby="emailHelp" onChange={handleChangeInput} value={email} style={{ background: `${alert.email ? '#fd2d6a14' : ''}` }} />
                    
                    <small id="emailHelp" className="form-text text-danger">
                        {alert.email ? alert.email : '' }
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>

                    <div className="pass">
                        
                        <input type={ typePass ? "text" : "password" } 
                        className="form-control" id="exampleInputPassword1"
                        onChange={handleChangeInput} value={password} name="password" style={{ background: `${alert.fullname ? '#fd2d6a14' : ''}` }} />

                        <small onClick={() => setTypePass(!typePass)}>
                            {typePass ? 'Hide' : 'Show'}
                        </small>

                    </div>
                    <small id="emailHelp" className="form-text text-danger">
                        {alert.password ? alert.password : '' }
                    </small>
                   
                </div>
                
                <div className="form-group">
                    <label htmlFor="exampleInputPassword2">Confirm Password</label>

                    <div className="pass">
                        
                        <input type={ typePass2 ? "text" : "password" } 
                        className="form-control" id="exampleInputPassword2"
                        onChange={handleChangeInput} value={cf_password} name="cf_password" style={{ background: `${alert.cf_password ? '#fd2d6a14' : ''}` }} />

                        <small onClick={() => setTypePass2(!typePass2)}>
                            {typePass2 ? 'Hide' : 'Show'}
                        </small>

                    </div>
                    <small id="emailHelp" className="form-text text-danger">
                        {alert.cf_password ? alert.cf_password : '' }
                    </small>
                   
                </div>

                <div className="row justify-content-between mx-0 mb-1">
                    <label className="w-auto mt-2" htmlFor="male">
                        Male: <input type="radio" name="gender" value="male" id="male" defaultChecked onChange={handleChangeInput} />
                    </label>
                    <label className="w-auto mt-2" htmlFor="female">
                        Female: <input type="radio" name="gender" value="female" id="female" onChange={handleChangeInput} />
                    </label>
                    <label className="w-auto mt-2" htmlFor="other">
                        Other: <input type="radio" name="gender" value="other" id="other" onChange={handleChangeInput} />
                    </label>
                </div>
                
                <button type="submit" className="btn btn-dark w-100 mt-4">
                    Register
                </button>

                <p className="my-2">
                    Already have an account? <Link to="/login" style={{color: "crimson"}}>Login Now</Link>
                </p>
            </form>
        </div>
    )
}

export default Register