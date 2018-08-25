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

// Log command and output to screen and file (like Unix 'tee' command)
const logFile = "log.txt"
fs.appendFile(logFile, "\n" + clo.join(' ') + "\n", error => {
    if (error) {
        console.log(error)
    }
})
function tee(message) {
    fs.appendFileSync(logFile, message  + '\n')
    console.log(message)
}

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
                        tee(tweet.text)
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
                        tee("  " + artist.name)
                    })
                    tee('Title: ')
                    tee('  ' + data.tracks.items[0].name)
                    tee('Preview Link: ')
                    tee('  ' + data.tracks.items[0].preview_url)
                    tee('Album: ')
                    tee('  ' + data.tracks.items[0].album.name)
                }

            })
            break
        case 'movie-this':
            let movie = clo[1] ? clo[1] : 'Mr. Nobody'
            request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    let info = JSON.parse(body)
                    tee("Title: ")
                    tee(info.Title)
                    tee("Year: ")
                    tee(info.Year)

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
                    tee("IMDB Rating: ")
                    tee(imdbRating)
                    tee("Rotten Tomatoes Rating: ")
                    tee(rtRating)
                    tee("Country of origin: ")
                    tee(info.Country)
                    tee("Language: ")
                    tee(info.Language)
                    tee("Plot: ")
                    tee(info.Plot)
                    tee("Actors: ")
                    tee(info.Actors)
                }
            })
            break
	case 'google-this':
	    return	
        case 'do-what-it-says':
            return
        default:
            tee("Command '" + cmd + "' not recognized!!")
    }
}

execLiriCmd(cmd)
