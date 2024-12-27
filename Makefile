run: build tsc
	@./bin/main
build:
	@go build -o ./bin/main ./cmd/main.go
tsc:
	npx tsc
