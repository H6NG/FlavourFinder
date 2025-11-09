- How will you coordinate your work?\
We have divided the work so that Hang works on the frontend, while Faysal and Aaron work on the backend. Kevin, our designer, will be designing the UI. Jerry will be the project manager and will fill in wherever else needed. We will try to have weekly meetings to inform other members of project updates. Jerry will be in charge of planning these meetings and their agendas. 

- What tools will you use to communicate?\
For communication, we have chosen to make a Discord server as it allows for different message channels, allowing us to categorize our messages and keep track of important information for each aspect of the project in its own respective channel as well as sending resources such as formatted code and files. As for project resources and our version control, we will be keeping those on Github and members will make pull requests and push to their own branch, which we will merge with the main branch later on. An alternative we considered was Instagram DMs, but it does not allow for separation of messages into different channels, and creates a big ball of mud in communication.

- Who will own the components in your architecture?\
The database and the algorithm will be owned by Aaron\
Faysal will handle the main server (request handling)\
Hang will handle the frontend.

- What is your timeline\
By the end of this reading break (by Nov. 12) (halfway mark):\
We will have a new logo\
Server client pattern established enough to have at least one successful API call\
Implement Guest Mode:will recommend a random restaurant near you\
Interacts with dataset (from openstreetmaps)\
Filters/processes dataset tailored to our use\
Working prototype by November 16th:\
Login and accounts working\
Preference suggestion working\
Ranking working\
Everything presumed to work, fine if theres still bugs\
Bugs eradicated and polishing until November 23\
All requirements fulfilled by November 28. Possibly adding small features until 28.\

- How will you verify that you've met your requirements?\
We will verify all of our requirements through both the frontend and backend. If both pass we know they’re working if one does and the other doesn’t we know which is broken.\
We will manually test the frontend website to check each all requirements that can be tested\
We will write JUnit regression tests for the backend to make sure each piece is working and we will write bigger tests that simulate a user doing multiple things\
We will create and run the JUnit tests as we’re working on the code and we will make sure all the tests pass before pushing to GitHub\
These will mainly tests individual functions\
The tests will be aimed to cover edge cases and use the principles taught in class to separate the input space into partitions to cover as many cases as possible\
The rest of the tests such manual ones and bigger tests when we believe the project is done but not free of bugs\
Code will be analyzed both automatically by checking code and branch coverage as well as having non developers look through the code to make sure we meet specs and that everything is clear\
We will analyze all the code we wrote which doesn’t include the libraries we will use\
We chose this as the automatic analyses are easy to use so even if they provide little value there will not be much cost. And we chose the manual tests as some such as checking over specs cannot be done automatically and getting fresh eyes on something usually has big help.\
We will not write proofs because we believe they will be too tedious and laborious while providing little value. We believe the tests we will impose should cover enough cases for us to feel confident in the correctness of the code.\
\
The timeline of our project should allow us enough time for setbacks such as illness, injury and difficult bugs. For difficult bugs we could also try to get the designer and PM to help out. We’ve also kept the feature set small so we believe we can implement all of them.
