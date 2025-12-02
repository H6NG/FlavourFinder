package Server.ResponseRequestClasses;

import db_operations.dbPreference;

public record recommendRequestParam (
        location currentLocation,
        double radius,
        dbPreference preferences
) {}
