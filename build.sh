
function get_primitive() {
	go get -u -v github.com/fogleman/primitive
	export PATH=$PATH:$GOPATH/bin/
}

{ 
	get_primitive
	npm install
	gulp
	bundle exec jekyll build
} 2>&1
