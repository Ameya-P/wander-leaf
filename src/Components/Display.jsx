import React from 'react'

const Display = ({ features, findPlant, banItem, banList, unProcessValue}) => {
  return (
    <div className="display">
      <h1>Wanderleaf</h1>
      <h3 className='tagline'>Get lost in the garden of possibilities and let curiosity take root!</h3>

      <br></br>

      <h2>{features.common_name}</h2>
      <h3>{features.scientific_name}</h3>
      <div className="my-features">
        {features &&
          Object.entries(features)
            .filter(([key]) => !['common_name', 'scientific_name', 'default_image'].includes(key))
            .flatMap(([category, value], index) => {
              const values = Array.isArray(value) ? value : [value];

              const getButtonClass = (cat, val) => {
                let baseClass = ` ${cat}-button`;

                // Add state-based classes
                if (banList[cat]?.includes(val)) baseClass += ' banned';

                return baseClass;
              };

              return values.map((item, itemIndex) => (
                <button
                  key={`${category}-${itemIndex}`}
                  className={getButtonClass(category, item)}
                  data-category={category}
                  data-value={item}
                  onClick={banItem}
                >
                  {category}: {unProcessValue(category, item)}
                </button>
              ));
            })
        }
      </div>

      <img src={features.default_image} className="my-plant-image" />


      <button className="discover-button" onClick={findPlant}>☘️ Discover!</button>
    </div>
  )
}

export default Display