package Server.ResponseRequestClasses;

import java.util.UUID;

public record restaurauntChoiceResponsePost(
        boolean choiceA,
        boolean choiceB,
        boolean choiceC,
        UUID offeringID
) { }
