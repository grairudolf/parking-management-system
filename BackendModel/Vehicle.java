public class Vehicle {

    // Attributes
    private String vehicleId;
    private String model;
    private String type;
    private String plateNumber;

    // Relationship
    private Customer customer;

    // Constructor
    public Vehicle(String vehicleId,
                   String model,
                   String type,
                   String plateNumber,
                   Customer customer) {

        this.vehicleId = vehicleId;
        this.model = model;
        this.type = type;
        this.plateNumber = plateNumber;
        this.customer = customer;
    }

    // Getters
    public String getVehicleId() {
        return vehicleId;
    }

    public String getModel() {
        return model;
    }

    public String getType() {
        return type;
    }

    public String getPlateNumber() {
        return plateNumber;
    }

    public Customer getCustomer() {
        return customer;
    }

    // Display Method
    public void displayVehicle() {

        System.out.println("Vehicle ID: " + vehicleId);
        System.out.println("Model: " + model);
        System.out.println("Type: " + type);
        System.out.println("Plate Number: " + plateNumber);
        System.out.println("Owner: " + customer.getName());
    }
}