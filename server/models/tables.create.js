const createUserTable = `
  CREATE TABLE IF NOT EXISTS user(
    id SERIAL PRIMARY KEY NOT NULL,
    first_name VARCHAR (40) NOT NULL,
    last_name VARCHAR (40) NOT NULL,
    email VARCHAR(30) NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    createdOn TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
`;

const createBusTable = `
  CREATE TABLE IF NOT EXISTS bus(
    id SERIAL PRIMARY KEY NOT NULL,
    number_plate VARCHAR(10) NOT NULL,
    manufacturer VARCHAR(50) NOT NULL,
    model VARCHAR(10),
    year VARCHAR(10),
    capacity INTEGER,
    createdOn TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
`;

const createTripTable = `
  CREATE TABLE IF NOT EXISTS trip(
    id SERIAL PRIMARY KEY NOT NULL,
    bus_id INTEGER NOT NULL,
    origin VARCHAR(50) NOT NULL,
    destination VARCHAR(10) NOT NULL,
    trip_date TIMESTAMP,
    fare NUMERIC(10,2) NOT NULL,
    status VARCHAR(10) DEFAULT 'active',
    createdOn TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
`;

const createBookingTable = `
  CREATE TABLE IF NOT EXISTS booking(
    id SERIAL PRIMARY KEY NOT NULL,
    trip_id INTEGER REFERENCES trip(id) NOT NULL,
    user_id INTEGER REFERENCES user(id) NOT NULL,
    createdOn TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
`;

const createQuery = `${createUserTable}${createBusTable}${createTripTable}${createBookingTable}`;
export default createQuery;
