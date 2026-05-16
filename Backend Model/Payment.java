public class Payment {

    // Attributes
    private int paymentId;
    private double amount;
    private String paymentMethod;
    private String paymentStatus;

    // Relationship
    private Reservation reservation;

    // Constructor
    public Payment(int paymentId,
                   double amount,
                   String paymentMethod,
                   String paymentStatus,
                   Reservation reservation) {

        this.paymentId = paymentId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.reservation = reservation;
    }

    // Methods
    public void processPayment() {
        paymentStatus = "Paid";
    }

    // Display Method
    public void displayPayment() {

        System.out.println("Payment ID: " + paymentId);
        System.out.println("Amount: " + amount);
        System.out.println("Method: " + paymentMethod);
        System.out.println("Status: " + paymentStatus);

        System.out.println(
            "Reservation ID: " + reservation.getReservationId()
        );
    }
}