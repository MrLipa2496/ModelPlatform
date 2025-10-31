'use strict';

const bcrypt = require('bcrypt');
const path = require('path');

const IMAGES_DIR = path.resolve(__dirname, '..', '..', 'public', 'uploads');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = [];
    const agencies = [];

    const agencyData = [
      {
        name: 'Gucci',
        city: 'Florence',
        country: 'Italy',
        description:
          'An Italian fashion house known for its luxury and innovative design.',
      },
      {
        name: 'Chanel',
        city: 'Paris',
        country: 'France',
        description:
          'An iconic French brand specializing in haute couture and perfumery.',
      },
      {
        name: 'Louis Vuitton',
        city: 'Paris',
        country: 'France',
        description:
          'A leader in luxury goods, famous for its handbags and LV monogram.',
      },
      {
        name: 'Prada',
        city: 'Milan',
        country: 'Italy',
        description:
          'A trend-setting Italian brand known for its minimalist aesthetic.',
      },
      {
        name: 'Rolex',
        city: 'Geneva',
        country: 'Switzerland',
        description: 'A leading Swiss manufacturer of luxury watches.',
      },
      {
        name: "L'Oréal",
        city: 'Clichy',
        country: 'France',
        description:
          "The world's largest cosmetics company, owning numerous brands.",
      },

      {
        name: 'Apple',
        city: 'Cupertino',
        country: 'USA',
        description:
          'A global technology leader, known for iPhone, Mac, and innovative marketing.',
      },
      {
        name: 'Google (Alphabet)',
        city: 'Mountain View',
        country: 'USA',
        description:
          'A technology giant specializing in search, advertising, and cloud services.',
      },
      {
        name: 'Tesla',
        city: 'Austin',
        country: 'USA',
        description:
          'A leading manufacturer of electric vehicles and clean energy solutions.',
      },
      {
        name: 'Samsung',
        city: 'Suwon',
        country: 'South Korea',
        description:
          "A South Korean conglomerate, one of the world's largest electronics manufacturers.",
      },

      {
        name: 'Nike',
        city: 'Beaverton',
        country: 'USA',
        description:
          "The world's largest supplier of athletic shoes and apparel.",
      },
      {
        name: 'Adidas',
        city: 'Herzogenaurach',
        country: 'Germany',
        description:
          'A German sportswear manufacturer, the second largest in the world.',
      },
      {
        name: 'Zara (Inditex)',
        city: 'A Coruña',
        country: 'Spain',
        description:
          'A global leader in "fast fashion" with a unique distribution model.',
      },
      {
        name: 'H&M',
        city: 'Stockholm',
        country: 'Sweden',
        description:
          'A Swedish clothing retailer known for its designer collaborations.',
      },

      {
        name: 'Coca-Cola',
        city: 'Atlanta',
        country: 'USA',
        description:
          'A world-renowned company producing non-alcoholic beverages.',
      },
      {
        name: 'Disney',
        city: 'Burbank',
        country: 'USA',
        description: 'A global media and entertainment conglomerate.',
      },
      {
        name: 'Netflix',
        city: 'Los Gatos',
        country: 'USA',
        description:
          "The world's leading streaming service and production studio.",
      },

      {
        name: 'Ogilvy',
        city: 'New York',
        country: 'USA',
        description:
          'A global advertising, marketing, and PR agency founded by David Ogilvy.',
      },
      {
        name: 'Wieden+Kennedy',
        city: 'Portland',
        country: 'USA',
        description:
          'An independent creative agency famous for its work for Nike ("Just Do It").',
      },
      {
        name: 'BBDO',
        city: 'New York',
        country: 'USA',
        description:
          'A worldwide advertising network known for its creativity and effectiveness.',
      },
      {
        name: 'McCann',
        city: 'New York',
        country: 'USA',
        description:
          'A global advertising agency network, part of Interpublic Group.',
      },
      {
        name: 'Publicis Groupe',
        city: 'Paris',
        country: 'France',
        description: "One of the world's largest communications groups.",
      },
      {
        name: 'DDB',
        city: 'New York',
        country: 'USA',
        description:
          'A worldwide marketing and communications network, known for the "Think Small" campaign for VW.',
      },
      {
        name: 'Droga5',
        city: 'New York',
        country: 'USA',
        description:
          'An influential creative agency known for unconventional campaigns.',
      },
      {
        name: 'TBWA\\Chiat\\Day',
        city: 'Los Angeles',
        country: 'USA',
        description:
          'The agency behind Apple\'s iconic "1984" and "Think Different" ads.',
      },

      {
        name: 'Edelman',
        city: 'New York',
        country: 'USA',
        description:
          "The world's largest independent public relations (PR) firm.",
      },
      {
        name: 'Accenture Song',
        city: 'Dublin',
        country: 'Ireland',
        description:
          'The creative and digital arm of the global consulting firm Accenture.',
      },
      {
        name: 'Dentsu',
        city: 'Tokyo',
        country: 'Japan',
        description:
          'A Japanese international advertising and public relations company.',
      },
      {
        name: 'AKQA',
        city: 'London',
        country: 'UK',
        description: 'A global digital design and innovation agency.',
      },
      {
        name: 'Interbrand',
        city: 'New York',
        country: 'USA',
        description: 'A leading global branding consultancy.',
      },
    ];

    for (let i = 0; i < agencyData.length; i++) {
      const password = `AgencyPass${i + 1}!`;
      const hashedPassword = await bcrypt.hash(password, 10);

      users.push({
        USR_Role: 'agency',
        USR_Email: `agency${i + 1}@example.com`,
        USR_PasswordHash: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const logoFileName = `agency${i + 1}.jpg`;

      agencies.push({
        USR_ID: i + 1,
        AGN_Name: agencyData[i].name,
        AGN_City: agencyData[i].city,
        AGN_Country: agencyData[i].country,
        AGN_Description: agencyData[i].description,
        AGN_Logo: `/uploads/${logoFileName}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Users', users);
    await queryInterface.bulkInsert('Agencies', agencies);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Agencies', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};
