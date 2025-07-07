import React from 'react'

const SeenList = ({seenList}) => {
  return (
    <div className="seen-list">
      <h2>Plants You've Seen</h2>
      {seenList &&
                seenList.map(([name, imageUrl], index) => (
                    <div key={index}>
                      <h3 className="seen-name">{name}</h3>
                      <img src={img} className="seen-image"/>
                    </div>
      ))}
    </div>
  )
}

export default SeenList