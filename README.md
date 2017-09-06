# ryerson-smash-api
An API to track players and matchups for the Ryerson Smash Bros. Community

## Documentation

* [Player](#player)
* [Match](#match)
* [Stats](stats)


### Player

#### Format

```
{
  _id: Number,
  name: String,
  tag: String,
  main: String,
  secondary: String
  stages: {
            bf: {
               wins: Number,
               losses: Number,
            },
            dl: {
               wins: Number,
               losses: Number,
           },
            ps: {
               wins: Number,
               losses: Number,
            },
            fd: {
               wins: Number,
               losses: Number,
            },
            ys: {
               wins: Number,
               losses: Number,
            },
            other: {
               wins: Number,
               losses: Number,
            }
    },
    wins: Number,
    losses: Number,
    rating: Number
}
```

#### Endpoints

```
GET /player 
```
##### Parameters
`name` The name of the player to look up. \
`tag` The tag of the player to look up.

`name` and `tag` can be used separately or together, however there is 
no guarantee that there will only be one player with a tag or name.

```
GET /player/:id
```
`id` The player with playerID id to look up.

```
POST /player
```

##### Body (x-www-form-urlencoded)
`name`  _(required)_  The name of the player to add. \
`tag`  _(required)_ The tag of the player to add. \
`main`  _(required)_ The character that the player mains.  \
`secondary` _(optional)_ The player's secondary character.

`main` and `secondary` must match a character from the [Characters.js](https://github.com/darwintr/ryerson-smash-api/blob/master/src/api/constants/Characters.js) file.

```
PUT /player
```

##### Parameters
`name` _(required)_ The name of the player to update. \
`tag` _(required)_ The tag of the player to update. \
`nname` _(optional)_ The new name of the player. \
`ntag` _(optional)_ The new tag of the player. \
`nmain` _(optional)_ The new main of the player.

`nmain` must match a character from the [Characters.js](https://github.com/darwintr/ryerson-smash-api/blob/master/src/api/constants/Characters.js) file.

```
DELETE /player 
```
##### Parameters
`name` _(required)_  The name of the player to delete. \
`tag` _(required)_ The tag of the player to delete.

### Match

#### Format
```
{
  _id: Number,
  stage: String,
  players: [
      {
          _playerID: Number,
          character: String,
          winner: Boolean
      },
      {
          _playerID: Number,
          character: String,
          winner: Boolean
      }
  ]
}
```

### Endpoints

```
POST /match
```
##### Body (application/json)
`players` _(required)_ Array of simplified player objects with `_playerID`, `character`, and `winner`. \
`stage` _(required)_ The stage that the match was played on.
___
`_playerID` _(required)_ ID of the player. \
`character` _(required)_ The character the player used. \
`winner` _(required)_ A boolean for whether or not they won.

`stage` must match a stage from the [Stages.js](https://github.com/darwintr/ryerson-smash-api/blob/master/src/api/constants/Stages.js) file.