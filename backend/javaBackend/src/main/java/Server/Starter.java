package Server;

public class Starter {
    public static void main(String[] args) {
        Server server = new Server(8000);
        server.startServer();
        try {
            Thread.sleep(1000 * 1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        server.stopServer(10000);
    }
}
