package db_operations;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.sql.*;

public class DBConnection {
    Connection connection;

    public DBConnection(String url, String user, String password) {
        try {
            connection = DriverManager.getConnection(url, user, password);
        } catch (SQLException e) {
            System.err.println("Database Connection failed");
            throw new RuntimeException(e);
        }
    }

    // execute a given SQL file given a path
    public void executeFile(String filePath) {
        try (
                BufferedReader reader = new BufferedReader(new FileReader(filePath));
                Statement statement =this.connection.createStatement();
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
}
