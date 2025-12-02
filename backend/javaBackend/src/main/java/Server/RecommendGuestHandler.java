package Server;

import Server.ResponseRequestClasses.recommendRequestParam;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;

import com.google.gson.*;
import db_operations.dbRestauraunt;
import user.User;

public class RecommendGuestHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        // get the method used to call
        String requestedMethod = httpExchange.getRequestMethod();

        if (requestedMethod.equals("POST")) {
//            URI requestedURI = httpExchange.getRequestURI();
//            String query = requestedURI.getQuery();

            // verify header that it is json
            Headers header = httpExchange.getRequestHeaders();
            String contentType = header.get("Content-Type").toString();

            if (!contentType.equals("[application/json]")) {
                System.err.println("Wrong content type");
            }

            // read json content in http post request
            InputStream request = httpExchange.getRequestBody();
            BufferedReader inReader = new BufferedReader(new InputStreamReader(request));
            recommendRequestParam result = null;
            try {
                result = new Gson().fromJson(inReader, recommendRequestParam.class);
            } catch(Exception e) {
                System.err.println("Errored");
                System.err.println("Json : " + inReader.readLine());
                System.err.println(e.getMessage());
            }

            // make sure request is actually valid
            if (result == null || result.currentLocation() == null) {
                httpExchange.sendResponseHeaders(400, -1);
                throw new RuntimeException("Invalid request");
            }
            // get actual recommendation
            dbRestauraunt recommended = User.getRecommendation(
                    result.currentLocation().latitude(),
                    result.currentLocation().longitude(),
                    result.radius(),
                    result.preferences());

            // formulate response json
            JsonObject response = new JsonObject();
            JsonObject location = new JsonObject();
            location.addProperty("latitude", recommended.latitude());
            location.addProperty("longitude", recommended.longitude());
            response.addProperty("name", recommended.name());
            response.addProperty("image", "null");
            response.add("location", location);

            // convert json to response text
            String responseString = response.toString();

            // add cors headers
            httpExchange.getResponseHeaders().add("Content-Type", "application/json");
            httpExchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            httpExchange.getResponseHeaders().add("Access-Control-Allow-Headers", "*");
            httpExchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            httpExchange.sendResponseHeaders(200, responseString.length());

            // write response
            OutputStream os = httpExchange.getResponseBody();
            os.write(responseString.getBytes());
            os.close();

        } else if (requestedMethod.equals("OPTIONS")){
            // handle preflight options
            httpExchange.getResponseHeaders().add("Allowed", "");
            httpExchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            httpExchange.getResponseHeaders().add("Access-Control-Allow-Headers", "*");
            httpExchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            httpExchange.sendResponseHeaders(204, -1);
        } else {
            System.err.println("Wrong method for this path!");
            System.err.println("Method Requested: " + requestedMethod);
            httpExchange.sendResponseHeaders(403,0);
        }

    }

}
