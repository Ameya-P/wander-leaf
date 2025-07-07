import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import Display from './Components/Display';
import BanList from './Components/BanList';
import SeenList from './Components/SeenList';

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [features, setFeatures] = useState({
    common_name: "Press Discover...!",
    scientific_name: "...to meet a new plant",
    default_image: "/placeholder.png",
    edible: "?",
    cycle: "?",
    watering: "?",
    sunlight: "?",
    indoor: "?",
  });

  const [featureOptions, setFeatureOptions] = useState({
    edible: ["0", "1"], // Fixed: removed empty strings
    cycle: ["perennial", "annual"],
    watering: ["frequent", "average", "minimum"],
    sunlight: ["full_shade", "part_shade", "full_sun"],
    indoor: ["0", "1"], // Fixed: removed empty strings
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
      urlValues[key] = valsList[Math.floor(Math.random() * valsList.length)];
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
        default_image: plantData.default_image?.regular_url || "/placeholder.avif",
        edible: plantData.edible_fruit || plantData.edible_leaf ? "Yes" : "No",
        cycle: plantData.cycle || "Unknown",
        watering: plantData.watering || "Unknown",
        sunlight: plantData.sunlight || "Unknown",
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
    setSeenList([...seenList, (features.common_name, features.default_image)]);
  }

  const banItem = (event) => {
    const category = event.target.dataset.category;
    const value = event.target.dataset.value;

    // Prevent banning unknown values
    if (value === "Unknown" || value === "?") {
      alert("You cannot ban an unknown value!");
      return;
    }

    // Convert display value to API value
    const processedValue = processValue(category, value);

    // Check if already banned to prevent duplicates
    if (banList[category].includes(processedValue)) {
      alert(`"${value}" is already banned!`);
      return;
    }

    // Remove from available options and add to ban list
    const updatedOptions = featureOptions[category].filter(option => option !== processedValue);
    const updatedBanList = [...banList[category], processedValue];

    setFeatureOptions({
      ...featureOptions,
      [category]: updatedOptions
    });

    setBanList({
      ...banList,
      [category]: updatedBanList
    });
  };

  const processValue = (category, value) => {
    // Categories that use string values as-is
    const stringCategories = ["cycle", "watering", "sunlight"];

    if (stringCategories.includes(category)) {
      return value;
    }

    // For edible and indoor categories, convert Yes/No to 1/0
    return value === "Yes" ? "1" : "0";
  };

  const unBanItem = () => {
    const category = event.target.dataset.category;
    const value = event.target.dataset.value;

    // Convert display value to API value
    const processedValue = processValue(category, value);

    // Check if already banned to prevent duplicates
    if (featureOptions[category].includes(processedValue)) {
      alert(`"${value}" is already allowed!`);
      return;
    }

    // Remove from available options and add to ban list
    const updatedOptions = [...featureOptions[category], processedValue];
    const updatedBanList = banList[category].filter(option => option !== processedValue);

    setFeatureOptions({
      ...featureOptions,
      [category]: updatedOptions
    });

    setBanList({
      ...banList,
      [category]: updatedBanList
    });
  }

  return (
    <div className="my-app">
      <SeenList seenList={seenList}/>
      <Display features={features} findPlant={submitForm} banItem={banItem} banList={banList}/>
      <BanList banList={banList} unBanItem={unBanItem} featureOptions={featureOptions}/>
    </div>
  )
}

export default App