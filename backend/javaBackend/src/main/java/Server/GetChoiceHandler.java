package Server;

import Server.ResponseRequestClasses.*;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import db_operations.dbRestauraunt;
import ranking.Choice;
import ranking.ChoiceOptions;
import user.User;

import java.io.*;

public class GetChoiceHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        // get the method used to call
        String requestedMethod = httpExchange.getRequestMethod();

        if (requestedMethod.equals("GET")) {
            // verify header that it is json
            Headers header = httpExchange.getRequestHeaders();
            String contentType = header.get("Content-Type").toString();
            if (!contentType.equals("[application/json]")) {
                System.err.println("Wrong content type");
            }

            // read json content in http post request
            InputStream request = httpExchange.getRequestBody();
            BufferedReader inReader = new BufferedReader(new InputStreamReader(request));
            location result = null;
            try {
                result = new Gson().fromJson(inReader, location.class);
            } catch(Exception e) {
                System.err.println("Errored");
                System.err.println(e.getMessage());
            }

            // make sure request is actually valid
            if (result == null) {
                httpExchange.sendResponseHeaders(400, -1);
                throw new RuntimeException("Invalid request");
            }

            // get actual recommendation
            ChoiceOptions options = Choice.getChoices(result.latitude(), result.longitude());

            // formulate response json
            restaurauntChoiceResponse resObj = new restaurauntChoiceResponse(
                    new restaurauntDetail(
                            options.res1().name(),
                            null,
                            new location(options.res1().latitude(), options.res1().longitude())
                    ),
                    new restaurauntDetail(
                            options.res2().name(),
                            null,
                            new location(options.res2().latitude(), options.res2().longitude())
                    ),
                    new restaurauntDetail(
                            options.res3().name(),
                            null,
                            new location(options.res3().latitude(), options.res3().longitude())
                    ),
                    options.offeringID()
            );

            // convert json to response text
            Gson gson = new Gson();
            String responseString = gson.toJson(resObj);

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
