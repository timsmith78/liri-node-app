// Use dotenv package to grab api keys and secrets
require("dotenv").config();
var keys = require("./keys.js")

// Get Spotify package constructor
var Spotify = require('node-spotify-api');

// Get Twitter package constructor
var Twitter = require('twitter');

// Setup Twitter and Spotify interfaces
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Grab command-line option parameters
var clo = process.argv.slice(2)
var cmd = clo[0]

// Execute the user's command
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
    spotify.search( { type: 'track', query: song }, (error, data) => {
        if (error) {
            console.log(error)
        } else {
            console.log('Artist(s): ')
            data.tracks.items[0].album.artists.forEach( artist => {
                console.log("  " + artist.name)
            })
            console.log('Title: ')
            console.log('  ' +  data.tracks.items[0].name)
            console.log('Preview Link: ')
            console.log('  ' + data.tracks.items[0].preview_url)
            console.log('Album: ')
            console.log('  ' + data.tracks.items[0].album.name)
        }

    })
    break
    case 'movie-this':
    break
    case 'do-what-it-says':
    break
    default:
    console.log("Command '" + cmd + "' not recognized!!")
}