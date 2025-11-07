import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Animal, AnimalFilters } from '../types/animal';
import { getAnimals, deleteAnimal } from '../services/animalService';

const AnimalList = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadAnimals = async () => {
      try {
        setLoading(true);
        const data = await getAnimals({});
        setAnimals(data);
      } catch (error) {
        console.error('Error loading animals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnimals();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await getAnimals({ q: searchTerm });
      setAnimals(data);
    } catch (error) {
      console.error('Error searching animals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setSearchTerm('');
    try {
      setLoading(true);
      const data = await getAnimals({});
      setAnimals(data);
    } catch (error) {
      console.error('Error loading animals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this animal?')) {
      try {
        await deleteAnimal(id.toString());
        setAnimals(animals.filter(animal => animal.id !== id));
      } catch (error) {
        console.error('Error deleting animal:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Animals</h1>
        <Link
          to="/animals/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Animal
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search animals..."
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-8">Loading animals...</div>
      ) : animals.length === 0 ? (
        <div className="text-center py-8">No animals found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Species</th>
                <th className="py-2 px-4 border-b">Breed</th>
                <th className="py-2 px-4 border-b">Gender</th>
                <th className="py-2 px-4 border-b">Age</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {animals.map((animal) => (
                <tr key={animal.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{animal.name}</td>
                  <td className="py-2 px-4 border-b">{animal.species}</td>
                  <td className="py-2 px-4 border-b">{animal.race}</td>
                  <td className="py-2 px-4 border-b">{animal.gender}</td>
                  <td className="py-2 px-4 border-b">{animal.age}</td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <Link
                      to={`/animals/edit/${animal.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => animal.id && handleDelete(animal.id)}
                      className="text-red-500 hover:underline ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AnimalList;