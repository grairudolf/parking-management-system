public class Reservation {

    // Attributes
    private int reservationId;
    private String reservationDate;
    private String reservationTime;
    private String status;

    // Relationships
    private Customer customer;
    private Vehicle vehicle;
    private ParkingSpot parkingSpot;

    // Constructor
    public Reservation(int reservationId,
                       String reservationDate,
                       String reservationTime,
                       String status,
                       Customer customer,
                       Vehicle vehicle,
                       ParkingSpot parkingSpot) {

        this.reservationId = reservationId;
        this.reservationDate = reservationDate;
        this.reservationTime = reservationTime;
        this.status = status;

        this.customer = customer;
        this.vehicle = vehicle;
        this.parkingSpot = parkingSpot;
    }

    // Methods
    public void confirmReservation() {
        status = "Confirmed";
        parkingSpot.occupySpot();
    }

    public void cancelReservation() {
        status = "Cancelled";
        parkingSpot.freeSpot();
    }

    // Getters
    public int getReservationId() {
        return reservationId;
    }

    public String getStatus() {
        return status;
    }

    public Customer getCustomer() {
        return customer;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public ParkingSpot getParkingSpot() {
        return parkingSpot;
    }

    // Display Method
    public void displayReservation() {

        System.out.println("Reservation ID: " + reservationId);
        System.out.println("Date: " + reservationDate);
        System.out.println("Time: " + reservationTime);
        System.out.println("Status: " + status);

        System.out.println("Customer: " + customer.getName());
        System.out.println("Vehicle: " + vehicle.getModel());
        System.out.println("Parking Spot: " + parkingSpot.getSpotId());
    }
}
