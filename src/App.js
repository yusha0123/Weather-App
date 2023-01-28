import { CircularProgress, Stack } from "@mui/material";
import "./App.css";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

function App() {
  const [city, setCity] = useState("Kolkata");
  const [input, setInput] = useState("");
  const [responseObj, setresponseObj] = useState({});
  const [data, isdata] = useState(false);
  const [loading, isLoading] = useState(false);

  const handleClick = () => {
    setCity(input);
  };

  useEffect(() => {
    if (!city) {
      return;
    }
    const fetch_api = () => {
      isLoading(true);
      const api_key = process.env.REACT_APP_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`;
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            Swal.fire({
              icon: "error",
              title: `${city} is not a valid City!`,
              showConfirmButton: false,
              timer: 1500,
            });
            isLoading(false);
          }
          return response.json();
        })
        .then((data) => {
          isdata(true);
          setresponseObj({
            name: data.name,
            speed: data.wind.speed,
            description: data.weather[0].description,
            temperature: data.main.temp,
            humidity: data.main.humidity,
          });
          isLoading(false);
        });
    };
    fetch_api();
    setInput("");
  }, [city]);

  return (
    <>
      <div className="card">
        <TextField
          label="Enter City"
          value={input}
          sx={{
            width: "100%",
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  color="secondary"
                  onClick={handleClick}
                  disabled={!input}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          m={2}
        >
          {!data ? (
            ""
          ) : loading ? (
            <CircularProgress />
          ) : (
            <div className="weather-box">
              <h1>{`Weather in ${responseObj.name}`}</h1>
              <h2>{`Temperature : ${responseObj.temperature}\u00B0C`}</h2>
              <h2>{`Wind Speed : ${responseObj.speed} Km/Hr`}</h2>
              <h2>{`Humidity : ${responseObj.humidity}%`}</h2>
              <h2>{`Description : ${responseObj.description}`}</h2>
            </div>
          )}
        </Stack>
      </div>
    </>
  );
}

export default App;
