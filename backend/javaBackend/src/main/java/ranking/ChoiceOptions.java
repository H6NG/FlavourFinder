package ranking;

import db_operations.dbRestauraunt;

import java.util.UUID;

public record ChoiceOptions(
        dbRestauraunt res1,
        dbRestauraunt res2,
        dbRestauraunt res3,
        UUID offeringID
) { }
