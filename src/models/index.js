export const users = `CREATE TABLE users (
    id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    fistname VARCHAR,
    lastname VARCHAR,
    gender_id INT,
    email VARCHAR,
    phone VARCHAR,
    address VARCHAR,
    jobrole_id INT,
    department_id VARCHAR,
    photo_url VARCHAR,
    password VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
);
`;

export const jobroles = `CREATE TABLE  jobroles (
    id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    );`;

export const genders = `CREATE TABLE  genders (
    id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    );`;

export const departments = `CREATE TABLE  departments  (
    id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    );`;
