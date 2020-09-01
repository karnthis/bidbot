export class tableBuilder {
    static users = `CREATE TABLE IF NOT EXISTS users (
    'name' varchar,
    'discordId' varchar PRIMARY KEY,
    'status' varchar,
    'corp' varchar,
    'alliance' varchar
);`;

    static moons = `CREATE TABLE IF NOT EXISTS moons (
    'location' varchar,
    'id' int PRIMARY KEY,
    'details' varchar,
    'status' varchar
);`;

    static auctions = `CREATE TABLE IF NOT EXISTS auctions (
    'location' varchar,
    'id' int PRIMARY KEY,
    'details' varchar,
    'status' varchar,
    'currentHighBidder' varchar,
    'currentBid' int,
    'timeRemaining' date
);`;

    static groups = `CREATE TABLE IF NOT EXISTS groups (
    'name' varchar,
    'ticker' varchar,
    'role' varchar PRIMARY KEY,
    'status' varchar,
    'kredits' int,
    'type' varchar
);`;
}