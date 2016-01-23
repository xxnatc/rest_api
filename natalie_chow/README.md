# Town of Salem: Towns vs Mafias

This API stimulates a simplified version of [Town of Salem](https://www.blankmediagames.com/), an online video game inspired by party games like Werewolf and Mafia.

There are 2 main teams in this API, instead of 3 in the original gameplay. The teams are **towns** and **mafias**, whose respective goals are to eliminate each other and take the town to themselves.

## API Reference
### Towns
Town is a resource that follows the CRUD interface.

##### Create
A `POST` request to `/api/towns` allows you to create a new townsman (or a town, as named in the game). Customize your new town by sending in data in a JSON-formatted object, which takes the follow options:

| Property     | Data Type | Default    |
| ------------ | --------- | ---------- |
| `name`       | String    | none       |
| `age`        | Number    | none       |
| `occupation` | String    | 'villager' |
| `braveness`  | Number, between 0 and 100 | A randomly generated integer within the range |
`braveness` dictates the town's willingness to be a vigilante and protect another person at night.

##### Retrieve
A `GET` request allows you to access town profile(s), for example:
```
GET /api/towns
// list out information of all towns

GET /api/towns/54321
// list out information of the town with id 54321
```

##### Update
Making a `PUT` request to `/api/towns/[id]` lets you update the profile of the town with id `[id]`. Be sure to pass in a JSON string containing an object with the full profile.

##### Delete
A `DELETE` request to `/api/towns/[id]` will erase the town from the database.


### Mafias
Structured similar to Town, Mafia is also a resource that follows the CRUD interface.

##### Create
A `POST` request to `/api/mafias` allows you to create a new mafioso (or simply called a mafia). Customize your new mafia by sending in data in a JSON-formatted object, which takes the follow options:

| Property         | Data Type | Default    |
| ---------------- | --------- | ---------- |
| `name`           | String    | none       |
| `age`            | Number    | none       |
| `rank`           | String    | 'average mobster' |
| `weaponOfChoice` | String    | none       |
| `skill`          | Number, between 0 and 100 | A randomly generated integer within the range |
`skill` dictates the mafia's effectiveness to assassinate their target at night.

##### Retrieve
A `GET` request allows you to access mafia profile(s), for example:
```
GET /api/mafias
// list out information of all mafias

GET /api/mafias/54321
// list out information of the mafia with id 54321
```

##### Update
Making a `PUT` request to `/api/mafias/[id]` lets you update the profile of the mafia with id `[id]`. Send with the request a JSON string containing an object with the full profile.

##### Delete
A `DELETE` request to `/api/mafias/[id]` will erase the mafia from the database.

### Game Actions
##### Population count
Performing the following request will retrieve the population of Salem:
```
GET /census
// '{ "townsPopulation": "12", "mafiasPopulation": "8", "totalPopulation": "20" }'
```

##### New random game
```
GET /newgame
```
will reset the database and generate a total of 14 characters (at least 5 towns and 5 mafias) with random settings. Then check out the new population with a `GET` to `/census`!

##### Massacre
To erase all characters in both teams, do the following:
```
GET /wipe
```
