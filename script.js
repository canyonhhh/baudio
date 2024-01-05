// Function to format time in HH:MM:SS
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

document.addEventListener("DOMContentLoaded", function() {
    const audioPlayer = document.getElementById("audioPlayer");
    const playButton = document.getElementById("playButton");
    const pauseButton = document.getElementById("pauseButton");
    const progressBar = document.getElementById("progressBar");
    const timeDisplay = document.getElementById("timeDisplay");

    // Fetch the current timestamp
    fetch('/timestamp')
        .then(response => response.text())
        .then(timestamp => {
            audioPlayer.currentTime = parseFloat(timestamp);
        });

    setInterval(() => {
        const timestamp = audioPlayer.currentTime;
        // Log the current timestamp every 10 seconds
        fetch('/timestamp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: "log", timestamp })
        });
    }, 10000);

    playButton.addEventListener("click", function() {
        // Fetch the current timestamp and play
        fetch('/timestamp')
            .then(response => response.text())
            .then(timestamp => {
                audioPlayer.currentTime = parseFloat(timestamp);
                audioPlayer.play();
            });
    });

    pauseButton.addEventListener("click", function() {
        audioPlayer.pause();
        const timestamp = audioPlayer.currentTime;
        // Save the current timestamp when paused
        fetch('/timestamp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: "save", timestamp })
        });
    });

    // Update progress bar and time display
    audioPlayer.addEventListener("timeupdate", function() {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progress;

        const remainingTime = audioPlayer.duration - audioPlayer.currentTime;
        timeDisplay.textContent = `${formatTime(audioPlayer.currentTime)} / ${formatTime(audioPlayer.duration)}`;
    });
});
