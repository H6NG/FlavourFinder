package Server.ResponseRequestClasses;

import db_operations.dbPreference;

public record restaurauntRequestGuest(
        location currentLocation,
        double radius,
        dbPreference preferences
) {}
