import axios from 'axios';
import { Animal, AnimalFilters } from '../types/animal';

// Use relative URL to leverage the Vite proxy
const API_URL = '/api/animals';

// Function to get auth header with token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getAnimals = async (filters?: AnimalFilters): Promise<Animal[]> => {
  try {
    const response = await axios.get(API_URL, { 
      params: {
        ...(filters?.q ? { q: filters.q } : {}), // Add search query parameter if it exists
        ...(filters?.name && { name: filters.name }),
        ...(filters?.species && { species: filters.species }),
        ...(filters?.race && { race: filters.race }),
        ...(filters?.gender && { gender: filters.gender }),
        ...(filters?.minAge && { age_gte: filters.minAge }),
        ...(filters?.maxAge && { age_lte: filters.maxAge }),
      },
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      withCredentials: true
    });
    
    // Handle both array and object responses
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && response.data.data) {
      return response.data.data; // Handle { data: [...] } format
    }
    return [];
  } catch (error) {
    console.error('Error fetching animals:', error);
    throw error;
  }
};

export const getAnimalById = async (id: string): Promise<Animal> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      withCredentials: true
    });
    
    // Handle both direct object and nested data property
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching animal with id ${id}:`, error);
    throw error;
  }
};

export const createAnimal = async (animalData: Omit<Animal, 'id'>): Promise<Animal> => {
  try {
    const response = await axios.post(API_URL, animalData, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      withCredentials: true
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error creating animal:', error);
    throw error;
  }
};

export const updateAnimal = async (id: string, animalData: Partial<Animal>): Promise<Animal> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, animalData, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      withCredentials: true
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating animal:', error);
    throw error;
  }
};

export const deleteAnimal = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        ...getAuthHeader()
      },
      withCredentials: true
    });
  } catch (error) {
    console.error('Error deleting animal:', error);
    throw error;
  }
};
