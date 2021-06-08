import React from 'react'

function NotFound() {
    return (
        <div className="text-secondary text-center position-relative" style={{ minHeight: 'calc(100vh - 70px)' }}>
            <div style={{ left: '50%', top: '50%', transform: 'translate(-50px, -50px)', position: 'absolute' }}>
                <h1>404 | Not Found</h1>
            </div>
        </div>
    )
}

export default NotFound
