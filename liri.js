// Use dotenv package to grab api keys and secrets
require("dotenv").config();
var keys = require("./keys.js")

// Get Spotify package constructor
var Spotify = require('node-spotify-api');

// Get Twitter package constructor
var Twitter = require('twitter')

// Get request library
var request = require("request")

// Get fs library for file system interaction
var fs = require("fs")

// Setup Twitter and Spotify interfaces
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Grab command-line option parameters
var clo = process.argv.slice(2)
var cmd = clo[0]

// Check for 'do-what-it-says
if (cmd === 'do-what-it-says') {
    fs.readFile("./random.txt", "utf8", (error, data) => {
        if (error) {
            return console.log(error)
        }
        clo = data.split(",")
        execLiriCmd(clo[0])
    })
}

// Execute the user's command
function execLiriCmd(cmd) {
    switch (cmd) {
        // List my last 20 tweets
        case 'my-tweets':
            let params = {
                screen_name: 'Tim38746973',
                count: 20
            }
            client.get('statuses/user_timeline', params, (error, tweets, response) => {
                if (error) {
                    console.log(error)
                } else {
                    tweets.forEach(tweet => {
                        console.log(tweet.text)
                    });
                }
            })
            break

        case 'spotify-this-song':
            let song = clo[1] ? clo[1] : 'Ace of Base The Sign'
            spotify.search({ type: 'track', query: song }, (error, data) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log('Artist(s): ')
                    data.tracks.items[0].album.artists.forEach(artist => {
                        console.log("  " + artist.name)
                    })
                    console.log('Title: ')
                    console.log('  ' + data.tracks.items[0].name)
                    console.log('Preview Link: ')
                    console.log('  ' + data.tracks.items[0].preview_url)
                    console.log('Album: ')
                    console.log('  ' + data.tracks.items[0].album.name)
                }

            })
            break
        case 'movie-this':
            let movie = clo[1] ? clo[1] : 'Mr. Nobody'
            request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    let info = JSON.parse(body)
                    console.log("Title: ")
                    console.log(info.Title)
                    console.log("Year: ")
                    console.log(info.Year)

                    let ratings = info.Ratings
                    let imdbRating = ""
                    let rtRating = ""
                    ratings.forEach(rating => {
                        switch (rating.Source) {
                            case "Internet Movie Database":
                                imdbRating = rating.Value
                                break
                            case "Rotten Tomatoes":
                                rtRating = rating.Value
                                break
                        }
                    })
                    console.log("IMDB Rating: ")
                    console.log(imdbRating)
                    console.log("Rotten Tomatoes Rating: ")
                    console.log(rtRating)
                    console.log("Country of origin: ")
                    console.log(info.Country)
                    console.log("Language: ")
                    console.log(info.Language)
                    console.log("Plot: ")
                    console.log(info.Plot)
                    console.log("Actors: ")
                    console.log(info.Actors)
                }
            })
            break
        case 'do-what-it-says':
            return
        default:
            console.log("Command '" + cmd + "' not recognized!!")
    }
}

execLiriCmd(cmd)