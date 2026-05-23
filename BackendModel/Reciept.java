public class Receipt {

    // Attributes
    private int receiptId;
    private String issueDate;
    private double amount;
    private String paymentMethod;

    // Relationship
    private Payment payment;

    // Constructor
    public Receipt(int receiptId,
                   String issueDate,
                   double amount,
                   String paymentMethod,
                   Payment payment) {

        this.receiptId = receiptId;
        this.issueDate = issueDate;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.payment = payment;
    }

    // Getters
    public int getReceiptId() {
        return receiptId;
    }

    public String getIssueDate() {
        return issueDate;
    }

    public double getAmount() {
        return amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    // Display Method
    public void displayReceipt() {

        System.out.println("===== RECEIPT =====");

        System.out.println("Receipt ID: " + receiptId);
        System.out.println("Issue Date: " + issueDate);
        System.out.println("Amount Paid: " + amount);
        System.out.println("Payment Method: " + paymentMethod);

        System.out.println(
            "Payment ID: " +
            payment.getPaymentId()
        );
    }
}