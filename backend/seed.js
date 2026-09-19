const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pet = require('./models/Pet');
const Task = require('./models/Task');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
  try {
    await Pet.deleteMany();
    await Task.deleteMany();

    console.log('🧹 Existing pets and tasks cleared.');

    const pets = await Pet.insertMany([
      {
        name: 'Milo',
        species: 'Dog',
        breed: 'Golden Retriever',
        age: 3,
      },
      {
        name: 'Luna',
        species: 'Cat',
        breed: 'Persian',
        age: 2,
      },
      {
        name: 'Barnaby',
        species: 'Rabbit',
        breed: 'Holland Lop',
        age: 1,
      },
    ]);

    console.log(`🐾 Inserted ${pets.length} pets.`);

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 5);

    const tasks = [
      {
        title: 'Morning Feeding & Fresh Water',
        category: 'feeding',
        dueDate: today,
        status: 'pending',
        pet: pets[0]._id, // Milo
      },
      {
        title: 'Annual Rabies Vaccine & Wellness Exam',
        category: 'vet',
        dueDate: tomorrow,
        status: 'pending',
        pet: pets[0]._id, // Milo
      },
      {
        title: 'Administer Ear Drops (Morning dose)',
        category: 'medication',
        dueDate: today,
        status: 'pending',
        pet: pets[1]._id, // Luna
      },
      {
        title: 'Fur Brushing & Claw Trimming',
        category: 'grooming',
        dueDate: nextWeek,
        status: 'pending',
        pet: pets[1]._id, // Luna
      },
      {
        title: 'Refill Timothy Hay & Clean Enclosure',
        category: 'feeding',
        dueDate: today,
        status: 'pending',
        pet: pets[2]._id, // Barnaby
      },
      {
        title: 'Routine Vet Dental Checkup',
        category: 'vet',
        dueDate: nextWeek,
        status: 'pending',
        pet: pets[2]._id, // Barnaby
      },
      {
        title: 'Evening Kibble & Flea Medication',
        category: 'medication',
        dueDate: today,
        status: 'completed',
        pet: pets[0]._id, // Milo
      },
    ];

    await Task.insertMany(tasks);
    console.log(`📋 Inserted ${tasks.length} tasks.`);
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error(`❌ Seeding error: ${error.message}`);
  }
};

module.exports = seedData;

if (require.main === module) {
  connectDB().then(async () => {
    await seedData();
    process.exit();
  });
}
