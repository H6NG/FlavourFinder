package Server;

import db_operations.dbPreference;

public class recommendRequestParam {
    private location currentLocation;
    private double radius;
    private dbPreference preferences;

    public location getlocation() {
        return currentLocation;
    }

    public double radius() {
        return radius;
    }

    public dbPreference getPreference() {
        return preferences;
    }
}
