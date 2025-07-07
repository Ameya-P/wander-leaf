import React from 'react'

const BanList = ({banList, unBanItem, featureOptions}) => {
  return (
    <div className="ban-list">
      <h2>Ban List</h2>
      {banList &&
          Object.entries(banList)
            .flatMap(([category, value], index) => {
              const values = Array.isArray(value) ? value : [value];

              const getButtonClass = (cat, val) => {
                let baseClass = ` ${cat}-button`;

                // Add state-based classes
                if (featureOptions[cat]?.includes(val)) baseClass += ' unbanned';

                return baseClass;
              };

              return values.map((item, itemIndex) => (
                <button
                  key={`${category}-${itemIndex}`}
                  className={getButtonClass(category, item)}
                  data-category={category}
                  data-value={item}
                  onClick={unBanItem}
                >
                  {category}: {item}
                </button>
              ));
            })
        }
    </div>
  )
}

export default BanList