public class Main {

    public static void main(String[] args) {

        // Create Customer
        Customer customer1 =
            new Customer(
                1,
                "Assonkeng Nguimdo",
                "oassonkeng@gmail.com",
                "1234",
                683441312
            );

        // Create Vehicle
        Vehicle vehicle1 =
            new Vehicle(
                "V001",
                "Toyota Corolla",
                "Sedan",
                "LT-123-AB",
                customer1
            );

        // Add Vehicle to Customer
        customer1.addVehicle(vehicle1);

        // Create Parking Spot
        ParkingSpot spot1 =
            new ParkingSpot(
                "A12",
                "Ground Floor",
                false
            );

        // Create Reservation
        Reservation reservation1 =
            new Reservation(
                101,
                "15/05/2026",
                "08:00 AM",
                "Pending",
                customer1,
                vehicle1,
                spot1
            );

        // Add Reservation to Customer
        customer1.addReservation(reservation1);

        // Confirm Reservation
        reservation1.confirmReservation();

        // Create Payment
        Payment payment1 =
            new Payment(
                501,
                5000,
                "Mobile Money",
                "Pending",
                reservation1
            );

        // Process Payment
        payment1.processPayment();

        // Create Notification
        Notification notification1 =
            new Notification(
                1,
                "Your reservation has been confirmed",
                "15/05/2026",
                "08:05 AM",
                customer1,
                reservation1
            );

        // Send Notification
        notification1.sendNotification();

        // Display System Data
        System.out.println("===== CUSTOMER =====");
        customer1.displayCustomer();

        System.out.println();

        System.out.println("===== VEHICLE =====");
        vehicle1.displayVehicle();

        System.out.println();

        System.out.println("===== PARKING SPOT =====");
        spot1.displaySpot();

        System.out.println();

        System.out.println("===== RESERVATION =====");
        reservation1.displayReservation();

        System.out.println();

        System.out.println("===== PAYMENT =====");
        payment1.displayPayment();

        System.out.println();

        System.out.println("===== NOTIFICATION =====");
        notification1.displayNotification();
    }
}