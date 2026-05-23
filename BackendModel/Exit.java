public class Exit {

    // Attributes
    private int exitId;
    private String exitDate;
    private String exitTime;
    private String status;

    // Relationships
    private Vehicle vehicle;
    private SecurityGuard securityGuard;
    private Payment payment;

    // Constructor
    public Exit(int exitId,
                String exitDate,
                String exitTime,
                String status,
                Vehicle vehicle,
                SecurityGuard securityGuard,
                Payment payment) {

        this.exitId = exitId;
        this.exitDate = exitDate;
        this.exitTime = exitTime;
        this.status = status;

        this.vehicle = vehicle;
        this.securityGuard = securityGuard;
        this.payment = payment;
    }

    // Methods
    public void validateExit() {

        if(payment != null) {

            status = "Approved";

            System.out.println(
                "Vehicle Exit Approved"
            );
        }
    }

    // Display Method
    public void displayExit() {

        System.out.println("===== EXIT =====");

        System.out.println("Exit ID: " + exitId);
        System.out.println("Exit Date: " + exitDate);
        System.out.println("Exit Time: " + exitTime);
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