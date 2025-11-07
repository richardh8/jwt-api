import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Animal } from '../types/animal';
import { getAnimalById, createAnimal, updateAnimal } from '../services/animalService';

const AnimalForm = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Omit<Animal, 'id'>>({
    name: '',
    species: '',
    age: 0,
    gender: '',
    race: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode && id) {
      const loadAnimal = async () => {
        try {
          setLoading(true);
          const animal = await getAnimalById(id);
          setFormData({
            name: animal.name,
            species: animal.species,
            age: animal.age,
            gender: animal.gender,
            race: animal.race,
          });
        } catch (error) {
          console.error('Error loading animal:', error);
          setError('Failed to load animal data');
        } finally {
          setLoading(false);
        }
      };
      loadAnimal();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditMode && id) {
        await updateAnimal(id, formData);
      } else {
        await createAnimal(formData);
      }
      navigate('/animals');
    } catch (error) {
      console.error('Error saving animal:', error);
      setError('Failed to save animal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="text-center py-8">Loading animal data...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Animal' : 'Add New Animal'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="label">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="species" className="label">Species *</label>
              <input
                type="text"
                id="species"
                name="species"
                value={formData.species}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="label">Gender *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="race" className="label">Race *</label>
              <input
                type="text"
                id="race"
                name="race"
                value={formData.race}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="age" className="label">Age (years) *</label>
            <input
              type="number"
              id="age"
              name="age"
              min="0"
              value={formData.age}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/animals')}
            className="btn bg-gray-300 hover:bg-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Animal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnimalForm;
