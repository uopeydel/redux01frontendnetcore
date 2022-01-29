docker build --progress=plain --pull --rm -f "DockerfileReactLearn1" -t reactredux1:v1 "."
docker run -it -d -p 9123:80 --name reactredux1name reactredux1:v1 