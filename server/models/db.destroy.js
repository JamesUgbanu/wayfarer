const userDestroy = 'DROP TABLE IF EXISTS user CASCADE; ';
const createBusTable = 'DROP TABLE IF EXISTS bus CASCADE; ';
const createTripTable = 'DROP TABLE IF EXISTS trip CASCADE; ';
const createBookingTable = 'DROP TABLE IF EXISTS booking CASCADE';

const destroyQuery = `${userDestroy}${createBusTable}${createTripTable}${createBookingTable}`;

export default destroyQuery;
