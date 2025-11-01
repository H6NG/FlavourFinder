
Problem:

In the modern digital era, people have access to hundreds of restaurants through countless services at their fingertips. While this abundance of choice may seem beneficial, very often it can lead to decision paralysis, 
where an individual is overwhelmed by the sheer number of options available to them. This indecision can often waste time, causing frustration and lead to decision fatigue. 
Behavioral studies have shown that excessive choice can decrease satisfaction and increase stress (Iyengar & Lepper, 2000; Schwartz, 2004). 
Our user research has shown that people take between 15-20 minutes deciding where to eat, which can lead to dissatisfaction. The root cause of decision paralysis lies in several key factors, 
including an overload of information, inconsistent and unreliable reviews, and lack of personal  recommendations. While many services offer searches and recommendations, they are rarely tailored to individuals. 
Furthermore, these tools are more focused on presenting options rather than reducing them. This can lead to frustration when making dining choices.

Solution:

Our solution focuses on reducing the number of choices that a consumer needs to make. 
This service will randomly generate a restaurant near the user, with consideration of an individual’s dietary restrictions before a suggestion is made. 
This will ensure that the restaurant will have options for the consumer. This drastically reduces the decision-making time from 15 minutes to seconds. 
It also introduces consumers to a wide variety of cuisine and traditions, which can lead to a deeper appreciation of other cultures. The aim of this is to reduce the number of decisions that a user needs to make.

Our idea is to use a command line interface, which will output a text based result based on the user’s inputs.

Inputs required will include: Dietary restrictions, location

Upon loading, the user will be met with a welcome screen, prompting them to either login or continue without logging in:  

![Command line screenshot](https://github.com/CPEN-221-2025/project-birch/blob/main/Design%20Screenshots/2.png?raw=true)

The next screen will be prompting the user for dietary restrictions and a search radius from their location.

![Command line screenshot](https://github.com/CPEN-221-2025/project-birch/blob/main/Design%20Screenshots/6.png?raw=true)

The two kilometer radius is predetermined to limit the choices that the consumer is required to make. There may later be a feature to alter this radius later on.

To implement the proper location features, we will be implementing a Google Maps API, specifically the Geocoding API, which converts named locations (like “Vancouver”) to coordinates. 
The Geolocation API then gets the user’s current location using IP or device data, Places API searches for nearby restaurants near given coordinates. 

The website will then print out a randomly generated restaurant that follows the dietary criteria:  

![Command line screenshot](https://github.com/CPEN-221-2025/project-birch/blob/main/Design%20Screenshots/7.png?raw=true)

The "Regenerate" feature is to allow users to generate another random restaurant should they feel the need to. 
The primary goal is to limit the number of options that the user is actively seeing, so with this feature we can limit it to one at a time. 


When the user is finished eating at the restaurant, they will be prompted with the following page asking for a relative ranking between the restaurant they just ate at and the previous two restaurants they were prompted before this one:

![Command line screenshot](https://github.com/CPEN-221-2025/project-birch/blob/main/Design%20Screenshots/8.png?raw=true)










