public class Main {

    public static void main(String[] args) {

        // CREATE CUSTOMER
        Customer customer1 =
            new Customer(
                1,
                "Assonkeng Nguimdo",
                "assonkeng@gmail.com",
                "1234",
                677889900
            );

        // CREATE VEHICLE

        Vehicle vehicle1 =
            new Vehicle(
                "V001",
                "Toyota Corolla",
                "Sedan",
                "LT-123-AB",
                customer1
            );

        // Add Vehicle To Customer
        customer1.addVehicle(vehicle1);

        // CREATE PARKING SPOT

        ParkingSpot spot1 =
            new ParkingSpot(
                "A12",
                "Ground Floor",
                false
            );

        // CREATE RESERVATION
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

        // Add Reservation To Customer
        customer1.addReservation(reservation1);

        // Confirm Reservation
        reservation1.confirmReservation();

        
        // CREATE PAYMENT

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

        // CREATE RECEIPT

        Receipt receipt1 =
            new Receipt(
                9001,
                "15/05/2026",
                5000,
                "Mobile Money",
                payment1
            );

        // CREATE SECURITY GUARD

        SecurityGuard guard1 =
            new SecurityGuard(
                301,
                "Mr. Peter",
                "Morning Shift",
                690112233
            );

        // CREATE ENTRY

        Entry entry1 =
            new Entry(
                401,
                "15/05/2026",
                "08:10 AM",
                "Pending",
                vehicle1,
                guard1
            );

        // Validate Entry
        entry1.validateEntry();

        // Add Entry To Guard
        guard1.addEntry(entry1);

        // CREATE EXIT

        Exit exit1 =
            new Exit(
                701,
                "15/05/2026",
                "05:30 PM",
                "Pending",
                vehicle1,
                guard1,
                payment1
            );

        // Validate Exit
        exit1.validateExit();

        // Add Exit To Guard
        guard1.addExit(exit1);

        // CREATE NOTIFICATION

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

        // DISPLAY ALL SYSTEM DATA

        System.out.println();
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

        System.out.println("===== RECEIPT =====");
        receipt1.displayReceipt();

        System.out.println();

        System.out.println("===== SECURITY GUARD =====");
        guard1.displayGuard();

        System.out.println();

        System.out.println("===== ENTRY =====");
        entry1.displayEntry();

        System.out.println();

        System.out.println("===== EXIT =====");
        exit1.displayExit();

        System.out.println();

        System.out.println("===== NOTIFICATION =====");
        notification1.displayNotification();
    }
}