package db_operations;

public record dbRestauraunt(
        int osmID,
        String name,
        dbPreference preference,
        String address,
        double latitude,
        double longitude
) { }
