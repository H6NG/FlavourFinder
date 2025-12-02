package user;

import db_operations.DBConnection;
import db_operations.dbPreference;
import db_operations.dbRestauraunt;

import java.sql.SQLException;
import java.util.*;

public class User {

    //current location
    private double latitude;
    private double longitude;

    private EnumSet<Preferences> preferences;

    private String username;

    //ranking of the user, double is the weight
    private Map<Restaurant, Double> ranking;

    private static Random random = new Random();

    //figure out how to store the last x visited restaurants


    public boolean setUsername(String username){
        if(true){ //if valid username
            this.username = username;
            return true;
        }

        return false;
    }

    public boolean setLocation(double latitude, double longitude){
        return false;
    }

    //im assuming we get a list of true and false for each preference based on what the api looks like, might need to decode from json first?
    private EnumSet<Preferences> decodePreferenceList(List<Preferences> preferencesList){
        //stream preference list, filter true, assign those enums to user preferences
        return null;
    }

    public boolean setPreferences(List<Preferences> preferencesList){
        //clear current preferences
        preferences = decodePreferenceList(preferencesList);
        return false;
    }

    public EnumSet<Preferences> getPreferences(){
        return EnumSet.copyOf(preferences); //no rep exposure :)
    }

    public Restaurant getRecommendation(){
        return null;
    }

    //guest recommendation
    public static dbRestauraunt getRecommendation(double latitude, double longitude, double radius, dbPreference preference){
        List<dbRestauraunt> listOfRestauraunt;
        try {
            listOfRestauraunt = DBConnection.getRestauraunts(latitude, longitude, radius);
            System.out.println("Gotten Restauraunts from db");
            System.out.println("Size of set: " + listOfRestauraunt.size());
        } catch (SQLException e) {
            System.err.println("Error getting restauraunts from db");
            System.err.println(e.toString());
            System.err.println(e.getMessage());
            throw new RuntimeException(e);
        }
        int randomindex = 0;
        try {
            randomindex = random.nextInt(listOfRestauraunt.size());
        } catch (Exception e) {
            System.err.println(e.toString());
            throw new RuntimeException(e);
        }
        System.out.println(randomindex);

        dbRestauraunt randomRes = listOfRestauraunt.get(randomindex);
        System.out.println("returning res");
        return randomRes;
    }

    //get three restaurants to rank
    public Set<Restaurant> fetchChoice(){
        Set<Restaurant> choices = new HashSet<>();
        //add last 2 visited restaurants
        //add random restaurant
        return choices;
    }

    //after user has done a ranking call this with the order
    public void updateRanking(Map<Restaurant, Integer> ranking){

    }
}
