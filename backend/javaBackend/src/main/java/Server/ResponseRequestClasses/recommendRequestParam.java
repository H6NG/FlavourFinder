package Server.ResponseRequestClasses;

import db_operations.dbPreference;

public class recommendRequestParam {
    private final location currentLocation;
    private final double radius;
    private final dbPreference preferences;

    public recommendRequestParam(location currentLocation, double radius, dbPreference preferences) {
        this.currentLocation = currentLocation;
        this.radius = radius;
        this.preferences = preferences;
    }

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
