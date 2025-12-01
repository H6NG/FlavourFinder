package security;

public record HashedPassword(
        byte[] hashed,
        byte[] salt
)
{ }
