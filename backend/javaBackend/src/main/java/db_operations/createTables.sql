CREATE TABLE preference (
	prefID 			SERIAL PRIMARY KEY,
	glutenFree		boolean NOT NULL,
	vegetarian		boolean NOT NULL,
	vegan			boolean NOT NULL
);

CREATE TABLE users (
	userID 			SERIAL PRIMARY KEY,
	userName		varchar(255) NOT NULL,
	firstName		varchar(255),
	middleName		varchar(255),
	lastName		varchar(255),
	email			varchar(255),
	pwhash			bytea NOT NULL,
	salt			bytea NOT NULL,
	preferenceID	int REFERENCES preference (prefID),
	lastLocatLat	double precision,
	lastLocatLong 	double precision
);

CREATE TABLE restauraunt (
	restID 			SERIAL PRIMARY KEY,
	osmID			int,
	resName			varchar(255) NOT NULL,
	address         varchar(255),
	prefID			int REFERENCES preference (prefID),
	locatLat		double precision,
	locatLong		double precision
);

CREATE TABLE authTokens (
	tokenID			SERIAL PRIMARY KEY,
	tokenStr		varchar(255) NOT NULL,
	userID			int REFERENCES users (userID) NOT NULL,
	expiry			timestamptz NOT NULL
);

CREATE TABLE recommendHistory (
	recomID			SERIAL PRIMARY KEY,
	userID			int REFERENCES users (userID) NOT NULL,
	restID			int REFERENCES restauraunt (restID) NOT NULL,
	timeRecom		timestamptz NOT NULL,
	userLocatLat	double precision,
	userLocatLong	double precision
);

CREATE TABLE choices (
	choiceID		SERIAL PRIMARY KEY,
	userID			int REFERENCES users (userID) NOT NULL,
	rest1ID			int REFERENCES restauraunt (restID) NOT NULL,
	rest2ID			int REFERENCES restauraunt (restID) NOT NULL,
	rest3ID			int REFERENCES restauraunt (restID),
	numChose		int NOT NULL,
	timeChose		timestamptz
);

ALTER TABLE users ALTER COLUMN salt TYPE bytea USING salt::bytea;