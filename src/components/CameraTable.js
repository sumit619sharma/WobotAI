import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import {API_URL , TOKEN, UPDATE_STATUS_URL} from "../Api"
const CameraTable = () => {
  const [cameras, setCameras] = useState([]);
  const [filteredCameras, setFilteredCameras] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [camerasPerPage] = useState(10);


  // Fetch cameras
  const fetchCameras = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      setCameras(response.data.data); // Assuming data is an array
      setFilteredCameras(response.data.data);
    } catch (error) {
      console.error("Error fetching cameras:", error);
    }
  };
  
  useEffect(() => {
    
    fetchCameras();
  }, []);


  // Search, status and Location Filter
  useEffect(() => {
    let filtered = cameras;

    if (search) {
      filtered = filtered.filter((camera) =>
        camera.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((camera) => camera.status === statusFilter);
    }

    if (locationFilter) {
      filtered = filtered.filter((camera) =>
        camera.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredCameras(filtered);
  }, [search, statusFilter, locationFilter, cameras]);

  // Pagination logic
  const indexOfLastCamera = currentPage * camerasPerPage;
  const indexOfFirstCamera = indexOfLastCamera - camerasPerPage;
  const currentCameras = filteredCameras.slice(indexOfFirstCamera, indexOfLastCamera);

  // Toggle status
  const updateStatus = async (id, status) => {
    // API not working, so implemented toggle status functionality on client side application.
    setCameras((prevCameras) =>
        prevCameras.map((camera) =>
          camera.id === id ? { ...camera, status: status } : camera
        )
      );
    
    // try {
    //   await axios.post(
    //     UPDATE_STATUS_URL,
    //     { id, status }, );
    //   fetchCameras();
    // } catch (error) {
    //   console.error("Error updating status:", error);
    // }
  };

  // Delete camera
  const deleteCamera = (id) => {
    setCameras(cameras.filter((camera) => camera.id !== id));
  };


  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Cameras</h1>
        <p className="text-gray-500">Manage your cameras here.</p>
      </div>
      <div className="flex justify-between items-center mb-4 space-x-4">
        {/* Location Filter */}
        <select
          className="border px-4 py-2 rounded w-1/3"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="">Location</option>
          {Array.from(new Set(cameras.map((camera) => camera.location))).map(
            (location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            )
          )}
        </select>

        {/* Status Filter */}
        <select
          className="border px-4 py-2 rounded w-1/3"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Search Input */}
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search"
            className="border px-4 py-2 rounded w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCameras.map((camera) => (
            <tr key={camera.id} className="text-center">
              <td className="border p-2">{camera.current_status.toLowerCase() =="online" ? '🟢' :'🔴'} {camera.name}</td>
              <td className="border p-2">{camera.location}</td>
              <td className="border p-2">
                <button
                  onClick={() =>
                    updateStatus(
                      camera.id,
                      camera.status === "Active" ? "Inactive" : "Active"
                    )
                  }
                  className={`px-4 py-2 rounded ${
                    camera.status === "Active" ? "bg-green-500" : "bg-red-500"
                  } text-white`}
                >
                  {camera.status}
                </button>
              </td>
              <td className="border p-2">
                <button
                  onClick={() => deleteCamera(camera.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalItems={filteredCameras.length}
        itemsPerPage={camerasPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default CameraTable;
