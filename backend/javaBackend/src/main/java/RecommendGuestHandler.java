import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

public class RecommendGuestHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        String requestedMethod = httpExchange.getRequestMethod();

        if (requestedMethod.equals("GET")) {
            URI requestedURI = httpExchange.getRequestURI();
            String query =  requestedURI.getQuery();

            Headers header = httpExchange.getRequestHeaders();
            String contentType = header.get("Content-Type").toString();

            if (!contentType.equals("application/json")) {
                System.err.println("Wrong content type");
            }

            InputStream request = httpExchange.getRequestBody();

            BufferedReader in = new BufferedReader(new InputStreamReader(request));

            String inputLine;
            while ()

            double latitude = 0;
            double longitude = 0;
            double range = 0;

            //temp for guest mode: preferences is empty (figure out all account mode stuff later)
            //also if guest mode has preferences (forgot if it does) then also needs to be passed
   //how to get location???
            //i'm assuming smth needs to be tossed here from frontend, maybe can pass a json or a url????? smth like that hopefully
            //TODO FIX TS LATER
            List<Preferences> preferencesList = new ArrayList<>();
            Restaurant result = User.getRecommendation(latitude, longitude, range, preferencesList);

            //not very familiar with node.js or react at all, so i'm just going to pass the stuff back as json and then i'll figure out how
            //to convert if needed

            String response = "";
            if (result == null) {
                response = "Error, no restaurant found";
            }
            else {
                //creating json with a string bc i can't import the library
                response = String.format(
                        "{" +
                                "\"name\": \"%s\"," +
                                "\"address\": \"%s\"," +
                                "\"latitude\": %f," +
                                "\"longitude\": %f" +
                                "}",
                        result.name(),
                        result.address(),
                        result.latitude(),
                        result.longitude()
                );
            }

            httpExchange.getResponseHeaders().add("Content-Type", "application/json");
            //200 is success code
            httpExchange.sendResponseHeaders(200, response.length());

            OutputStream os = httpExchange.getResponseBody();
            os.write(response.getBytes());
            os.close();


        }
        else {
            //405 is error
            httpExchange.sendResponseHeaders(405, -1);
        }



    }
}
