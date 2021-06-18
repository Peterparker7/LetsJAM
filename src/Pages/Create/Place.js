import React, { useState } from "react";
import styled from "styled-components";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

function Place(props) {
  const [address, setAddress] = useState("");
  // const [coordinates, setCoordinates] = useState({
  //   lat: null,
  //   lng: null,
  // });
  // const [placeone, setPlaceone] = useState("");

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    console.log(results);

    const latLng = await getLatLng(results[0]);
    console.log(latLng);

    setAddress(value);
    // setCoordinates(latLng);
  };

  // const center = { lat: 25, lng: 121 };
  // Create a bounding box with sides ~10km away from the center point
  // const defaultBounds = {
  //   north: center.lat + 0.1,
  //   south: center.lat - 0.1,
  //   east: center.lng + 0.1,
  //   west: center.lng - 0.1,
  // };
  const searchOptions = {
    // bounds: defaultBounds,
    location: new window.google.maps.LatLng(25, 121),
    radius: 20,
    // types: [],
    componentRestrictions: { country: "tw" },
    types: [],
  };

  const handleClick = async (e) => {
    props.setPlace(e);
    // setPlaceone(e);
    setAddress(e);
    // const results = await geocodeByAddress(e);
    // const latLng = await getLatLng(results[0]);
    // console.log(latLng);
  };
  console.log(address);
  // props.setPlace(address);
  return (
    <InputField>
      <PlacesAutocomplete
        style={{ position: "relative", width: "100%" }}
        value={address}
        onChange={(value) => {
          setAddress(value);
          props.setPlace(value);
          props.setPlaceStatus(true);
        }}
        onSelect={handleSelect}
        searchOptions={searchOptions}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div style={{ width: "100%" }}>
            <PlaceInput
              {...getInputProps({
                placeholder: "請輸入地點",
                className: "location-search-input",
              })}
            />
            <PlaceOption className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion, index) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    key={index}
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                    onClick={(e) => {
                      handleClick(suggestion.description);
                      console.log(suggestion.description);
                    }}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </PlaceOption>
          </div>
        )}
      </PlacesAutocomplete>
    </InputField>
  );
}
const InputField = styled.div`
  width: 220px;
  height: 40px;
  @media (max-width: 768px) {
    width: 90%;
  }
  @media (max-width: 576px) {
    width: 90%;
  }
`;
const PlaceInput = styled.input`
  /* position: relative; */
  border-bottom: 1px solid #979797;
  width: 220px;
  /* height: 40px; */
  padding: 5px;
  ::placeholder {
    color: #aaa;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
  @media (max-width: 576px) {
  }
`;
const PlaceOption = styled.div`
  position: absolute;
  border: 1px solid #979797;
  z-index: 2;
`;

export default Place;
