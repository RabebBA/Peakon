import axios from 'axios';

export const getUserProfile = async token => {
  try {
    const response = await axios.get('http://127.0.0.1:3001/login', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
