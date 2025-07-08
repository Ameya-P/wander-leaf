import React from 'react'

const SeenList = ({ seenList }) => {
  return (
    <div className="seen-list">
      <h2 className="title">Plants You've Seen</h2>
      {seenList &&
        seenList.map(([name, imageUrl], index) => (
          <div key={`${name}-${index}`} className="seen-container">
            <h3 className="seen-name">{name}</h3>
            <img src={imageUrl} className="seen-image" />
          </div>
        ))}
    </div>
  )
}

export default SeenList