import React from 'react'

const Display = ({features, findPlant, banItem, unBanItem}) => {
  return (
    <div className="display">
        <h1>Wanderleaf</h1>
        <h3>Get lost in the garden of possibilities and let curiosity take root!</h3>

        <h2>{features.common_name}</h2>
        <h3>{features.scientific_name}</h3>
        <div className="my-features">
            {features &&
                Object.entries(features)
                .filter(([key]) => !['common_name', 'scientific_name', 'default_image'].includes(key))
                .map(([category, value], index) => (
                    <button>{category}: {value}</button>
            ))}
        </div>
        <div className="image-wrapper">
            <img src={features.default_image} className="my-plant-image"/>
        </div>

        <button className="discover-button" onClick={findPlant}>☘️ Discover!</button>
    </div>
  )
}

export default Display