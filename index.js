var YoutubeMp3Downloader = require("youtube-mp3-downloader");
var path = require("path")
const NodeID3 = require('node-id3')


var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('file.in')
});

lineReader.on('line', function (line) {
  dler(line)
});



function dler(url){
	//Configure YoutubeMp3Downloader with your settings
	var YD = new YoutubeMp3Downloader({
	    "ffmpegPath": "/usr/bin/ffmpeg",        // Where is the FFmpeg binary located?
	    "outputPath": "/home/bailey/Documents/music-dl/downloaded music",    // Where should the downloaded and encoded files be stored?
	    "youtubeVideoQuality": "highest",       // What video quality should be used?
	    "queueParallelism": 2,                  // How many parallel downloads/encodes should be started?
	    "progressTimeout": 2000                 // How long should be the interval of the progress reports
	});

	//Download video and save as MP3 file
	YD.download(url);

	YD.on("finished", function(err, data) {
	    console.log(JSON.stringify(data));
	    var title_data = data["title"]
	    var song_path = path.resolve('/home/bailey/Documents/music-dl/downloaded music', (data["videoTitle"] + ".mp3"));
	    var cover = data["thumbnail"]
	    var artist_data = (data["artist"])

	    var fs = require('fs'),
	    request = require('request');

		var download = function(uri, filename, callback){
		  request.head(uri, function(err, res, body){
		    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
		  });
		};

		download(cover, 'cover.jpg', function(){
		  //Write song metadata
		    var tags = {
			  artist: artist_data,
			  title: title_data,
			  album: "YT Downloads",
			  APIC: 'cover.jpg'
			};
			
			let success = NodeID3.write(tags, song_path) //  Returns true/false
			NodeID3.write(tags, song_path, function(err) {})

			let tags_read = NodeID3.read(song_path)
			NodeID3.read(song_path, function(tags_read){})
		});
	    
	    

	});

	YD.on("error", function(error) {
	    console.log(error);
	});

	YD.on("progress", function(progress) {
	    //console.log(JSON.stringify(progress));
	});
}

