package Server;

import com.sun.net.httpserver.*;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Server {
    HttpServer server;

    public Server(int port) {
        try {
            server = HttpServer.create();
            server.bind(new InetSocketAddress(port), 0);
            System.out.println("Created server");
            System.out.println("Binded to port " + port);
        } catch (IOException e) {
            System.err.println("Error creating server");
            throw new RuntimeException("Server.Server Creation failed");
        }
        server.createContext("/api/v1/restauraunt/recommend-guest", new RecommendGuestHandler());
        server.createContext("/api/v1/rank/choice", new GetChoiceHandler());
        server.setExecutor(Executors.newSingleThreadExecutor());
    }

    public void startServer() {
        server.start();
    }

    public void stopServer(int delay) {
        server.stop(delay);
    }
}
