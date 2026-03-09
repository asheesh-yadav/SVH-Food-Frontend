const getValidSession = () => {
  try {
    const data = typeof window !== "undefined" && localStorage.getItem("userSession");
    if (!data) return null;
    const session = JSON.parse(data);
    return session;
  } catch {
    localStorage.removeItem("userSession");
  }
  return null;
};

const GetLatLonFromFullAddress = async (fullAddress) => {
  try {
    const session = getValidSession();
    if (!session) return false;
    const response = await fetch(
      `https://api.divyam.com/api/user/get-lat-lon-address?address=${fullAddress}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error("response error", response.status);
    const data = await response.json();
    if (data.success === false) {
      return false;
    }
    return data;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// Fixed service availability check function
const checkServiceAvailability = async (userAddress) => {
  try {
    const session = getValidSession();
    if (!session) return false;

    const Addressdata = await GetLatLonFromFullAddress(userAddress);
    const results = Addressdata?.location.geocodingResults || [];
    const latLon = results[0]?.geometry.viewport.southwest || "none";

    const res = await fetch(
      `https://api.divyam.com/api/user/check-availability-under-radius?lat=${latLon.lat}&lon=${latLon.lng}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) throw new Error("response error", res.status);
    const data = await res.json();
    if (data?.isInside) {
      return true;
    }
  } catch (error) {
    console.error("Error:", error.message);
    return false;
  }
};

// Fixed event handler function

export { checkServiceAvailability };
