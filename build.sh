#!/bin/bash

function get_primitive() {
	go get -u github.com/fogleman/primitive
	export PATH=$PATH:$GOPATH/bin/
}

get_primitive
gulp
bundle exec jekyll serve
