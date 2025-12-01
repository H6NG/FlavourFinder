package user;

import db_operations.dbPreference;
import db_operations.dbRestauraunt;

import java.util.*;

public class User {

    //current location
    private double latitude;
    private double longitude;

    private EnumSet<Preferences> preferences;

    private String username;

    //ranking of the user, double is the weight
    private Map<Restaurant, Double> ranking;



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
    public static dbRestauraunt getRecommendation(double longitude, double latitude, dbPreference preference){
        return new dbRestauraunt(21, "Hello From the Other side", new dbPreference(true, false, true), "hi", 0, 0);
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
