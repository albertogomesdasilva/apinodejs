// Criptografar senha
const bcrypt = require('bcrypt');



'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        name: "João Paulo",
        email: "jpgomes@gmail.com",
        password: await bcrypt.hash('123456', 8),
        situationId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "José da Silva",
        email: "josedasilva@gmail.com",
         password: await bcrypt.hash('123456', 8),
        situationId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Jaqueline Mendes",
        email: "jaquelinemendes@gmail.com",
         password: await bcrypt.hash('123456', 8),
        situationId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Fernanda Pacheco",
        email: "ferpacheco@gmail.com",
         password: await bcrypt.hash('123456', 8),
        situationId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Maria das Dores",
        email: "mdores@gmail.com",
        password: await bcrypt.hash('123456', 8),
        situationId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cristiane Gusmão",
        email: "crisgusmao@gmail.com",
        password: await bcrypt.hash('123456', 8),
        situationId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Demostenes Cruz",
        email: "democruz@gmail.com",
       password: await bcrypt.hash('123456', 8),
        situationId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Viviane Pereira",
        email: "vivica@gmail.com",
        password: await bcrypt.hash('123456', 8),
        situationId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])


  },

  async down (queryInterface, Sequelize) {

  }
};
