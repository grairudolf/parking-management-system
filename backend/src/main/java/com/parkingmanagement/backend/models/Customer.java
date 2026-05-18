import java.util.ArrayList;

public class Customer {

    // Attributes
    private int customerId;
    private String name;
    private String email;
    private String password;
    private int telephone;

    // Relationships
    private ArrayList<Vehicle> vehicles;
    private ArrayList<Reservation> reservations;

    // Constructor
    public Customer(int customerId,
                    String name,
                    String email,
                    String password,
                    int telephone) {

        this.customerId = customerId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.telephone = telephone;

        vehicles = new ArrayList<>();
        reservations = new ArrayList<>();
    }

    // Methods
    public void addVehicle(Vehicle vehicle) {
        vehicles.add(vehicle);
    }

    public void addReservation(Reservation reservation) {
        reservations.add(reservation);
    }

    // Getters
    public int getCustomerId() {
        return customerId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public int getTelephone() {
        return telephone;
    }

    // Display Method
    public void displayCustomer() {

        System.out.println("Customer ID: " + customerId);
        System.out.println("Name: " + name);
        System.out.println("Email: " + email);
        System.out.println("Telephone: " + telephone);
    }
}