import java.util.ArrayList;

public class SecurityGuard {

    // Attributes
    private int guardId;
    private String name;
    private String shift;
    private int telephone;

    // Relationships
    private ArrayList<Entry> entries;
    private ArrayList<Exit> exits;

    // Constructor
    public SecurityGuard(int guardId,
                         String name,
                         String shift,
                         int telephone) {

        this.guardId = guardId;
        this.name = name;
        this.shift = shift;
        this.telephone = telephone;

        entries = new ArrayList<>();
        exits = new ArrayList<>();
    }

    // Methods
    public void addEntry(Entry entry) {
        entries.add(entry);
    }

    public void addExit(Exit exit) {
        exits.add(exit);
    }

    // Getters
    public int getGuardId() {
        return guardId;
    }

    public String getName() {
        return name;
    }

    public String getShift() {
        return shift;
    }

    public int getTelephone() {
        return telephone;
    }

    // Display Method
    public void displayGuard() {

        System.out.println("===== SECURITY GUARD =====");

        System.out.println("Guard ID: " + guardId);
        System.out.println("Name: " + name);
        System.out.println("Shift: " + shift);
        System.out.println("Telephone: " + telephone);
    }
}