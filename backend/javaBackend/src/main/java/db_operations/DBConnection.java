package db_operations;

import java.sql.*;

public class DBConnection {
    Connection connection;

    public DBConnection(String url, String user, String password) {
        try {
            connection = DriverManager.getConnection(url, user, password);
        } catch (SQLException e) {
            System.out.println("Database Connection failed");
            throw new RuntimeException(e);
        }
    }
}
