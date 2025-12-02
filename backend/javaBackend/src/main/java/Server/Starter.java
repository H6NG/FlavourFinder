package Server;

import db_operations.DBConnection;

public class Starter {
    public static void main(String[] args) {
        Server server = new Server(8000);
        server.startServer();
        System.out.println(DBConnection.getStatus());
    }
}
