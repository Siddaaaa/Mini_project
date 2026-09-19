const Pet = require('../models/Pet');
const Task = require('../models/Task');

// @desc    Get all pets (with pending task count)
// @route   GET /api/pets
const getPets = async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 });
    
    // Attach pending task count for each pet
    const petsWithTaskCounts = await Promise.all(
      pets.map(async (pet) => {
        const pendingTaskCount = await Task.countDocuments({
          pet: pet._id,
          status: 'pending',
        });
        const petObj = pet.toObject();
        petObj.pendingTaskCount = pendingTaskCount;
        return petObj;
      })
    );

    res.json({
      success: true,
      count: petsWithTaskCounts.length,
      data: petsWithTaskCounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error while fetching pets',
      error: error.message,
    });
  }
};

// @desc    Create a new pet
// @route   POST /api/pets
const createPet = async (req, res) => {
  try {
    const { name, species, breed, age } = req.body;

    if (!name || !species) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both name and species for the pet',
      });
    }

    const pet = await Pet.create({
      name,
      species,
      breed: breed || 'Unknown',
      age: age !== undefined && age !== '' ? Number(age) : 0,
    });

    const petObj = pet.toObject();
    petObj.pendingTaskCount = 0;

    res.status(201).json({
      success: true,
      data: petObj,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating pet',
      error: error.message,
    });
  }
};

// @desc    Delete pet and cascade delete associated tasks
// @route   DELETE /api/pets/:id
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: `Pet not found with id of ${req.params.id}`,
      });
    }

    // Cascade delete all tasks associated with this pet
    const deletedTasksResult = await Task.deleteMany({ pet: pet._id });

    // Remove pet
    await pet.deleteOne();

    res.json({
      success: true,
      message: 'Pet and associated tasks deleted successfully',
      deletedPetId: req.params.id,
      deletedTaskCount: deletedTasksResult.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting pet',
      error: error.message,
    });
  }
};

module.exports = {
  getPets,
  createPet,
  deletePet,
};
