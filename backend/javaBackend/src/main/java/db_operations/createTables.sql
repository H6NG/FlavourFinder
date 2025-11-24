CREATE TABLE users (
	userID 			int	PRIMARY KEY,
	userName		varchar(255) NOT NULL,
	firstName		varchar(255),
	middleName		varchar(255),
	lastName		varchar(255),
	email			varchar(255),
	pwhash			bytea NOT NULL,
	salt			varchar(128) NOT NULL,
	preferenceID	int REFERENCES preference (prefID),
	lastLocation	point
);

CREATE TABLE preference (
	prefID 			int PRIMARY KEY,
	glutenFree		boolean NOT NULL,
	vegetarian		boolean NOT NULL,
	vegan			boolean NOT NULL
);

CREATE TABLE restauruant (
	restID 			int PRIMARY KEY,
	osmID			int,
	resName			varchar(255) NOT NULL,
	prefID			int REFERENCES preference (prefID) NOT NULL,
	locat			point
);

CREATE TABLE authTokens (
	tokenID			int PRIMARY KEY,
	tokenStr		varchar(255) NOT NULL,
	userID			int REFERENCES users (userID) NOT NULL,
	expiry			timestamptz NOT NULL
);

CREATE TABLE recommendHistory (
	recomID			int PRIMARY KEY,
	userID			int REFERENCES users (userID) NOT NULL,
	restID			int REFERENCES restauraunt (restID) NOT NULL,
	timeRecom		timestamptz NOT NULL,
	userLocat		point
);

CREATE TABLE choices (
	choiceID		int PRIMARY KEY,
	userID			int REFERENCES users (userID) NOT NULL,
	rest1ID			int REFERENCES restauraunt (restID) NOT NULL,
	rest2ID			int REFERENCES restauraunt (restID) NOT NULL,
	rest3ID			int REFERENCES restauraunt (restID),
	numChose		int NOT NULL,
	timeChose		timestamptz
);

