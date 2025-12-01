package db_operations;

import security.Password;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.sql.*;
import java.util.HashSet;
import java.util.Set;

public class DBConnection {
    private static DBConnection DBConnection = new DBConnection();
    private static Connection connection;

    private DBConnection() {
        String url;
        if (System.getenv("FF_URL").isEmpty()) {
            url = "jdbc:postgresql://ffpg.bungalou.ca:5433/fftest";
        } else {
            url = System.getenv("FF_URL");
        }
        String user = System.getenv("FF_USER");
        String password = System.getenv("FF_PASSWORD");
        try {
            connection = DriverManager.getConnection(url, user, password);
        } catch (SQLException e) {
            System.err.println("Database Connection failed");
            throw new RuntimeException(e);
        }
    }

    // execute a given SQL file given a path
    public static void executeFile(String filePath) {
        try (
                BufferedReader reader = new BufferedReader(new FileReader(filePath));
                Statement statement = connection.createStatement();
        ) {
            StringBuilder sb = new StringBuilder();
            String line;

            try {
                while ((line = reader.readLine()) != null) {
                    if (line.isEmpty() || line.startsWith("--")) {
                        continue;
                    }

                    sb.append(line.trim());

                    // each statement get executed in order
                    if (line.endsWith(";")) {
                        try {
                            statement.execute(sb.toString());
                        } catch (SQLException e) {
                            System.err.println("Unable to execute SQL " + sb.toString());
                            System.err.println("Error: " + e.getMessage());
                            System.err.print("SQL ErrorCode: " + e.getErrorCode());
                            throw new RuntimeException(e);
                        }

                        // clear the stringBuilder
                        sb.setLength(0);
                    }
                }
            } catch (IOException e) {
                System.err.println("Error reading line");
                throw new RuntimeException(e);
            }
        } catch (FileNotFoundException e) {
            System.err.println("File not found at path: " + filePath);
            throw new RuntimeException(e);
        } catch (IOException e) {
            System.err.println("File Reading has gone wrong");
            throw new RuntimeException(e);
        } catch (SQLException e) {
            System.err.println("SQL Statement creation is wrong");
            throw new RuntimeException(e);
        }
    }

    public static boolean addRestauraunt(dbRestauraunt res, dbPreference pref) throws java.sql.SQLException{
        // statement to insert preferences first
        PreparedStatement prefInsert = connection.prepareStatement(
                "INSERT INTO preference (glutenfree, vegetarian, vegan)" +
                        "VALUES (?, ?, ?) RETURNING prefID"
        );

        prefInsert.setBoolean(1, pref.glutenFree());
        prefInsert.setBoolean(2, pref.vegetarian());
        prefInsert.setBoolean(3, pref.vegan());

        ResultSet r = prefInsert.executeQuery();
        int prefID = 0;
        while (r.next()) {
            prefID = r.getInt("prefid");
        }
        r.close();
        prefInsert.close();

        PreparedStatement resInsert = connection.prepareStatement(
            "INSERT INTO restauraunt (osmid, resname, prefid, locatLat, locatLong, address) " +
                "VALUES (?, ?, ?, ?, ?, ?)"
        );

        resInsert.setInt(1, res.osmID());
        resInsert.setString(2, res.name());
        resInsert.setInt(3, prefID);
        resInsert.setDouble(4, res.latitude());
        resInsert.setDouble(5, res.longitude());
        resInsert.setString(6, res.address());

        resInsert.executeQuery();
        int rInsert = resInsert.getUpdateCount();

        if (rInsert != 1) {
            return false;
        } else {
            return true;
        }
    }

    // get all restauraunts with distance of radius km within lat, long
    public static Set<dbRestauraunt> getRestauraunts(double latitude, double longitude, double radius) throws java.sql.SQLException{
        PreparedStatement getRes = connection.prepareStatement(
                "SELECT" +
                        "resname," +
                        "osmid," +
                        "address," +
                        "locatlat," +
                        "locatlong," +
                        "glutenfree," +
                        "vegetarian," +
                        "vegan," +
                        "    earth_distance(" +
                        "        ll_to_earth(restauraunt.locatLat, restauraunt.locatLong)," +
                        "        ll_to_earth(?, ?)" +
                        "    )::integer/1000 AS distance_kilometers" +
                        "FROM restauraunt" +
                        "INNER JOIN preference ON preference.prefid = restauraunt.prefid" +
                        "WHERE" +
                        "    earth_distance(" +
                        "        ll_to_earth(locatLat, locatLong)," +
                        "        ll_to_earth(?, ?)" +
                        "    )/1000 < ?" +
                        "ORDER BY distance_kilometers;"
        );

        getRes.setDouble(1, latitude);
        getRes.setDouble(2, longitude);
        getRes.setDouble(3, latitude);
        getRes.setDouble(4, longitude);
        getRes.setDouble(5, radius);

        ResultSet rs = getRes.executeQuery();
        Set<dbRestauraunt> resSet = new HashSet<>();

        while (rs.next()) {
            dbRestauraunt restauraunt = new dbRestauraunt(
                    rs.getInt("osmid"),
                    rs.getString("resname"),
                    new dbPreference(
                            rs.getBoolean("glutenfree"),
                            rs.getBoolean("vegetarian"),
                            rs.getBoolean("vegan")
                    ),
                    rs.getString("address"),
                    rs.getDouble("locatlat"),
                    rs.getDouble("locatlong")
            );
            resSet.add(restauraunt);
        }

        return resSet;
    }

//    public boolean addUser(String username, Password hashedPassword) {
//
//    }

//    public boolean existUser(String username) {
//
//    }

}
