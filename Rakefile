require 'bundler/setup'

task default: %w[serve]

task :serve do
  sh "gulp"
  sh "bundle exec jekyll serve"
end

task :build do
  sh "bundle exec jekyll build -V"
end
