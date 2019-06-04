
function get_primitive() {
	go get -u github.com/fogleman/primitive
	export PATH=$PATH:$GOPATH/bin/
}

{
	mkdir -p /opt/build/cache/sqip
	get_primitive
	npm install
	./node_modules/gulp/bin/gulp.js
	bundle exec jekyll build
} 2>&1
