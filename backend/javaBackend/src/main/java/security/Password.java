package security;

import org.bouncycastle.crypto.generators.Argon2BytesGenerator;
import org.bouncycastle.crypto.params.Argon2Parameters;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Arrays;

/**
 * Class to encapsulate every password processing related operation
 */
public class Password {
    /**
     * Static method to hash a given password from a plaintext String to a byte[] hash
     * @param plaintext, cannot be null, String representing a plaintext password
     * @return HashedPassword Object, containing the hashed password as byte[] and salt as byte[]
     */
    public static HashedPassword HashPassword(String plaintext) {
        int saltLength = 64;
        int hashLength = 128;
        int parallelism = 1;
        int memory = 1 << 15; // = 32 MiB
        int iterations = 2;

        Argon2PasswordEncoder encoder = new Argon2PasswordEncoder(saltLength, hashLength, parallelism, memory, iterations);

        String hashed = encoder.encode(plaintext);

        return new HashedPassword(hashed);
    }

    /**
     * Verifies a given plaintext password is the same as the hashed password
     * @param hashed HashedPassword object containing a String[] of the hashed password(including salt)
     * @param plaintext Plaintext String password to verify
     * @return true if plaintext password is equal to the hashed, false otherwise
     */
    public static boolean VerifyPassword(HashedPassword hashed, String plaintext) {
        int saltLength = 64;
        int hashLength = 128;
        int parallelism = 1;
        int memory = 1 << 15; // = 32 MiB
        int iterations = 2;

        Argon2PasswordEncoder encoder = new Argon2PasswordEncoder(saltLength, hashLength, parallelism, memory, iterations);

        return encoder.matches(plaintext, hashed.hashed());
    }
}
