-- CREATE DATABASE parking_management;

CREATE TABLE customers (
    customer_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telephone VARCHAR(20) NOT NULL
);

CREATE TABLE vehicles (
    vehicle_id VARCHAR(36) PRIMARY KEY,
    model VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    plate_number VARCHAR(20) NOT NULL UNIQUE,
    customer_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE parking_spots (
    spot_id VARCHAR(36) PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    occupied BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE gates (
    gate_id VARCHAR(36) PRIMARY KEY,
    gate_number VARCHAR(50) NOT NULL,
    gate_type VARCHAR(20) NOT NULL
);

CREATE TABLE security_guards (
    guard_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50),
    gate_id VARCHAR(36),
    FOREIGN KEY (gate_id) REFERENCES gates(gate_id)
);

CREATE TABLE reservations (
    reservation_id VARCHAR(36) PRIMARY KEY,
    reservation_date VARCHAR(20) NOT NULL,
    reservation_time VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    customer_id VARCHAR(36) NOT NULL,
    spot_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (spot_id) REFERENCES parking_spots(spot_id)
);

CREATE TABLE entries (
    entry_id VARCHAR(36) PRIMARY KEY,
    entry_time TIMESTAMP NOT NULL,
    vehicle_id VARCHAR(36) NOT NULL,
    reservation_id VARCHAR(36) NOT NULL,
    gate_id VARCHAR(36),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id),
    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id),
    FOREIGN KEY (gate_id) REFERENCES gates(gate_id)
);

CREATE TABLE exits (
    exit_id VARCHAR(36) PRIMARY KEY,
    exit_time TIMESTAMP NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 0,
    entry_id VARCHAR(36) NOT NULL UNIQUE,
    gate_id VARCHAR(36),
    FOREIGN KEY (entry_id) REFERENCES entries(entry_id),
    FOREIGN KEY (gate_id) REFERENCES gates(gate_id)
);

CREATE TABLE payments (
    payment_id VARCHAR(36) PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    reservation_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
);

CREATE TABLE receipts (
    receipt_id VARCHAR(36) PRIMARY KEY,
    receipt_number VARCHAR(50) NOT NULL UNIQUE,
    issue_date TIMESTAMP NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_id VARCHAR(36) NOT NULL UNIQUE,
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id)
);
