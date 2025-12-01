package Server;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;


import com.google.gson.*;
import db_operations.dbRestauraunt;
import user.User;

public class RecommendGuestHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        String requestedMethod = httpExchange.getRequestMethod();

        if (requestedMethod.equals("POST")) {
            URI requestedURI = httpExchange.getRequestURI();
            String query = requestedURI.getQuery();

            Headers header = httpExchange.getRequestHeaders();
            String contentType = header.get("Content-Type").toString();

            System.out.print(contentType);
            if (!contentType.equals("[application/json]")) {
                System.err.println("Wrong content type");
            }

            InputStream request = httpExchange.getRequestBody();

            BufferedReader inReader = new BufferedReader(new InputStreamReader(request));

            recommendRequestParam result = new Gson().fromJson(inReader, recommendRequestParam.class);

            dbRestauraunt recommended = User.getRecommendation(
                    result.getlocation().getLongitude(),
                    result.getlocation().getLatitude(),
                    result.getPreference());

            JsonObject response = new JsonObject();
            JsonObject location = new JsonObject();

            location.addProperty("latitude", recommended.latitude());
            location.addProperty("longitude", recommended.longitude());



            response.addProperty("name", recommended.name());
            response.addProperty("image", "null");
            response.add("location", location);

            String responseString = response.toString();
            ;

            httpExchange.getResponseHeaders().add("Content-Type", "application/json");
            httpExchange.sendResponseHeaders(200, responseString.length());

            OutputStream os = httpExchange.getResponseBody();
            os.write(responseString.getBytes());
            os.close();

        } else {
            System.err.println("Wrong method for this path!");
            httpExchange.sendResponseHeaders(403,0);
        }
    }
}
