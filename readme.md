# gourcelog #

### Purpose ###

Create custom personal logs for visualization with gource.

Tested on OS X 10.7.4 with Node.js 0.8.16

### Quick start ###

* To run type: `node app.js`
* Follow prompt to log tasks
* Use gource to visualize your `gource.log`

### How it works ###

1. The script prompts the user to enter a task:

`Task > Vocabulary`

2. If the task exists it is simply logged with a timestamp (for example):

`Study/Japanese/Vocabulary`

otherwise a new prompt is shown:

`Enter name of parent task > Japanese`

`Enter name of parent task > Study`

`Enter name of parent task >` "ENTER"  (no parent task, done)

This records "Study/Japanese/Vocabulary" to a log file in gource format.

Gource custom log format example:
`1275543595|andrew|A|src/main.cpp`

See [gource readme](https://github.com/acaudwell/Gource) for more info.

Entered tasks are stored in config.json and the log is in gource.log. Both files are created at runtime. The script will automatically log new tasks with 'A' (added) and existing tasks 'M' (modified), which simply means "I worked on this task again" in our case.

It's up to the user to use gource to create visualizations from the log.

### How to use ###

1. In the app directory run:
`node app.js`

2. Enter tasks and their parent tasks.

3. Press "Enter" when done with a task

To generate a basic gource file from the log produced by this program run
`gource gource.log --stop-at-end --camera-mode track -1280x720 -o gource.ppm`

Then convert it to a video:
`ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i gource.ppm -vcodec libx264 -preset ultrafast -crf 1 -threads 0 -bf 0 gource.mp4`

How to customize the look of videos: http://code.google.com/p/gource/wiki/Controls

More info about creating videos: http://code.google.com/p/gource/wiki/Videos


### Features ###

* Each task and its "parent" (if one exists) is saved to config.json.
When you type "Grammar" and then "Japanese" you will not need to enter "Study" as the parent task if you entered "Japanese" previously. The log entry will be "Study/Japanese/Grammar".



### Other info ###

Some additional features that could be implemented:

* Auto-complete for existing tasks

* Adding custom colors to log entries
Gource custom log format allows specifying optional color (in hex):
`1275543595|andrew|A|src/main.cpp|FF0000`

# Author
Shussekaido