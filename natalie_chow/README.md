# Town of Salem: Towns vs Mafias

This API stimulates a simplified version of [Town of Salem](https://www.blankmediagames.com/), an online video game inspired by party games like Werewolf and Mafia.

The Town of Salem is a town of chaos. Mafia members often kill at night, either targeting innocent townies or as a result mafia members turning on each other. Luckily, brave townies usually protect their friends at night, though not knowing which side they belong. If someone is killed at night, the town collectively convict a citizen of the crime and lynch them on the spot.

There are 2 main teams in this version of the game, instead of 3 in the original gameplay. The teams are **towns** and **mafias**, whose respective goals are to eliminate each other and take the town to themselves.

# API Reference
## Towns
Town is a resource that follows the CRUD interface.

#### Create
A `POST` request to `/api/towns` allows you to create a new townie (or a town, as named in the game). Customize your new town by sending in data in a JSON-formatted object, which takes the follow options:

| Property     | Data Type | Default    |
| ------------ | --------- | ---------- |
| `name`       | String    | none       |
| `age`        | Number    | none       |
| `occupation` | String    | 'villager' |
| `braveness`  | Number, between 0 and 100 | A randomly generated integer within the range |
`braveness` dictates the town's willingness to be a vigilante and protect another person at night.

#### Retrieve
A `GET` request allows you to access town profile(s), for example:
```
GET /api/towns
// list out information of all towns

GET /api/towns/54321
// list out information of the town with id 54321
```

#### Update
Making a `PUT` request to `/api/towns/[id]` lets you update the profile of the town with id `[id]`. Be sure to pass in a JSON string containing an object with the full profile.

#### Delete
A `DELETE` request to `/api/towns/[id]` will erase the town from the database.


## Mafias
Structured similarly to Town, Mafia is also a resource that follows the CRUD interface.

#### Create
A `POST` request to `/api/mafias` allows you to create a new mafioso (or simply called a mafia). Customize your new mafia by sending in data in a JSON-formatted object, which takes the follow options:

| Property         | Data Type | Default    |
| ---------------- | --------- | ---------- |
| `name`           | String    | none       |
| `age`            | Number    | none       |
| `rank`           | String    | 'average mobster' |
| `weaponOfChoice` | String    | none       |
| `skill`          | Number, between 0 and 100 | A randomly generated integer within the range |
`skill` dictates the mafia's effectiveness to assassinate their target at night.

#### Retrieve
A `GET` request allows you to access mafia profile(s), for example:
```
GET /api/mafias
// list out information of all mafias

GET /api/mafias/54321
// list out information of the mafia with id 54321
```

#### Update
Making a `PUT` request to `/api/mafias/[id]` lets you update the profile of the mafia with id `[id]`. Send with the request a JSON string containing an object with the full profile.

#### Delete
A `DELETE` request to `/api/mafias/[id]` will erase the mafia from the database.


## Game Actions
#### Nighttime mode
```
GET /night
```
As night time falls on the Town of Salem, some brave towns will decide to protect another citizen (town or mafia), while some mafias will pick their target (town or mafia). If a target is being protected for the night, they are prone to any attacks. Otherwise, you will hear the news of an unfortunate citizen.

#### Daytime mode
```
GET /day
```
If there is a crime committed in the previous night, the Town of Salem will vote and convict a citizen. He or she will then be lynched. Nothing will happen if nobody was killed the previous night.

#### Next!
```
GET /next
```
To allow easier and faster gameplay, every `GET` request to `/next` will advance the game by one stage. Consecutive `GET /next` requests will advance the game alternating daytime and nighttime, just like in the original Town of Salem video game.

#### Population count
```
GET /census
// '{ "townsPopulation": "12", "mafiasPopulation": "8", "totalPopulation": "20" }'
```
This request will retrieve the population of Salem at that time.

#### New random game
```
GET /newgame
```
This will reset the database and generate a total of 14 characters (at least 5 towns and 5 mafias) with random settings. Then check out the new population with a `GET` to `/census`!

#### Massacre
```
GET /wipe
```
This allows you to erase all citizens from both teams in one go.

## TL;DR
For a fast gameplay, start the server and then:
1. Initialize with a set of 14 random characters
```
GET /newgame
```
2. Check your population at any time by
```
GET /census
```
3. Progress through the game, **repeat** until you receive a `GAME OVER` message
```
GET /next
```

You can also add, update, delete any characters at anytime.
