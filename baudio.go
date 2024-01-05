package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"
	"time"
)

const (
	timestampFile = "timestamp.txt"
	logFile       = "/var/log/timestamp_changes.log"
)

func saveTimestamp(timestamp string) error {

	// If timestamp is less than the current timestamp, return an error

	currentTimestamp, err := getTimestamp()

	if err != nil {
		return err
	}

	if timestamp < currentTimestamp {
		return logTimestamp("Timestamp not saved. " + timestamp + " is less than the current timestamp: " + currentTimestamp)
	}

	// else save the timestamp to the timestamp file and log the change

	ioutil.WriteFile(timestampFile, []byte(timestamp), 0644)

	if err != nil {
		return err
	}
	return logTimestamp("Timestamp changed to: " + timestamp)
}

func getTimestamp() (string, error) {
	timestamp, err := ioutil.ReadFile(timestampFile)
	if err != nil {
		return "", err
	}
	return string(timestamp), nil
}

func logTimestamp(message string) error {
	currentTime := time.Now().Format("2006-01-02 15:04:05")
	logMessage := currentTime + " - " + message + "\n"
	return appendToFile(logFile, logMessage)
}

func appendToFile(filename, text string) error {
	f, err := os.OpenFile(filename, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return err
	}
	defer f.Close()
	_, err = f.WriteString(text)
	return err
}

func handler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		var data struct {
			Action    string `json:"action"`
			Timestamp string `json:"timestamp"`
		}
		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		switch data.Action {
		case "save":
			err := saveTimestamp(data.Timestamp)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			w.Write([]byte("Timestamp saved."))
		case "log":
			err := logTimestamp("Timestamp logged: " + data.Timestamp)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			w.Write([]byte("Timestamp logged."))
		default:
			http.Error(w, "Invalid action", http.StatusBadRequest)
		}
	case "GET":
		timestamp, err := getTimestamp()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Write([]byte(timestamp))
	default:
		http.Error(w, "Unsupported method", http.StatusMethodNotAllowed)
	}
}

func main() {
	http.HandleFunc("/", handler)
	http.ListenAndServe(":8080", nil)
}
