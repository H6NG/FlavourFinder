package Server;

public class Starter {
    public static void main(String[] args) {
        Server server = new Server(8000);
        server.startServer();
        server.stopServer(100000);
    }
}
