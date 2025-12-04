package db_operations;

import ranking.ChoiceOptions;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.sql.*;
import java.util.*;

public class DBConnection {
    private static DBConnection DBConnection = new DBConnection();
    private static Connection connection;

    private DBConnection() {
        String url;
        if (System.getenv("FF_URL") == null) {
            url = "jdbc:postgresql://ffpg.bungalou.ca:5433/fftest";
        } else {
            url = System.getenv("FF_URL");
        }
        //String user = System.getenv("FF_USER");
        String user = "ffadmin";
        //String password = System.getenv("FF_PASSWORD");
        String password = "rziHaADizg9B7Dazy";
        try {
            connection = DriverManager.getConnection(url, user, password);
        } catch (SQLException e) {
            System.err.println("Database Connection failed");
            throw new RuntimeException(e);
        }
    }

    public static String getStatus() {
        try {
            return connection.getClientInfo().toString();
        } catch (SQLException e) {
            throw new RuntimeException("Unable to get status");
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

        resInsert.setLong(1, res.osmID());
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
    public static List<dbRestauraunt> getRestauraunts(double latitude, double longitude, double radius) throws java.sql.SQLException{
        PreparedStatement getRes = connection.prepareStatement(
                "SELECT\n" +
                        "\trestid,\n" +
                        "\tresname,\n" +
                        "\tosmid,\n" +
                        "--\tglutenfree,\n" +
                        "--\tvegetarian,\n" +
                        "--\tvegan,\n" +
                        "\taddress,\n" +
                        "\tlocatlat,\n" +
                        "\tlocatlong,\n" +
                        "    earth_distance(\n" +
                        "        ll_to_earth(restauraunt.locatLat, restauraunt.locatLong),\n" +
                        "        ll_to_earth(?, ?)\n" +
                        "    )::integer/1000 AS distance_kilometers\n" +
                        "FROM restauraunt\n" +
                        "--INNER JOIN preference ON preference.prefid = restauraunt.prefid\n" +
                        "WHERE\n" +
                        "    earth_distance(\n" +
                        "        ll_to_earth(locatLat, locatLong),\n" +
                        "        ll_to_earth(?, ?)\n" +
                        "    )/1000 < ?\n" +
                        "ORDER BY distance_kilometers;"
        );

        getRes.setDouble(1, latitude);
        getRes.setDouble(2, longitude);
        getRes.setDouble(3, latitude);
        getRes.setDouble(4, longitude);
        getRes.setDouble(5, radius);

        ResultSet rs = getRes.executeQuery();

        List<dbRestauraunt> resList = new ArrayList<>();

        while (rs.next()) {
            dbRestauraunt restauraunt = new dbRestauraunt(
                    rs.getLong("restid"),
                    rs.getLong("osmid"),
                    rs.getString("resname"),
//                    new dbPreference(
//                            rs.getBoolean("glutenfree"),
//                            rs.getBoolean("vegetarian"),
//                            rs.getBoolean("vegan")
//                    ),
                    null,
                    rs.getString("address"),
                    rs.getDouble("locatlat"),
                    rs.getDouble("locatlong")
            );
            resList.add(restauraunt);
        }

        return resList;
    }

    //
    public static void addOptionChoice(ChoiceOptions options) throws SQLException {
        PreparedStatement insertChoiceOption = connection.prepareStatement(
                "INSERT INTO choiceoffering (offeringid, rest1id, rest2id, rest3id, timeofferd) VALUES\n" +
                        "(?, ?, ?, ?, CURRENT_TIMESTAMP);"
        );
        insertChoiceOption.setObject(1, options.offeringID());
        insertChoiceOption.setLong(2, options.res1().dbID());
        insertChoiceOption.setLong(3, options.res2().dbID());
        insertChoiceOption.setLong(4, options.res3().dbID());

        insertChoiceOption.executeUpdate();
    }

    public static void deleteOfferUUID(UUID uuid) throws SQLException {
        PreparedStatement deleteWithUUID = connection.prepareStatement(
                "DELETE FROM choiceoffering WHERE offeringid=?;\n"
        );
        deleteWithUUID.setObject(1, uuid);
        deleteWithUUID.executeUpdate();
    }

    // int resA, resB, resC is for the order
    public static void addChoice(UUID uuid, int resA, int resB, int resC, int numChose) throws SQLException {
        // get restauraunt IDs
        PreparedStatement getResIDs = connection.prepareStatement(
                "SELECT rest1id, rest2id, rest3id \n" +
                        "FROM choiceoffering \n" +
                        "WHERE offeringid=?"
        );
        getResIDs.setObject(1, uuid);
        ResultSet rs = getResIDs.executeQuery();
        rs.next();
        int resAID = rs.getInt("rest1id");
        int resBID = rs.getInt("rest2id");
        int resCID = rs.getInt("rest3id");

        System.out.println("Res A: " + resA);
        System.out.println("Res B: " + resB);
        System.out.println("Res C: " + resC);

        PreparedStatement addChoice = connection.prepareStatement(
                "INSERT INTO choices (rest1id, rest2id, rest3id, numchose, timechose) VALUES\n" +
                        "(?, ?, ?, ?, CURRENT_TIMESTAMP);"
        );
        addChoice.setInt(resA + 1, resAID);
        addChoice.setInt(resB + 1, resBID);
        addChoice.setInt(resC + 1, resCID);
        addChoice.setInt(4, numChose);
        addChoice.executeUpdate();

        // delete from choice offered
        deleteOfferUUID(uuid);
    }

//    public boolean addUser(String username, Password hashedPassword) {
//
//    }

//    public boolean existUser(String username) {
//
//    }

}
