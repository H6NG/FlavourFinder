package db_operations;

public record dbRestauraunt(
        long osmID,
        String name,
        dbPreference preference,
        String address,
        double latitude,
        double longitude
) { }
