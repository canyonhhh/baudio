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
	const rewindButton = document.getElementById("rewindButton");
	const progressBar = document.getElementById("progressBar");
	const timeDisplay = document.getElementById("timeDisplay");

	// Load timestamp from LocalStorage
	const savedTime = localStorage.getItem("audioTime");
	if (savedTime) {
		audioPlayer.currentTime = savedTime;
	}

	playButton.addEventListener("click", function() {
		audioPlayer.play();
	});

	pauseButton.addEventListener("click", function() {
		audioPlayer.pause();
	});

	rewindButton.addEventListener("click", function() {
		audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);
	});

	// Update progress bar and time display
	audioPlayer.addEventListener("timeupdate", function() {
		const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
		progressBar.value = progress;

		const remainingTime = audioPlayer.duration - audioPlayer.currentTime;
		timeDisplay.textContent = `${formatTime(remainingTime)} / ${formatTime(audioPlayer.duration)}`;

		// Save timestamp to LocalStorage
		localStorage.setItem("audioTime", audioPlayer.currentTime);
	});
});
