package db_operations;

public record dbRestauraunt(
        long dbID,
        long osmID,
        String name,
        dbPreference preference,
        String address,
        double latitude,
        double longitude
) { }
