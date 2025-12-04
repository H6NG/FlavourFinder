package ranking;

import db_operations.DBConnection;
import db_operations.dbRestauraunt;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

public class Choice {
    public static ChoiceOptions getChoices(double latitude, double longitude) {
        double radius = 10;
        List<dbRestauraunt> restaurauntList;
        try {
            restaurauntList = DBConnection.getRestauraunts(latitude, longitude, radius);
        } catch (SQLException e) {
            System.err.println("Error getting list of restauraunts from database");
            System.err.println(e.getMessage());
            throw new RuntimeException("e");
        }

        // keep increasing radius until we get enough restauraunts
        while (restaurauntList.size() < 10) {
            radius += 10;
            try {
                restaurauntList = DBConnection.getRestauraunts(latitude, longitude, radius);
            } catch (SQLException e) {
                System.err.println("Error getting list of restauraunts from database");
                System.err.println(e.getMessage());
                throw new RuntimeException("e");
            }
        }

        // generate 3 random indices
        Random random = new Random();
        List<Integer> randomIndices = new ArrayList<>();
        while (randomIndices.size() < 3) {
            int randomInt = random.nextInt(restaurauntList.size());
            if (!randomIndices.contains(randomInt)) {
                randomIndices.add(randomInt);
            }
        }

        ChoiceOptions returnOpts = new ChoiceOptions(
                restaurauntList.get(randomIndices.get(0)),
                restaurauntList.get(randomIndices.get(1)),
                restaurauntList.get(randomIndices.get(2)),
                UUID.randomUUID()
        );

        try {
            DBConnection.addOptionChoice(returnOpts);
        } catch (SQLException e) {
            System.err.println("Error adding choice to database");
            System.err.println(e.getMessage());
            throw new RuntimeException(e);
        }
        return returnOpts;

    }
}
