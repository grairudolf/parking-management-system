public class Entry {

    // Attributes
    private int entryId;
    private String entryDate;
    private String entryTime;
    private String status;

    // Relationships
    private Vehicle vehicle;
    private SecurityGuard securityGuard;

    // Constructor
    public Entry(int entryId,
                 String entryDate,
                 String entryTime,
                 String status,
                 Vehicle vehicle,
                 SecurityGuard securityGuard) {

        this.entryId = entryId;
        this.entryDate = entryDate;
        this.entryTime = entryTime;
        this.status = status;

        this.vehicle = vehicle;
        this.securityGuard = securityGuard;
    }

    // Methods
    public void validateEntry() {

        status = "Approved";

        System.out.println(
            "Vehicle Entry Approved"
        );
    }

    // Getters
    public int getEntryId() {
        return entryId;
    }

    public String getStatus() {
        return status;
    }

    // Display Method
    public void displayEntry() {

        System.out.println("===== ENTRY =====");

        System.out.println("Entry ID: " + entryId);
        System.out.println("Entry Date: " + entryDate);
        System.out.println("Entry Time: " + entryTime);
        System.out.println("Status: " + status);

        System.out.println(
            "Vehicle: " +
            vehicle.getModel()
        );

        System.out.println(
            "Validated By: " +
            securityGuard.getName()
        );
    }
}