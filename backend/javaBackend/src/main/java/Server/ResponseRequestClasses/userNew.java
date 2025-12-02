package Server.ResponseRequestClasses;

public record userNew(
        String email,
        String name,
        String password,
        String token
) { }
