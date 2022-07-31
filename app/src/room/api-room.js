const create = async () => {
  try {
    const response = await fetch(`https://${window.location.hostname}/api/rooms/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const login = async (roomId, signal) => {
  try {
    const response = await fetch(`https://${window.location.hostname}/api/rooms/${roomId}`, {
      method: 'GET',
      signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const remove = async (roomId) => {
  try {
    const response = await fetch(`https://${window.location.hostname}/api/rooms/${roomId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export {
  create,
  login,
  remove
};
