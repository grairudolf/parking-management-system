public class ParkingSpot {

    // Attributes
    private String spotId;
    private String location;
    private boolean occupied;

    // Constructor
    public ParkingSpot(String spotId,
                       String location,
                       boolean occupied) {

        this.spotId = spotId;
        this.location = location;
        this.occupied = occupied;
    }

    // Methods
    public void occupySpot() {
        occupied = true;
    }

    public void freeSpot() {
        occupied = false;
    }

    // Getters
    public String getSpotId() {
        return spotId;
    }

    public String getLocation() {
        return location;
    }

    public boolean isOccupied() {
        return occupied;
    }

    // Display Method
    public void displaySpot() {

        System.out.println("Spot ID: " + spotId);
        System.out.println("Location: " + location);
        System.out.println("Occupied: " + occupied);
    }
}
