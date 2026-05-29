CREATE DATABASE parking_system;

CREATE TABLE Customer (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15),
    email VARCHAR(100)
);

CREATE TABLE Vehicle (
    vehicle_id SERIAL PRIMARY KEY,
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50),
    customer_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
);

CREATE TABLE Parking_spots (
    spot_id SERIAL PRIMARY KEY,
    spot_number VARCHAR(10) NOT NULL UNIQUE,
    spot_status VARCHAR(20) DEFAULT 'available'
        CHECK (spot_status IN ('available', 'occupied'))
);

CREATE TABLE Security_guards (
    guard_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15)
);

CREATE TABLE Receipt (
    receipt_id SERIAL PRIMARY KEY,
    issue_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL
);

CREATE TABLE Reservation (
    reservation_id SERIAL PRIMARY KEY,
    reservation_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'active'
        CHECK (status IN ('active', 'completed', 'cancelled')),
    customer_id INT NOT NULL,
    spot_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (spot_id) REFERENCES Parking_spots(spot_id)
);

CREATE TABLE Vehicle_entry (
    entry_id SERIAL PRIMARY KEY,
    vehicle_id INT NOT NULL,
    entry_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    spot_id INT NOT NULL,
    guard_id INT,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicle(vehicle_id),
    FOREIGN KEY (spot_id) REFERENCES Parking_spots(spot_id),
    FOREIGN KEY (guard_id) REFERENCES Security_guards(guard_id)
);

CREATE TABLE Vehicle_exit (
    exit_id SERIAL PRIMARY KEY,
    entry_id INT NOT NULL,
    exit_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    receipt_id INT,
    guard_id INT,
    FOREIGN KEY (entry_id) REFERENCES Vehicle_entry(entry_id),
    FOREIGN KEY (receipt_id) REFERENCES Receipt(receipt_id),
    FOREIGN KEY (guard_id) REFERENCES Security_guards(guard_id)
);

CREATE TABLE Payment (
    payment_id SERIAL PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    payment_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    exit_id INT NOT NULL,
    FOREIGN KEY (exit_id) REFERENCES Vehicle_exit(exit_id)
);

