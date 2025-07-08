import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import Display from './Components/Display';
import BanList from './Components/BanList';
import SeenList from './Components/SeenList';

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [features, setFeatures] = useState({
    common_name: "Press Discover...",
    scientific_name: "...to meet a new plant!",
    default_image: "/placeholder.png",
    edible: "?",
    cycle: "?",
    watering: "?",
    sunlight: "?",
    indoor: "?",
  });

  const [featureOptions, setFeatureOptions] = useState({
    edible: ["No", "Yes"], // Fixed: removed empty strings
    cycle: ["perennial", "annual"],
    watering: ["frequent", "average", "minimum"],
    sunlight: ["full_shade", "part_shade", "full_sun"],
    indoor: ["No", "Yes"], // Fixed: removed empty strings
  });

  const [banList, setBanList] = useState({
    edible: [],
    cycle: [],
    watering: [],
    sunlight: [],
    indoor: [],
  });

  const [seenList, setSeenList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const submitForm = (e) => {
    e.preventDefault();
    makeQuery();
  }

  const makeQuery = () => {
    // Randomly select features
    const urlValues = {};

    for (const [key, valsList] of Object.entries(featureOptions)) {
      let my_value = valsList[Math.floor(Math.random() * valsList.length)];
      urlValues[key] = my_value === "Yes" ? "1" : my_value === "No" ? "0" : my_value;
    }

    const query = buildQueryString(urlValues, 1);
    callAPI(query, urlValues);
  }

  const buildQueryString = (urlValues, page) => {
    const params = new URLSearchParams({
      key: ACCESS_KEY,
      page: page.toString(),
      ...urlValues
    });
    return `https://perenual.com/api/v2/species-list?${params.toString()}`;
  }

  const callAPI = async (query, urlValues) => {
    if (!ACCESS_KEY) {
      alert("API key is missing! Please check your environment variables.");
      return;
    }

    setIsLoading(true);
    
    try {
      // First API call to get pagination info
      const response = await axios.get(query);
      
      if (!response.data || !response.data.data || response.data.data.length === 0) {
        console.log(query);
        throw new Error("No plants found with the selected criteria");
      }

      // Pick a random page
      const randPage = Math.floor(Math.random() * response.data.last_page) + 1;
      
      // Second API call to get random page
      const newQuery = buildQueryString(urlValues, randPage);
      const newResponse = await axios.get(newQuery);

      if (!newResponse.data || !newResponse.data.data || newResponse.data.data.length === 0) {
        console.log(newQuery);
        throw new Error("No plants found on the selected page");
      }

      // Pick a random plant from that page
      const plantsArray = newResponse.data.data;
      const validPlants = plantsArray.filter(plant => plant.id <= 3000);
      if (validPlants.length === 0) {
        console.log("No valid plants found");
        return; // Don't call getPlantDetails
      }

      let myPlant = validPlants[Math.floor(Math.random() * validPlants.length)];

      await getPlantDetails(myPlant);

    } catch (error) {
      console.log(query);
      console.error("API Error:", error);
      alert(`We ran into a problem: ${error.message || "Unable to fetch plant data"}`);
    } finally {
      setIsLoading(false);
    }
  }

  const getPlantDetails = async (plant) => {
    try {
      const specificPlantQuery = `https://perenual.com/api/v2/species/details/${plant.id}?key=${ACCESS_KEY}`;
      const specificPlantResponse = await axios.get(specificPlantQuery);

      if (!specificPlantResponse.data) {
        console.log(specificPlantQuery);
        throw new Error("Unable to fetch plant details");
      }

      const plantData = specificPlantResponse.data;
      
      // Process and update features
      const newFeatures = {
        common_name: plantData.common_name || "Unknown Plant",

        scientific_name: Array.isArray(plantData.scientific_name) 
          ? plantData.scientific_name.join(", ") 
          : plantData.scientific_name || "Unknown Species",

        default_image: plantData.default_image?.regular_url || "/placeholder.png",

        edible: plantData.edible_fruit || plantData.edible_leaf ? "Yes" : "No",

        cycle: !plantData.cycle ? "Unknown"
          : plantData.cycle.toLowerCase().includes("perennial") ? "perennial"
            : plantData.cycle.toLowerCase().includes("annual") ? "annual"
              : plantData.cycle,

        watering: !plantData.watering ? "Unknown"
          : plantData.watering.toLowerCase().includes("frequent") ? "frequent"
            : plantData.watering.toLowerCase().includes("average") ? "average"
              : plantData.watering.toLowerCase().includes("minimum") ? "minimum"
                : plantData.watering,

        sunlight: !plantData.sunlight ? ["Unknown"]
          : plantData.sunlight.map(item =>
            item.toLowerCase().includes("full shade") ? "full_shade"
              : item.toLowerCase().includes("part shade") ? "part_shade"
                : item.toLowerCase().includes("full sun") ? "full_sun"
                  : item
          ),

        indoor: plantData.indoor ? "Yes" : "No",
      };

      addSeenPlant();
      setFeatures(newFeatures);

    } catch (error) {
      console.log(plant.id)
      console.error("Plant Details Error:", error);
      alert("Unable to fetch detailed plant information");
    }
  }

  const addSeenPlant = () => {
    // Don't add it to scene if the previous item was the default starter item
    if (features.common_name === "Press Discover...") {
      return;
    }

    setSeenList([...seenList, [features.common_name, features.default_image]]);
  }

  const banItem = (event) => {
    const category = event.target.dataset.category;
    const value = event.target.dataset.value;

    // Prevent banning unknown values
    if (value === "Unknown" || value === "?") {
      alert("You cannot ban an unknown value!");
      return;
    }

    // Check if already banned to prevent duplicates
    if (banList[category].includes(value)) {
      alert(`"${value}" is already banned!`);
      return;
    }

    // Remove from available options and add to ban list
    const updatedOptions = featureOptions[category].filter(option => option !== value);
    const updatedBanList = [...banList[category], value];

    setFeatureOptions({
      ...featureOptions,
      [category]: updatedOptions
    });

    setBanList({
      ...banList,
      [category]: updatedBanList
    });
  };

  const unBanItem = () => {
    const category = event.target.dataset.category;
    const value = event.target.dataset.value;

    // Check if already banned to prevent duplicates
    if (featureOptions[category].includes(value)) {
      alert(`"${value}" is already allowed!`);
      return;
    }

    // Remove from available options and add to ban list
    const updatedOptions = [...featureOptions[category], value];
    const updatedBanList = banList[category].filter(option => option !== value);

    setFeatureOptions({
      ...featureOptions,
      [category]: updatedOptions
    });

    setBanList({
      ...banList,
      [category]: updatedBanList
    });
  }

  const unProcessValue = (category, value) => {
    const stringCategories = ["edible", "indoor", "cycle", "watering"]
    if (stringCategories.includes(category)) {
      return value
    }

    if (category === "sunlight") {
      return value.split("_").join(" ");
    }

  }

  return (
    <div className="my-app">
      <SeenList seenList={seenList}/>
      <Display features={features} findPlant={submitForm} banItem={banItem} banList={banList} unProcessValue={unProcessValue}/>
      <BanList banList={banList} unBanItem={unBanItem} featureOptions={featureOptions} unProcessValue={unProcessValue}/>
    </div>
  )
}

export default App