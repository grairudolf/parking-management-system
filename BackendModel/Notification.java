public class Notification {

    // Attributes
    private int notificationId;
    private String message;
    private String date;
    private String time;

    // Relationships
    private Customer customer;
    private Reservation reservation;

    // Constructor
    public Notification(int notificationId,
                        String message,
                        String date,
                        String time,
                        Customer customer,
                        Reservation reservation) {

        this.notificationId = notificationId;
        this.message = message;
        this.date = date;
        this.time = time;

        this.customer = customer;
        this.reservation = reservation;
    }

    // Method
    public void sendNotification() {

        System.out.println(
            "Notification sent to " + customer.getName()
        );
    }

    // Display Method
    public void displayNotification() {

        System.out.println("Notification ID: " + notificationId);
        System.out.println("Message: " + message);
        System.out.println("Date: " + date);
        System.out.println("Time: " + time);

        System.out.println(
            "Reservation ID: " + reservation.getReservationId()
        );
    }
}