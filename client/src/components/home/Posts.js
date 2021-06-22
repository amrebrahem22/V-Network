import React , {useState} from 'react'
import { useSelector } from 'react-redux'
import PostCard from '../PostCard'
import LoadIcon from '../../images/loading.gif'

const Posts = () => {

    const [load, setLoad] = useState(false)

    const { homePosts, theme } = useSelector(state => state)

    return (
        <div className="posts">
            {
                homePosts.posts.map(post => (
                    <PostCard key={post._id} post={post} theme={theme} />
                ))
            }

            {
                load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
            }
        </div>
    )
}

export default Posts