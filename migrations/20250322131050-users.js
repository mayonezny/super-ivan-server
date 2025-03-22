'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, 
        primaryKey: true, 
        allowNull: false, 
        validate: { isUUID: 4 }
      },
      email: {
        type: Sequelize.STRING(40), 
        allowNull: false, 
        unique: true, 
        validate: { isEmail: true }
      },
      password: {
        type: Sequelize.STRING, 
        allowNull: false, 
        unique: true //добавить позже проверки для хешей
      },
      name: {
        type: Sequelize.STRING, 
        unique: true
      },
      href: {
        type: Sequelize.STRING
      },
      pic: {
        type: Sequelize.STRING
      },
      picFilename: {
        type: Sequelize.STRING
      },
      group: {
        type: Sequelize.STRING
      },
      birthday: {
        type: Sequelize.DATE
      },
      createdat: {
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW, 
        allowNull: false
      }

    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
