package Server.ResponseRequestClasses;

public record restaurauntChoiceResponse(
        restaurauntDetail restaurauntA,
        restaurauntDetail restaurauntB,
        restaurauntDetail restaurauntC,
        String offeringID
) { }
