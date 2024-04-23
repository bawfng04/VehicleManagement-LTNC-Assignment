import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { collection, getDocs } from "firebase/firestore";
import { firebase } from '../firebase';

function VehiclesManagement({ setVehicleId, fetchVehicles, setFetchVehicles }) {
  const [vehicles, setData] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showAllVehicles, setShowAllVehicles] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  

  //GET DATA
  useEffect(() => {
    if (fetchVehicles) {
      const fetchData = async () => {
          try {
            const querySnapshot = await getDocs(collection(firebase, 'vehicles'));
            const todoData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setData(todoData);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
      };
      fetchData();
      setFetchVehicles(false);
    }
  }, [fetchVehicles, setFetchVehicles]);

  //FUNCTION    
  const handleShowAllVehicles = () => {
    setShowAllVehicles(!showAllVehicles);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const showAllBtnStyle = {
    background: showAllVehicles 
      ? 'linear-gradient(to right, #9890e3 0%, #b1f4cf 100%)'
      : 'linear-gradient(to left, #9890e3 0%, #b1f4cf 100%)',
    color: 'black',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '10px',
    maxWidth: '98%',
    fontSize: '1px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    padding: '5px 10px',
    boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
    whiteSpace: 'nowrap',
  };

  const toggleShowInfo = (vehicleId) => {
    setSelectedVehicle(vehicleId === selectedVehicle ? null : vehicleId);
    setVehicleId(selectedVehicle !== vehicleId ? vehicleId : null);
  };



  return (
    <div>
      <h2 className='VehicleManagement'>Vehicle Management</h2>
      <div>
        <h3 className="vl">
          Vehicles List
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="🔎 Search for vehicle..."
            className="searchInput"
          />
          </h3>
        <Button
          onClick={handleShowAllVehicles}
          style={showAllBtnStyle}
        >
          {showAllVehicles ? "Hide all vehicle's information" : "Show all vehicle's information"}
        </Button>
        {vehicles
          .filter((vehicle) =>
            vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        .map((vehicle) => (
          <button
            className={`VehicleUnit ${selectedVehicle === vehicle.id || showAllVehicles ? 'expanded' : ''}`}
            key={vehicle.id}

            style={
              vehicle.status === 'Working'
                ? { background: 'linear-gradient(to top, #c1dfc4 0%, #deecdd 100%)' }
                : vehicle.status === 'Maintenance'
                ? { background: 'linear-gradient(to right, #868f96 0%, #596164 100%)' }
                : vehicle.status === 'Inactive'
                ? { background: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)' }
                : {}
            }

            onClick={() => toggleShowInfo(vehicle.id)}
          >
            <strong className="VehicleName">{vehicle.name}</strong>
            <ul className="VehicleDetails">
              <li>Size: {vehicle.size ? vehicle.size : 'unknown'}</li>
              <li>Payload: {vehicle.payload ? vehicle.payload : 'unknown'}</li>
              <li>Fuel Type: {vehicle.fuel ? vehicle.fuel : 'unknown'}</li>
              <li>Status: {vehicle.status ? vehicle.status : 'unknown'}</li>
              <li>License Plate: {vehicle.licensePlate ? vehicle.licensePlate : 'unknown'}</li>
              {vehicle.image ? (
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="VehicleImage"
                  style={{
                    width: '150px',
                    maxWidth: '100%',
                    border: '2px solid black',
                    borderRadius: '5px',
                    display: 'inline-block',
                    marginRight: 'auto',
                  }}
                />
              ) : (
                <img
                  src="https://t3.ftcdn.net/jpg/02/33/69/46/360_F_233694647_8fEIOuq6QVxjFHTOhLrN3xBLYAnP8WA7.jpg"
                  alt="BrkImage"
                  className="VehicleImage"
                  style={{
                    width: '150px',
                    maxWidth: '100%',
                    border: '2px solid black',
                    borderRadius: '5px',
                    display: 'inline-block',
                    marginRight: 'auto',
                  }}
                />
              )}
            </ul>
          </button>
        ))}
      </div>
      <div className="divider"></div>
    </div>
  );
}

export default VehiclesManagement;