package ranking;

import db_operations.dbRestauraunt;

import java.util.Set;

public record RestaurauntNode (
        dbRestauraunt restauraunt,
        long higher, // amount of times this restauraunt is better than another one
        long lower, // amount of times this restauruant is lower than another one
        long itemsHigher, // count of how many restauraunts are better than this one
        Set<RestaurauntNode> higherThan // set of restauruants that this restuaraunt is better than
) { }
