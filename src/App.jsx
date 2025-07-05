import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import Display from './Components/Display';
import BanList from './Components/BanList';
import SeenList from './Components/SeenList';
const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [features, setFeatures] = useState({
    common_name: "Press Discover to Meet a New Plant!",
    default_image: "/placeholder.avif",
    edible: "?",
    cycle: "?",
    watering: "?",
    sunlight: "?",
    indoor: "?",
  });

  const [banList, setBanList] = useState([]);
  const [seenList, setSeenList] = useState([]);

  useEffect(() => {
    // The code that we want to run
    // Optional return function
  }, []) // The dependency array

  return (
    <div className="my-app">
      <SeenList/>
      <Display features={features}/>
      <BanList/>
    </div>
  )
}

export default App
