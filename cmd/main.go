package main

import (
	"log"
	"net/http"
)

func main() {

	router := http.NewServeMux()
	fs := http.FileServer(http.Dir("./public/"))
	router.Handle("/", fs)

	log.Println("listening on port:8080")
	http.ListenAndServe(":8080", router)
}
