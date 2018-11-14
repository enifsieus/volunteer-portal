/**
 * Event Store
 *
 * TODO: Make it real.
 *
 * @author mtownsend
 * @since Oct 2017
 */

const fakeStore = {
  0: {
    id: 0,
    active: false,
    name: 'Firefly 2017',
    numDepartments: 4,
    numVolunteers: 12304,
    startDate: new Date(2017, 8, 18, 12),
    endDate: new Date(2017, 8, 23, 12),
    registrationStart: new Date(2017, 8, 18, 12),
    registrationEnd: new Date(2017, 8, 23, 12),
    address: '123 Christian Hill Drive',
    photo: 'firefly.png',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    lead: 1,
    lottery: {
      status: 'prereg',
      waitlisted: 1024
    }
  },
  1: {
    id: 1,
    active: true,
    name: 'Hyperborea 2018',
    numDepartments: 4,
    numVolunteers: 12304,
    startDate: new Date(2018, 8, 18, 12),
    endDate: new Date(2018, 8, 23, 12),
    registrationStart: new Date(2018, 8, 18, 12),
    registrationEnd: new Date(2018, 8, 23, 12),
    address: '123 Christian Hill Drive',
    photo: 'hrpdrp.png',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    lead: 1,
    lottery: {
      status: 'active',
      waitlisted: 1024
    }
  },
  2: {
    id: 2,
    active: true,
    name: 'Decomp 2018',
    numDepartments: 4,
    numVolunteers: 12304,
    startDate: new Date(2018, 8, 18, 12),
    endDate: new Date(2018, 8, 23, 12),
    registrationStart: new Date(2018, 8, 18, 12),
    registrationEnd: new Date(2018, 8, 23, 12),
    address: '123 Christian Hill Drive',
    photo: 'decomp.png',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    lead: 1,
    lottery: {
      status: 'prereg',
      waitlisted: 1024
    }
  }
};

/**
 * Gets an event by id
 * @param {number} id - The id of the event to retrieve
 * @returns {Promise<object|null>} Promise resolving to the event, or null if it cannot be found
 */
export function getById(id) {

  return new Promise(resolve => {
    if (id == null) {
      // Return all summaries
      resolve(Object.assign({}, fakeStore));
    }

    resolve(fakeStore[id]);
  });
}
