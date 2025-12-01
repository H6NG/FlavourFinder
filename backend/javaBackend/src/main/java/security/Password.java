package security;

import org.bouncycastle.crypto.generators.Argon2BytesGenerator;
import org.bouncycastle.crypto.params.Argon2Parameters;

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
        byte[] salt = generateSalt128();

        int iterations = 3;
        int memLimitPowerOf2 = 23; // = 8 MiB
        int hashLength = 128;
        int threads = 1;

        Argon2Parameters.Builder builder = new Argon2Parameters.Builder(Argon2Parameters.ARGON2_id)
                .withVersion(Argon2Parameters.ARGON2_VERSION_13)
                .withIterations(iterations)
                .withMemoryPowOfTwo(memLimitPowerOf2)
                .withParallelism(threads)
                .withSalt(salt);

        Argon2BytesGenerator generate = new Argon2BytesGenerator();
        generate.init(builder.build());
        byte[] result = new byte[hashLength];
        generate.generateBytes(plaintext.getBytes(StandardCharsets.UTF_8), result, 0, result.length);

        return new HashedPassword(result, salt);
    }

    /**
     * Verifies a given plaintext password is the same as the hashed password
     * @param hashed HashedPassword object containing byte[] of the hashed password and the salt
     * @param plaintext Plaintext String password to verify
     * @return true if plaintext password is equal to the hashed, false otherwise
     */
    public static boolean VerifyPassword(HashedPassword hashed, String plaintext) {
        byte[] salt = hashed.salt();

        int iterations = 3;
        int memLimitPowerOf2 = 23; // = 8 MiB
        int hashLength = 128;
        int threads = 1;

        Argon2Parameters.Builder builder = new Argon2Parameters.Builder(Argon2Parameters.ARGON2_id)
                .withVersion(Argon2Parameters.ARGON2_VERSION_13)
                .withIterations(iterations)
                .withMemoryPowOfTwo(memLimitPowerOf2)
                .withParallelism(threads)
                .withSalt(salt);

        Argon2BytesGenerator generate = new Argon2BytesGenerator();
        generate.init(builder.build());
        byte[] result = new byte[hashLength];
        generate.generateBytes(plaintext.getBytes(StandardCharsets.UTF_8), result, 0, result.length);

        return Arrays.equals(result, hashed.hashed());

    }

    /**
     * Generates a random salt of length 128 bytes
     * @return generated 128-byte random byte array
     */
    private static byte[] generateSalt128() {
        SecureRandom secure = new SecureRandom();
        byte[] salt = new byte[128];
        secure.nextBytes(salt);
        return salt;
    }
}
