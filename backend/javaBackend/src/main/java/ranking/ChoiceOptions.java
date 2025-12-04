package ranking;

import db_operations.dbRestauraunt;

public record ChoiceOptions(
        dbRestauraunt res1,
        dbRestauraunt res2,
        dbRestauraunt res3,
        String offeringID
) { }
