import com.sun.net.httpserver.*;

import java.io.IOException;
import java.net.InetSocketAddress;

public class Server {
    HttpServer server;

    public Server(int port) {
        try {
            server = HttpServer.create(new InetSocketAddress(8000), 0);
        } catch (IOException e) {
            throw new RuntimeException("Server Creation failed");
        }
        server.createContext("/api/v1/restauraunt/recommend-guest", new RecommendGuestHandler());
        server.setExecutor(null);
    }

    public void startServer() {
        server.start();
    }

    public void stopServer(int delay) {
        server.stop(delay);
    }

}
