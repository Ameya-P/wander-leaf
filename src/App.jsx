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
    scientific_name: "...to Meet a New Plant",
    default_image: "/placeholder.avif",
    edible: "?",
    cycle: "?",
    watering: "?",
    sunlight: "?",
    indoor: "?",
  });

  const [featureOptions, setFeatureOptions] = useState({
    edible: ["","1"],
    cycle: ["perennial", "annual", "biennial", "biannual"],
    watering: ["frequent", "average", "minimum", "none"],
    sunlight: ["full_shade", "part_shade", "sun-part_shade", "full_sun"],
    indoor: ["","1"],
  })

  const [banList, setBanList] = useState({
    edible: [],
    cycle: [],
    watering: [],
    sunlight: [],
    indoor: [],
  })

  const [seenList, setSeenList] = useState([]);

  useEffect(() => {
    // The code that we want to run
    // Optional return function
  }, []) // The dependency array

  const submitForm = () => {
    e.preventDefault();
    makeQuery();
  }

  const makeQuery = () => {
    let url_starter = "https://";
    let apiWebsite = "perenual.com";

    let query = `https://perenual.com/api/v2/species-list?key=${ACCESS_KEY}`;
  }

  const callAPI = async (query) => {
    const response = await axios.get(query);
  }

  return (
    <div className="my-app">
      <SeenList/>
      <Display features={features}/>
      <BanList/>
    </div>
  )
}

export default App
