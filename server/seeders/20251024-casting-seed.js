'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();

    const addDays = days => {
      const date = new Date();
      date.setDate(now.getDate() + days);
      return date;
    };

    const castings = [
      {
        AGN_ID: 1,
        CST_Title: '"Midnight Garden" - Editorial for VOGUE',
        CST_Description:
          'Seeking models with strong, unique, and avant-garde features for a 6-page editorial spread. The mood is dark, romantic, and ethereal. Shoot will take place in a historic manor outside Paris.',
        CST_Requirements:
          'Must have agency representation and prior editorial experience. Walk-ins will not be seen. Please submit a full portfolio and unretouched digitals.',
        CST_Payment: 1200.0,
        CST_Status: 'active',
        CST_StartDate: addDays(10),
        CST_EndDate: addDays(40),
        CST_CoverImage: '/uploads/casting1.jpg',
        CST_Type: 'editorial',
        CST_Gender: 'female',
        CST_AgeMin: 18,
        CST_AgeMax: 25,
        CST_HeightMin: 177,
        CST_HeightMax: 182,
        CST_LocationType: 'on_site',
        CST_Country: 'France',
        CST_City: 'Paris',
        createdAt: now,
        updatedAt: now,
      },

      {
        AGN_ID: 2,
        CST_Title: 'Urban Activewear - E-commerce Lookbook',
        CST_Description:
          'Casting for a new, inclusive activewear brand. We are looking for models with athletic and diverse body types to showcase our new collection. Must be comfortable holding dynamic/athletic poses.',
        CST_Requirements:
          'All genders and body types are welcome. Please submit digitals including a full-body shot in athletic wear. Prior fitness modeling is a plus.',
        CST_Payment: 800.0,
        CST_Status: 'active',
        CST_StartDate: addDays(5),
        CST_EndDate: addDays(25),
        CST_CoverImage: '/uploads/casting2.jpg',
        CST_Type: 'commercial',
        CST_Gender: 'any',
        CST_AgeMin: 18,
        CST_AgeMax: 30,
        CST_HeightMin: null,
        CST_HeightMax: null,
        CST_LocationType: 'on_site',
        CST_Country: 'USA',
        CST_City: 'New York, NY',
        createdAt: now,
        updatedAt: now,
      },

      {
        AGN_ID: 3,
        CST_Title: 'National Bank TV Commercial - "The Family"',
        CST_Description:
          'Casting for main and supporting roles for a national banking commercial. We are looking for "real people" looks: friendly young couple (25-35), a trustworthy grandparent (60-75), and a child (6-8).',
        CST_Requirements:
          'No visible tattoos on face or neck. Acting experience is a major plus. Must be available for a 2-day shoot.',
        CST_Payment: 4500.0,
        CST_Status: 'active',
        CST_StartDate: addDays(15),
        CST_EndDate: addDays(45),
        CST_CoverImage: '/uploads/casting3.jpg',
        CST_Type: 'commercial',
        CST_Gender: 'any',
        CST_AgeMin: 6,
        CST_AgeMax: 75,
        CST_HeightMin: null,
        CST_HeightMax: null,
        CST_LocationType: 'on_site',
        CST_Country: 'Ukraine',
        CST_City: 'Kyiv',
        createdAt: now,
        updatedAt: now,
      },

      {
        AGN_ID: 1,
        CST_Title: 'Milan Fashion Week - Designer Showcase',
        CST_Description:
          'Seeking experienced male models for a high-profile runway show during MFW. Must have a strong, commanding walk and professional attitude. Fittings will be 3 days prior.',
        CST_Requirements:
          'Strict requirements: Waist 29-31 inches. Suit size 48-50 EU. Must provide a video of your runway walk.',
        CST_Payment: 750.0,
        CST_Status: 'active',
        CST_StartDate: addDays(30),
        CST_EndDate: addDays(60),
        CST_CoverImage: '/uploads/casting4.jpg',
        CST_Type: 'runway',
        CST_Gender: 'male',
        CST_AgeMin: 17,
        CST_AgeMax: 24,
        CST_HeightMin: 185,
        CST_HeightMax: 191,
        CST_LocationType: 'on_site',
        CST_Country: 'Italy',
        CST_City: 'Milan',
        createdAt: now,
        updatedAt: now,
      },

      {
        AGN_ID: 4,
        CST_Title: '"Natural Glow" - Organic Skincare Campaign',
        CST_Description:
          'We are casting for a new organic skincare brand. Looking for models with clear, natural skin, and expressive faces. Freckles, unique features are a huge plus. This is a print + digital campaign.',
        CST_Requirements:
          'All ethnicities welcome. Please send unretouched digitals (close-up and profile) with natural light. No makeup for the casting.',
        CST_Payment: 2000.0,
        CST_Status: 'active',
        CST_StartDate: addDays(8),
        CST_EndDate: addDays(30),
        CST_CoverImage: '/uploads/casting5.jpg',
        CST_Type: 'commercial',
        CST_Gender: 'female',
        CST_AgeMin: 20,
        CST_AgeMax: 35,
        CST_HeightMin: null,
        CST_HeightMax: null,
        CST_LocationType: 'on_site',
        CST_Country: 'Germany',
        CST_City: 'Berlin',
        createdAt: now,
        updatedAt: now,
      },

      {
        AGN_ID: 5,
        CST_Title: 'TFP Shoot for Sustainable Fashion Startup',
        CST_Description:
          'Looking for new faces to collaborate on a TFP (Time for Print) basis for our sustainable fashion lookbook. This is a great opportunity to build your portfolio with high-quality images.',
        CST_Requirements:
          'No experience required, but must be professional and punctual. We will provide all apparel and high-res images.',
        CST_Payment: 0.0,
        CST_Status: 'active',
        CST_StartDate: addDays(3),
        CST_EndDate: addDays(14),
        CST_CoverImage: '/uploads/casting6.jpg',
        CST_Type: 'tfp',
        CST_Gender: 'any',
        CST_AgeMin: 16,
        CST_AgeMax: 25,
        CST_HeightMin: null,
        CST_HeightMax: null,
        CST_LocationType: 'on_site',
        CST_Country: 'UK',
        CST_City: 'London',
        createdAt: now,
        updatedAt: now,
      },

      {
        AGN_ID: 6,
        CST_Title: 'Remote UGC Content for Tech Gadget',
        CST_Description:
          'We need 10-15 models/creators to shoot short (15-30 sec) User-Generated Content (UGC) videos with our new smart home device (will be shipped to you).',
        CST_Requirements:
          'Must have a smartphone with a high-quality camera (iPhone 12/Pixel 5 or newer). Must be fluent in English and have a "vlogger" style personality. Modern home interior is a must.',
        CST_Payment: 800.0,
        CST_Status: 'active',
        CST_StartDate: addDays(2),
        CST_EndDate: addDays(30),
        CST_CoverImage: '/uploads/casting7.jpg',
        CST_Type: 'commercial',
        CST_Gender: 'any',
        CST_AgeMin: 20,
        CST_AgeMax: 40,
        CST_HeightMin: null,
        CST_HeightMax: null,
        CST_LocationType: 'remote',
        CST_Country: null,
        CST_City: null,
        createdAt: now,
        updatedAt: now,
      },

      {
        AGN_ID: 7,
        CST_Title: 'Promo Models for Tech Conference',
        CST_Description:
          'Looking for energetic and professional promo models to manage a booth at a major tech conference. Duties include greeting attendees, scanning badges, and explaining the product.',
        CST_Requirements:
          'Must be outgoing, professional, and able to stand for long periods. Business-casual attire required. Must be fluent in English.',
        CST_Payment: 1000.0,
        CST_Status: 'pending',
        CST_StartDate: addDays(40),
        CST_EndDate: addDays(42),
        CST_CoverImage: '/uploads/casting8.jpg',
        CST_Type: 'promo',
        CST_Gender: 'any',
        CST_AgeMin: 21,
        CST_AgeMax: 30,
        CST_HeightMin: null,
        CST_HeightMax: null,
        CST_LocationType: 'on_site',
        CST_Country: 'Poland',
        CST_City: 'Warsaw',
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert('Castings', castings, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Castings', null, {});
  },
};
