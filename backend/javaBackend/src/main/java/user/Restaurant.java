package user;

import java.awt.*;

/**
 * Represents a real restaurant
 *
 * @param latitude
 * @param longitude
 * @param name of the restaurant
 * @param address postal address
 * @param image
 */
public record Restaurant(double latitude, double longitude, String name, String address, Image image) {

}
