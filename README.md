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
}
```

#### Methods

### Match

### Stats
